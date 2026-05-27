# LLM-Powered Chat Popup with RAG

## Overview

Replace the existing hardcoded ChatWidget with a real LLM-powered chatbot that
answers questions **only from website content**. Uses RAG (Retrieval Augmented
Generation) with vector search + Gemini API for chat generation.

## Architecture

```
User message → ChatWidget → POST /api/v1/chat → Gemini API
                              ↓
                          Generate embedding (Ollama nomic-embed-text)
                              ↓
                          Vector search (pgvector, 8 content types)
                              ↓
                          Build context from search results
                              ↓
                          Call Gemini with context + system prompt
                              ↓
                          SSE stream → ChatWidget renders tokens
```

## Components

### 1. New DB Table: `site_pages`

For static page content (About, Contact, FAQ) that isn't in the 7 dynamic
content types.

```sql
CREATE TABLE site_pages (
    id           SERIAL PRIMARY KEY,
    slug         TEXT UNIQUE NOT NULL,
    title        TEXT NOT NULL,
    content      TEXT NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ,
    embedding    VECTOR(768)
);
```

- 768 dimensions to match `nomic-embed-text`
- Seed with about-us, contact-us, FAQ content
- Added to the embedding reindex pipeline

### 2. Backend: `POST /api/v1/chat`

**New file:** `internal/chat/` (handler.go, service.go, routes.go)

**Request:**
```json
{
    "message":    "What scholarships are available for +2?",
    "session_id": "uuid-string"
}
```

**Response:** SSE stream (`text/event-stream`)

```
data: {"token": "Based"}
data: {"token": " on"}
data: {"token": " the"}
data: {"token": " website"}
data: {"token": " content"}
data: {"token": "..."}
data: {"done": true}
```

**Flow:**
1. Generate embedding for `message` via existing `embedding.Service`
2. Vector search across all 8 content types via existing `search.Service`, top 5 results
3. Build structured context string per result
4. System prompt:
   > "You are StudSphere AI, a helpful assistant for StudSphere.com — Nepal's
   > college and scholarship discovery platform. Answer ONLY from the provided
   > context. If the context doesn't contain enough information to answer, say
   > 'I don't have information about that.' Never make up or guess information.
   > Be concise and helpful. Always cite which part of the website the
   > information comes from."
5. Call Gemini API (REST, no SDK) with system prompt + context + message
6. Stream tokens back as SSE events

**Environment config:**
```
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash-lite   # cheap, fast, small
```

**Session support (conversation memory):**
- In-memory `map[sessionID][]Message` with LRU eviction (max 1000 sessions)
- Last 6 messages (3 user + 3 assistant) included in Gemini call
- Session created by client on mount, sent with every request

### 3. Backend: Update Embedding Reindex

Add `site_pages` to `internal/embedding/service.go` → `ReindexAll()`.

### 4. Frontend: Update ChatWidget

Replace the hardcoded `parseInput()` flow with real API calls.

**New file:** `services/chat.api.ts`
- `sendChatMessage(message, sessionId, onToken, onDone, onError)` — uses
  `fetch()` with streaming response, calls `onToken` for each SSE token

**Updates to** `components/chat/ChatWidget.tsx`:
- Generate `session_id` (UUID v4) on mount in `useState`
- Replace `handleSend()` → call `sendChatMessage()` with streaming
- Render streamed tokens as they arrive (replaces hardcoded responses)
- Keep existing UI: floating button, panel, fullscreen mode, typing indicator,
  "StudSphere AI" branding, message bubbles
- Keep fallback: if API is unreachable, show "I'm having trouble connecting"

## Content Sources (8 types)

| Type | DB Table | Source |
|------|----------|--------|
| Colleges | `colleges` | DB |
| Courses | `courses` | DB |
| Scholarships | `scholarships` | DB |
| News | `news` | DB |
| Events | `events` | DB |
| Exams | `exams` | DB |
| Blogs | `blogs` | DB |
| Static Pages | `site_pages` | Seeded manually |

## Security

- Gemini API key is server-side only in backend config/env
- No LLM calls from frontend/browser
- System prompt enforced on server — cannot be bypassed by client
- Rate limiting on `/api/v1/chat` (e.g., 30 req/min per IP)

## Configuration

Add to `.env`:
```
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash-lite
CHAT_RATE_LIMIT=30
CHAT_MAX_CONTEXT_LENGTH=6000
```

## Error Handling

| Scenario | Frontend | Backend |
|----------|----------|---------|
| Gemini API down | Show "Service unavailable" | Return SSE error event, log |
| No relevant content found | "I don't have info about that" | Gemini called with empty context, system prompt handles it |
| Rate limit exceeded | "Please wait before asking again" | Return 429 |
| Invalid message | Show validation error | Return 400 |
