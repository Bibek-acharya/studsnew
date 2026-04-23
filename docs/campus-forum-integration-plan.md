# Campus Forum Frontend Integration Plan

## 1. Current Architecture Analysis

### 1.1 Frontend Components
| Component | File | Purpose |
|-----------|------|---------|
| CampusForumPage | `components/campus-forum/CampusForumPage.tsx` | Main forum page with feed |
| ForumPostCard | `components/campus-forum/ForumPostCard.tsx` | Post and comment display |
| ForumNavbar | `components/campus-forum/ForumNavbar.tsx` | Navigation |
| ForumSidebar | `components/campus-forum/ForumSidebar.tsx` | Community sidebar |
| TrendingSidebar | `components/campus-forum/TrendingSidebar.tsx` | Trending posts |

### 1.2 Backend Location
- **Backend repo**: `studsback/`
- **Forum routes**: `internal/forum/routes.go`
- **Forum handler**: `internal/forum/handler.go`
- **Forum service**: `internal/forum/service.go`
- **Forum model**: `internal/forum/model.go`

### 1.3 Current Data Flow
**STATUS: Fully integrated**. The campus forum uses API service calls:

```typescript
// CampusForumPage.tsx lines 251-258
const fetchInitialData = async () => {
  const fetched = await apiService.getForumCommunities(token || undefined);
  setCommunities(fetched || []);
};

// Lines 260-289  
const fetchPosts = async (reset = false) => {
  const result = await apiService.getForumPosts(10, token, selectedCommunityId, currentPage);
  // ...
};
```

### 1.3 API Service Methods Used
From `services/api.ts`:
- `apiService.getForumCommunities(token?)` - Get all communities
- `apiService.getForumPosts(limit, token?, communityId?, page?)` - Get feed posts
- `apiService.getForumPostComments(postId, limit, offset)` - Get comments
- `apiService.createForumComment(token, postId, data)` - Create comment
- `apiService.joinForumCommunity(token, communityId)` - Join/leave community
- `apiService.createForumPost(token, data)` - Create new post
- `apiService.updateForumPost(token, id, data)` - Update post
- `apiService.deleteForumPost(token, id)` - Delete post
- `apiService.likeForumPost(token, postId)` - Like post
- `apiService.dislikeForumPost(token, postId)` - Dislike post
- `apiService.voteForumPoll(token, postId, optionIdx)` - Vote on poll
- `apiService.saveForumPost(token, postId)` - Save/bookmark post
- `apiService.uploadForumMedia(token, files)` - Upload images/videos

---

## 2. Backend API Status

### 2.1 Existing Routes (from `studsback/internal/forum/routes.go`)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/v1/forum/posts` | No | List posts |
| GET | `/api/v1/forum/posts/:id/comments` | No | Get comments |
| GET | `/api/v1/forum/communities` | No | List communities |
| POST | `/api/v1/forum/posts` | Yes | Create post |
| POST | `/api/v1/forum/posts/:id/like` | Yes | Like post |
| POST | `/api/v1/forum/posts/:id/dislike` | Yes | Dislike post |
| POST | `/api/v1/forum/posts/:id/save` | Yes | Save post |
| PUT | `/api/v1/forum/posts/:id` | Yes | Update post |
| DELETE | `/api/v1/forum/posts/:id` | Yes | Delete post |
| POST | `/api/v1/forum/posts/:id/comments` | Yes | Create comment |
| POST | `/api/v1/forum/posts/:id/poll/vote` | Yes | Vote on poll |
| POST | `/api/v1/forum/upload` | Yes | Upload media |
| POST | `/api/v1/forum/communities/:id/join` | Yes | Join community |

### 2.2 Verified Working (Tested April 2026)
- `GET /api/v1/forum/communities` → Returns 7 communities
- `GET /api/v1/forum/posts` → Returns posts with pagination

---

## 3. Features Implemented

### 3.1 Community Management
- View list of communities
- Join/leave communities  
- Community details (members count, posts count)
- Invite friends to community

### 3.2 Post Management
- Create text posts
- Create posts with images (up to 4)
- Create posts with video
- Create posts with polls
- Edit own posts
- Delete own posts

### 3.3 Interaction
- Like/dislike posts
- Comment on posts
- Reply to comments (nested)
- Vote on polls
- Save/bookmark posts

### 3.4 Feed
- Infinite scroll pagination
- Filter by community
- Load more comments
- Relative timestamps

### 3.5 UI Features
- Post dropdown menu (edit, delete, report, share)
- Share link copying
- Report post (with reason selection)
- Image galleries (1-4 images)
- Video preview
- Poll display with results
- Toast notifications
- Back to top button

---

## 4. Integration Tasks

### 4.1 Phase 1: Verify Backend Connectivity ✅ COMPLETE
- [x] Test `/api/v1/forum/communities` → Returns 7 communities
- [x] Test `/api/v1/forum/posts` → Returns posts with pagination
- [x] Backend is running at `localhost:8080`

### 4.2 Phase 2: Test Features
- [ ] Test creating post with text (requires auth)
- [ ] Test creating post with images (requires auth)
- [ ] Test creating post with poll (requires auth)
- [ ] Test like/dislike functionality (requires auth)
- [ ] Test comment and reply (requires auth)
- [ ] Test poll voting (requires auth)
- [ ] Test join/leave community (requires auth)

### 4.3 Phase 3: Edge Cases & Polish
- [ ] Handle network errors gracefully
- [ ] Handle 401 (re-authenticate)
- [ ] Handle 403 (forbidden actions)
- [ ] Loading states for all operations
- [ ] Empty states (no posts, no comments)

### 4.4 Phase 4: Potential Enhancements
- [ ] Real-time updates (polling or WebSocket)
- [ ] User profile pages from post author
- [ ] Search posts
- [ ] Sort options (newest, popular)
- [ ] Moderation tools (reported posts view)

---

## 5. Data Models

### 5.1 ForumCommunity
```typescript
interface ForumCommunity {
  id: number;
  name: string;
  emoji: string;
  description?: string;
  bg_color?: string;
  member_count?: number;
  post_count?: number;
  is_member?: boolean;
}
```

### 5.2 ForumPost
```typescript
interface ForumPost {
  id: number;
  user_id: number;
  community_id: number;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  is_poll: boolean;
  poll_options?: string; // JSON string
  poll_results?: Record<number, number>;
  total_votes?: number;
  voted_option?: number;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  is_liked?: boolean;
  is_disliked?: boolean;
  is_saved?: boolean;
  created_at: string;
  user?: ForumUser;
  community?: ForumCommunity;
}
```

### 5.3 ForumComment
```typescript
interface ForumComment {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  parent_id?: number;
  created_at: string;
  user: ForumUser;
  replies?: ForumComment[];
}
```

---

## 6. Testing Checklist

### 6.1 Basic Functionality
- [ ] Load campus forum page without errors
- [ ] Communities list displays
- [ ] Posts load in feed
- [ ] Click community filters posts

### 6.2 Interactions
- [ ] Create new post (text only)
- [ ] Create new post with images
- [ ] Create new post with poll
- [ ] Like post updates count
- [ ] Dislike post updates count
- [ ] Comment on post
- [ ] Reply to comment
- [ ] Vote on poll

### 6.3 Community
- [ ] Join community updates button
- [ ] Leave community updates button
- [ ] Member count updates

### 6.4 Post Management
- [ ] Edit own post
- [ ] Delete own post
- [ ] Cannot edit others' posts

### 6.5 Edge Cases
- [ ] No posts in community shows empty state
- [ ] No more posts shows end message
- [ ] Network error shows toast
- [ ] Logged out user sees login prompts

---

## 7. Known Considerations

### 7.1 Auth Requirements
Many features require authentication:
- Create post
- Like/dislike
- Comment
- Join community
- Vote on poll

Unauthenticated users see warning toasts.

### 7.2 Pagination
- Uses cursor-based loading with "Load More" sentinel
- 10 posts per page
- Tracks hasMore state

### 7.3 Media Upload
- Images: up to 4
- Video: allowed
- Handled via multipart/form-data

### 7.4 Poll Format
- poll_options: JSON string array
- poll_results: Map of option_index -> vote_count
- voted_option: user's vote

---

## 8. Next Steps

1. ✅ Backend is running at `localhost:8080` (verified)
2. **Test authenticated features** with login
3. **Fix any issues** found during testing
4. **Add real-time updates** if needed (WebSocket)
5. **Add search** functionality if needed
6. **Deploy to production**

---

## 9. Comparison: find-college vs admissions vs campus-forum

| Aspect | find-college | admissions | campus-forum |
|--------|-------------|-----------|--------------|
| Data Source | API | Mock data | **API** |
| Filter API | Yes | No | N/A |
| List API | Yes | Needs new | **Yes** |
| CRUD API | N/A | N/A | **Yes** |
| Auth Required | No | No | **Partial** |
| Backend Module | college/ | (mock) | **forum/** |

Campus-forum has full backend integration via `studsback/internal/forum/`.