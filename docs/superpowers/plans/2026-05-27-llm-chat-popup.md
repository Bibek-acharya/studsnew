# LLM Chat Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace hardcoded ChatWidget responses with real LLM RAG that answers only from website content.

**Architecture:** New Go backend module `internal/chat/` that generates embeddings via Ollama, searches pgvector across 8 content types, builds context, calls Gemini API for chat completion, and streams tokens back via SSE. Frontend ChatWidget updated to consume the stream.

**Tech Stack:** Go (Gin + GORM), Gemini API (REST), SSE streaming, React (ChatWidget), pgvector

---

### Task 1: Add `site_pages` table + seed data

**Files:**
- Create: `studsback/internal/chat/site_page.go`
- Modify: `studsback/internal/shared/config/database.go` (auto-migrate)
- Create: `studsback/internal/chat/seed.go`

- [ ] **Step 1: Create site_page model**

Write `studsback/internal/chat/site_page.go`:

```go
package chat

import (
	"time"

	"gorm.io/gorm"
)

type SitePage struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Slug      string         `gorm:"uniqueIndex;not null" json:"slug"`
	Title     string         `gorm:"not null" json:"title"`
	Content   string         `gorm:"type:text;not null" json:"content"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Embedding []float32      `gorm:"type:vector(768)" json:"-"`
}

func (SitePage) TableName() string {
	return "site_pages"
}
```

- [ ] **Step 2: Add auto-migrate**

In `studsback/internal/shared/config/database.go`, add import and migration:

```go
import "studsphere/backend/internal/chat"
```

Add inside the `if postgresDB != nil` block after existing migrations:

```go
if err := postgresDB.AutoMigrate(&chat.SitePage{}); err != nil {
    log.Printf("Warning: failed to migrate site_pages: %v", err)
}
```

- [ ] **Step 3: Create seed data**

Write `studsback/internal/chat/seed.go`:

```go
package chat

import (
	"log"

	"gorm.io/gorm"
)

func SeedSitePages(db *gorm.DB) {
	pages := []SitePage{
		{
			Slug:  "about-us",
			Title: "About StudSphere",
			Content: `StudSphere is Nepal's leading college discovery and scholarship platform. ` +
				`We help students find the perfect college, compare courses, and apply for scholarships. ` +
				`Our platform lists hundreds of colleges across Nepal, including Tribhuvan University affiliated colleges, ` +
				`Pokhara University, Kathmandu University, Purbanchal University, and more. ` +
				`We offer college finder tools, course finder, scholarship finder, college comparison, ` +
				`campus forum, and counselling services. ` +
				`Our partners include Project Shiksha (Sowers Action Nepal), Sowers Hong Kong, RONB, Ncell, ` +
				`Creating Opportunities, and Dari Club USA. ` +
				`We have scholarship programs like Project Shiksha that provide full financial support, ` +
				`accommodation, meals, and mentoring to deserving students.`,
		},
		{
			Slug:  "contact-us",
			Title: "Contact StudSphere",
			Content: `You can contact StudSphere through our website contact form. ` +
				`Visit the Contact Us page on StudSphere.com to submit inquiries. ` +
				`We handle inquiries about college admissions, scholarships, partnerships, and general support.` +
				`Our team is available to help students find the right college and scholarship opportunities in Nepal.`,
		},
		{
			Slug:  "faq",
			Title: "Frequently Asked Questions",
			Content: `StudSphere helps students discover colleges and scholarships in Nepal. ` +
				`Common topics include: how to find colleges using the college finder tool, ` +
				`how to compare colleges side by side, how to use the scholarship finder to discover financial aid, ` +
				`how to apply for scholarships through the platform, ` +
				`how to use the course finder to explore programs by field and level, ` +
				`how to book counselling sessions for personalized guidance, ` +
				`and how the college recommender works based on student preferences. ` +
				`Students can browse colleges by location (Kathmandu, Pokhara, Chitwan, Lalitpur, Bhaktapur, etc.), ` +
				`by type (private, public, community, constituent, foreign affiliated), ` +
				`and by program level (+2, bachelor, master, diploma, A Level).`,
		},
	}

	for _, page := range pages {
		var existing SitePage
		result := db.Where("slug = ?", page.Slug).First(&existing)
		if result.Error != nil {
			if err := db.Create(&page).Error; err != nil {
				log.Printf("Failed to seed site_page %s: %v", page.Slug, err)
			} else {
				log.Printf("Seeded site_page: %s", page.Slug)
			}
		} else {
			db.Model(&existing).Updates(map[string]interface{}{
				"title":   page.Title,
				"content": page.Content,
			})
		}
	}
}
```

- [ ] **Step 4: Wire seed into startup**

In `studsback/cmd/server/main.go`, after `db` is initialized (around line 165-170), add:

```go
chat.SeedSitePages(db)
```

Make sure to add the import.

---

### Task 2: Add Gemini config fields

**Files:**
- Modify: `studsback/internal/shared/config/config.go`

- [ ] **Step 1: Add fields to Config struct**

```go
GeminiAPIKey  string // GEMINI_API_KEY
GeminiModel   string // GEMINI_MODEL (default: "gemini-2.0-flash-lite")
```

- [ ] **Step 2: Add defaults in Load()**

```go
GeminiAPIKey:  getEnv("GEMINI_API_KEY", ""),
GeminiModel:   getEnv("GEMINI_MODEL", "gemini-2.0-flash-lite"),
```

---

### Task 3: Create chat service (Gemini client + RAG)

**Files:**
- Create: `studsback/internal/chat/service.go`

- [ ] **Step 1: Write chat service**

```go
package chat

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"studsphere/backend/internal/embedding"
	"studsphere/backend/internal/shared/config"

	"gorm.io/gorm"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatRequest struct {
	Message   string `json:"message"`
	SessionID string `json:"session_id"`
}

type contextResult struct {
	Title       string `json:"title"`
	Type        string `json:"type"`
	Description string `json:"description"`
	Content     string `json:"content,omitempty"`
}

type Service struct {
	db          *gorm.DB
	sessions    map[string][]Message
	sessionsMu  sync.RWMutex
	httpClient  *http.Client
}

func NewService(db *gorm.DB) *Service {
	return &Service{
		db:        db,
		sessions:  make(map[string][]Message),
		httpClient: &http.Client{Timeout: 60 * time.Second},
	}
}

func (s *Service) Chat(stream io.Writer, req ChatRequest) error {
	if req.Message == "" {
		return fmt.Errorf("message is required")
	}

	// 1. Generate embedding for the query
	vec, err := embedding.GenerateEmbedding(req.Message)
	if err != nil {
		log.Printf("Chat: embedding generation failed: %v", err)
	}

	// 2. Search for relevant content
	var contextItems []contextResult
	if err == nil && len(vec) > 0 {
		contextItems = s.vectorSearch(vec)
	}
	if len(contextItems) == 0 {
		contextItems = s.keywordSearch(req.Message)
	}

	// 3. Build context string
	contextStr := s.buildContext(contextItems)

	// 4. Build conversation history
	var systemMsg string
	if contextStr == "" {
		systemMsg = "You are StudSphere AI, a helpful assistant for StudSphere.com. " +
			"Answer ONLY from the provided context below. If there is no context, say " +
			"'I don't have information about that.' Never make up or guess information. Be concise."
	} else {
		systemMsg = "You are StudSphere AI, a helpful assistant for StudSphere.com — Nepal's " +
			"college and scholarship discovery platform. Answer ONLY from the provided context. " +
			"If the context doesn't contain enough information to answer, say " +
			"'I don't have information about that.' Never make up or guess information. " +
			"Be concise and helpful. Here is the website content to answer from:\n\n" + contextStr
	}

	// 5. Call Gemini API
	return s.callGemini(stream, systemMsg, req)
}

func (s *Service) vectorSearch(vec []float32) []contextResult {
	var results []contextResult
	vectorStr := embedding.Float32SliceToPgVector(vec)

	tables := []struct {
		name   string
		selectSQL string
		titleField string
		descField string
		contentField string
	}{
		{"colleges", "id, COALESCE(name,'') as title, COALESCE(description,'') as description, COALESCE(description,'') as content", "name", "description", "description"},
		{"courses", "id, COALESCE(title,'') as title, COALESCE(description,'') as description, COALESCE(description,'') as content", "title", "description", "description"},
		{"exams", "id, COALESCE(title,'') as title, COALESCE(description,'') as description, COALESCE(description,'') as content", "title", "description", "description"},
		{"scholarships", "id, COALESCE(title,'') as title, COALESCE(description,'') as description, COALESCE(description,'') as content", "title", "description", "description"},
		{"news", "id, COALESCE(title,'') as title, COALESCE(excerpt,'') as description, COALESCE(content,'') as content", "title", "excerpt", "content"},
		{"events", "id, COALESCE(title,'') as title, COALESCE(description,'') as description, COALESCE(description,'') as content", "title", "description", "description"},
		{"blogs", "id, COALESCE(title,'') as title, COALESCE(excerpt,'') as description, COALESCE(content,'') as content", "title", "excerpt", "content"},
		{"site_pages", "id, COALESCE(title,'') as title, COALESCE(content,'') as description, COALESCE(content,'') as content", "title", "content", "content"},
	}

	for _, t := range tables {
		sql := fmt.Sprintf("SELECT %s, '%s' as type FROM %s WHERE embedding IS NOT NULL AND embedding <=> '%s'::vector < 1.5 ORDER BY embedding <=> '%s'::vector LIMIT 5",
			t.selectSQL, t.name, t.name, vectorStr, vectorStr)
		var rows []contextResult
		if err := s.db.Raw(sql).Scan(&rows).Error; err != nil {
			continue
		}
		results = append(results, rows...)
	}

	return results
}

func (s *Service) keywordSearch(q string) []contextResult {
	var results []contextResult
	like := "%" + strings.ToLower(q) + "%"

	// Search site_pages by keyword
	var sitePages []contextResult
	s.db.Table("site_pages").
		Select("id, title, content as description, content as content, 'site_page' as type").
		Where("LOWER(title) LIKE ? OR LOWER(content) LIKE ?", like, like).
		Limit(3).Scan(&sitePages)
	for i := range sitePages {
		results = append(results, sitePages[i])
	}

	// Search other content types
	var colleges []contextResult
	s.db.Table("colleges").
		Select("id, name as title, COALESCE(description,'') as description, COALESCE(description,'') as content, 'college' as type").
		Where("LOWER(COALESCE(name,'')) LIKE LOWER(?) OR LOWER(COALESCE(description,'')) LIKE LOWER(?)", like, like).
		Limit(3).Scan(&colleges)
	results = append(results, colleges...)

	var scholarships []contextResult
	s.db.Table("scholarships").
		Select("id, title, COALESCE(description,'') as description, COALESCE(description,'') as content, 'scholarship' as type").
		Where("LOWER(COALESCE(title,'')) LIKE LOWER(?) OR LOWER(COALESCE(description,'')) LIKE LOWER(?)", like, like).
		Limit(3).Scan(&scholarships)
	results = append(results, scholarships...)

	var news []contextResult
	s.db.Table("news").
		Select("id, title, COALESCE(excerpt,'') as description, COALESCE(content,'') as content, 'news' as type").
		Where("LOWER(COALESCE(title,'')) LIKE LOWER(?) OR LOWER(COALESCE(content,'')) LIKE LOWER(?)", like, like).
		Limit(3).Scan(&news)
	results = append(results, news...)

	return results
}

func (s *Service) buildContext(items []contextResult) string {
	if len(items) == 0 {
		return ""
	}

	var b strings.Builder
	for i, item := range items {
		if i > 0 {
			b.WriteString("\n---\n")
		}
		b.WriteString(fmt.Sprintf("[%s] %s\n", item.Type, item.Title))
		content := item.Content
		if content == "" {
			content = item.Description
		}
		if len([]rune(content)) > 500 {
			content = string([]rune(content)[:500]) + "..."
		}
		b.WriteString(content)
	}
	return b.String()
}

func (s *Service) callGemini(stream io.Writer, systemMsg string, req ChatRequest) error {
	apiKey := config.AppConfig.GeminiAPIKey
	if apiKey == "" {
		return fmt.Errorf("Gemini API key not configured")
	}

	model := config.AppConfig.GeminiModel
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:streamGenerateContent?alt=sse&key=%s", model, apiKey)

	// Build contents array
	var contents []map[string]interface{}

	// System instruction
	systemInstruction := map[string]interface{}{
		"parts": []map[string]string{{"text": systemMsg}},
	}

	// Get session history
	sessionID := req.SessionID
	if sessionID == "" {
		sessionID = "default"
	}

	s.sessionsMu.RLock()
	history := make([]Message, len(s.sessions[sessionID]))
	copy(history, s.sessions[sessionID])
	s.sessionsMu.RUnlock()

	// Add history to contents
	for _, msg := range history {
		contents = append(contents, map[string]interface{}{
			"role": msg.Role,
			"parts": []map[string]string{{"text": msg.Content}},
		})
	}

	// Add current user message
	contents = append(contents, map[string]interface{}{
		"role": "user",
		"parts": []map[string]string{{"text": req.Message}},
	})

	payload := map[string]interface{}{
		"system_instruction": systemInstruction,
		"contents":           contents,
		"generationConfig": map[string]interface{}{
			"temperature":     0.2,
			"maxOutputTokens": 1024,
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequest("POST", url, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		return fmt.Errorf("Gemini API request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("Gemini API returned %d: %s", resp.StatusCode, string(respBody))
	}

	// Parse SSE stream
	var fullResponse strings.Builder
	decoder := json.NewDecoder(resp.Body)
	for {
		var geminiResp struct {
			Candidates []struct {
				Content struct {
					Parts []struct {
						Text string `json:"text"`
					} `json:"parts"`
				} `json:"content"`
				FinishReason string `json:"finishReason"`
			} `json:"candidates"`
		}
		if err := decoder.Decode(&geminiResp); err != nil {
			if err == io.EOF {
				break
			}
			// Try reading raw SSE lines
			break
		}

		for _, candidate := range geminiResp.Candidates {
			for _, part := range candidate.Content.Parts {
				if part.Text != "" {
					token, _ := json.Marshal(map[string]string{"token": part.Text})
					fmt.Fprintf(stream, "data: %s\n\n", token)
					fullResponse.WriteString(part.Text)
				}
			}
		}
	}

	// Send done signal
	done, _ := json.Marshal(map[string]bool{"done": true})
	fmt.Fprintf(stream, "data: %s\n\n", done)

	// Save to session history
	if fullResponse.Len() > 0 {
		s.sessionsMu.Lock()
		s.sessions[sessionID] = append(s.sessions[sessionID],
			Message{Role: "user", Content: req.Message},
			Message{Role: "model", Content: fullResponse.String()},
		)
		// Keep last 6 messages (3 turns)
		if len(s.sessions[sessionID]) > 6 {
			s.sessions[sessionID] = s.sessions[sessionID][len(s.sessions[sessionID])-6:]
		}
		s.sessionsMu.Unlock()
	}

	return nil
}
```

- [ ] **Step 2: Verify compilation**

Run: `cd /home/durgesh/Work/studsphere/studsback && go build ./internal/chat/...`

Expected: clean compile

---

### Task 4: Create chat handler + routes

**Files:**
- Create: `studsback/internal/chat/handler.go`
- Create: `studsback/internal/chat/routes.go`

- [ ] **Step 1: Write handler**

Write `studsback/internal/chat/handler.go`:

```go
package chat

import (
	"io"
	"net/http"

	"studsphere/backend/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Chat(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request: message is required")
		return
	}

	if req.Message == "" {
		response.Error(c, http.StatusBadRequest, "message is required")
		return
	}

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("X-Accel-Buffering", "no")

	stream := c.Writer
	if err := h.service.Chat(stream, req); err != nil {
		// Try to send error as SSE
		errData, _ := json.Marshal(map[string]string{"error": err.Error()})
		fmt.Fprintf("data: %s\n\n", errData)
	}
}
```

Wait, I need to add proper imports. Let me fix the handler.

Write `studsback/internal/chat/handler.go`:

```go
package chat

import (
	"encoding/json"
	"fmt"
	"net/http"

	"studsphere/backend/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Chat(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request: message is required")
		return
	}

	if req.Message == "" {
		response.Error(c, http.StatusBadRequest, "message is required")
		return
	}

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("X-Accel-Buffering", "no")

	if err := h.service.Chat(c.Writer, req); err != nil {
		errData, _ := json.Marshal(map[string]string{"error": err.Error()})
		fmt.Fprintf(c.Writer, "data: %s\n\n", errData)
	}
}
```

- [ ] **Step 2: Write routes**

Write `studsback/internal/chat/routes.go`:

```go
package chat

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine) {
	if r == nil {
		return
	}

	v1 := r.Group("/api/v1")
	{
		v1.POST("/chat", nil) // placeholder, handler set via SetHandler
	}
}
```

Actually, looking at the existing pattern more carefully, all route registrations follow the same signature: `RegisterRoutes(r *gin.Engine, authMW, roleMW gin.HandlerFunc, h *Handler)`. But chat is public (no auth needed). Let me use the handler directly.

Write `studsback/internal/chat/routes.go`:

```go
package chat

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine, h *Handler) {
	if h == nil {
		return
	}

	v1 := r.Group("/api/v1")
	{
		v1.POST("/chat", h.Chat)
	}
}
```

---

### Task 5: Register chat module in main.go

**Files:**
- Modify: `studsback/cmd/server/main.go`

- [ ] **Step 1: Add import**

```go
"studsphere/backend/internal/chat"
```

- [ ] **Step 2: Init handler and register routes**

After the search handler init (line 242), add:

```go
chatHandler := chat.NewHandler(chat.NewService(db))
```

After all other RegisterRoutes calls (before logger.Info), add:

```go
chat.RegisterRoutes(router, chatHandler)
```

---

### Task 6: Update embedding reindex to include site_pages

**Files:**
- Modify: `studsback/internal/embedding/service.go`

- [ ] **Step 1: Add site_pages to tables list**

Change line 182:

```go
tables := []string{"colleges", "courses", "exams", "scholarships", "news", "events", "blogs", "site_pages"}
```

- [ ] **Step 2: Add site_pages to buildSelectForTable**

Add case in `buildSelectForTable()` (before default):

```go
case "site_pages":
    return "id, title, COALESCE(content, '') as content"
```

- [ ] **Step 3: Add site_pages to buildEmbeddingInput**

Add case in `buildEmbeddingInput()`:

```go
case "site_pages":
    parts = append(parts,
        getStr(row, "title"),
        getStr(row, "content"),
    )
```

---

### Task 7: Add site_pages to search service

**Files:**
- Modify: `studsback/internal/search/service.go`
- Modify: `studsback/internal/search/model.go`

- [ ] **Step 1: Add site_pages to allTables()**

```go
func allTables() []string {
    return []string{"colleges", "courses", "exams", "scholarships", "news", "events", "blogs", "site_pages"}
}
```

- [ ] **Step 2: Add site_pages to categoryToTable**

```go
case "site_pages":
    return "site_pages"
```

- [ ] **Step 3: Add site_pages to searchSelectForTable**

```go
case "site_pages":
    return searchSelectSitePages()
```

- [ ] **Step 4: Add searchSelectSitePages function**

```go
func searchSelectSitePages() string {
    return "id, 'page' as type, COALESCE(title, '') as title, COALESCE(content, '') as description, '' as image, false as featured, false as verified, 0 as rating, '' as institution_type, '' as location, '' as university, '' as website, slug"
}
```

- [ ] **Step 5: Add keyword search for site_pages**

In `keywordSearch`, add:

```go
case "site_pages":
    items = append(items, s.searchSitePages(q)...)
```

- [ ] **Step 6: Add searchSitePages method**

```go
func (s *Service) searchSitePages(q string) []SearchItem {
    var results []SearchItem
    query := s.db.Table("site_pages").Select(searchSelectSitePages())
    if q != "" {
        like := "%" + q + "%"
        query = query.Where("LOWER(COALESCE(title, '')) LIKE LOWER(?) OR LOWER(COALESCE(content, '')) LIKE LOWER(?)", like, like)
    }
    query.Limit(5).Find(&results)
    return results
}
```

---

### Task 8: Frontend — Create chat API service

**Files:**
- Create: `studsnew/services/chat.api.ts`

- [ ] **Step 1: Write chat API service**

Write `studsnew/services/chat.api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  return sessionId;
}

export function sendChatMessage(
  message: string,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
) {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, session_id: getSessionId() }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        onError(err.message || err.error || "Chat service unavailable");
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        onError("No response stream");
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.token) {
              onToken(parsed.token);
            } else if (parsed.done) {
              onDone();
            } else if (parsed.error) {
              onError(parsed.error);
            }
          } catch {
            // ignore malformed JSON
          }
        }
      }

      onDone();
    } catch (err: any) {
      if (err.name === "AbortError") return;
      onError(err.message || "Connection failed");
    }
  })();

  return () => controller.abort();
}
```

- [ ] **Step 2: Verify compilation (typecheck)**

Run: `cd /home/durgesh/Work/studsphere/studsnew && npx tsc --noEmit services/chat.api.ts 2>&1 | head -20`

Expected: no errors or minor import warnings

---

### Task 9: Frontend — Update ChatWidget to use real API

**Files:**
- Modify: `studsnew/components/chat/ChatWidget.tsx`

- [ ] **Step 1: Replace the simulation logic**

Replace the `simulateAI`, `handleFlow`, `parseInput` functions and the entire flow state machine with a single `sendChatMessage` call.

Changes to make:

1. **Replace imports** — remove unused state, add `useCallback` import (already present)

2. **Remove `flowStateInit`, `parseInput`, `simulateAI`, `handleFlow`, `startFlow`** — all replaced

3. **Add streaming state**:
```typescript
const [streamingText, setStreamingText] = useState("");
```

4. **Replace `handleUserMessage`**:
```typescript
const handleUserMessage = useCallback((text: string) => {
  if (!text.trim() || isTyping) return;
  addUserMessage(text);
  setIsTyping(true);
  setStreamingText("");

  let fullResponse = "";
  sendChatMessage(
    text,
    (token) => {
      fullResponse += token;
      setStreamingText(fullResponse);
    },
    () => {
      addAIMessage(fullResponse);
      setStreamingText("");
      setIsTyping(false);
    },
    (error) => {
      addAIMessage("I'm having trouble connecting. Please try again.");
      setStreamingText("");
      setIsTyping(false);
    },
  );
}, [addUserMessage, addAIMessage, isTyping]);
```

5. **Remove `startFlow` function** — replace with `handleUserMessage` calls:

Replace:
```tsx
const startFlow = useCallback((flowType: string, triggerText: string) => {
    addUserMessage(triggerText);
    flowState.current = { active: flowType, expected: null, data: {} };
    simulateAI(() => handleFlow());
}, [addUserMessage, simulateAI, handleFlow]);
```

With:
```tsx
const startFlow = useCallback((_flowType: string, triggerText: string) => {
    handleUserMessage(triggerText);
}, [handleUserMessage]);
```

6. **Update quickCards descriptions** to be more generic (optional, minimal change)

7. **Remove `flowState` ref and `standardEndingChips`** — no longer needed

8. **Add streaming text rendering** — in the messages area, after the isTyping indicator, add:
```tsx
{streamingText && (
  <div className="flex w-full items-start gap-4 fade-in-up">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
      <img src="/icon.png" alt="StudSphere" className="h-6 w-6 object-contain" />
    </div>
    <div className="max-w-[90%] sm:max-w-[80%]">
      <div className="whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-5 py-3.5 text-[15px] leading-relaxed text-slate-800 shadow-sm">{streamingText}</div>
    </div>
  </div>
)}
```

---

### Task 10: Add .env variables

**Files:**
- Modify: `studsback/.env`

- [ ] **Step 1: Add Gemini config**

Append to `studsback/.env`:
```
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash-lite
```

- [ ] **Step 2: Ensure embedding is enabled for RAG**

Verify:
```
EMBEDDING_ENABLED=true
EMBEDDING_BASE_URL=http://localhost:11434/v1
EMBEDDING_MODEL=nomic-embed-text
VECTOR_DIMENSION=768
```

---

### Task 11: Run embedding reindex for site_pages

- [ ] **Step 1: Trigger reindex after startup**

After starting the backend, trigger reindex:
```bash
curl -X POST http://localhost:8080/api/v1/admin/search/reindex
```

Verify logs show: `Reindexing embeddings for table: site_pages`

---

### Task 12: Test the full flow

- [ ] **Step 1: Start backend and frontend**

```bash
# Terminal 1
cd /home/durgesh/Work/studsphere/studsback && go run cmd/server/main.go

# Terminal 2
cd /home/durgesh/Work/studsphere/studsnew && pnpm dev
```

- [ ] **Step 2: Test chat endpoint directly**

```bash
curl -X POST http://localhost:8080/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What colleges are in Kathmandu?"}'
```

Expected: SSE stream of tokens.

- [ ] **Step 3: Test in browser**

Open the site, click the chat bubble, ask a question about colleges, scholarships, or "what is StudSphere". Verify:
- Response is streamed in real time
- Answer is relevant to website content
- Out-of-scope questions get "I don't have information about that"
- Session context is preserved for follow-ups
