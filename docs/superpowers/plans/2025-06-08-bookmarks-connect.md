# Bookmarks Connect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire bookmark button on Find College to backend API and fix BookmarksSection to display college bookmarks.

**Architecture:** No backend changes. Frontend calls existing `POST /api/v1/bookmarks`, `DELETE /api/v1/bookmarks/:id`, `GET /api/v1/bookmarks/:type`, and `GET /api/v1/colleges/:id` endpoints.

**Tech Stack:** Next.js 14, React, Tailwind, TanStack Query

---

### Task 1: Wire bookmark toggle in CollegeGrid to API

**Files:**
- Modify: `components/find-college/CollegeGrid.tsx`

- [ ] **Step 1: Add auth import and bookmark state tracking**

Add to existing imports at the top of the file:
```tsx
import { useAuth } from '@/services/AuthContext'
import { toast } from 'react-hot-toast'
```

After existing state declarations (~line 148-156), add bookmark map + query to re-fetch saved on mount:
```tsx
const { user, isAuthenticated } = useAuth()
const [bookmarkMap, setBookmarkMap] = useState<Record<number, number>>({})
```

- [ ] **Step 2: Update toggleSavedCollege to call API**

Replace the existing `toggleSavedCollege` function (~line 300-306):
```tsx
const toggleSavedCollege = async (collegeId: number) => {
  if (!isAuthenticated) {
    toast.error('Please login to save bookmarks')
    return
  }
  const existingBookmarkId = bookmarkMap[collegeId]
  if (existingBookmarkId) {
    try {
      await apiService.deleteBookmark(existingBookmarkId)
      setBookmarkMap(prev => {
        const next = { ...prev }
        delete next[collegeId]
        return next
      })
      setSavedColleges(prev => prev.filter(id => id !== collegeId))
      toast.success('Removed from bookmarks')
    } catch {
      toast.error('Failed to remove bookmark')
    }
  } else {
    try {
      const res = await apiService.createBookmark(collegeId, 'college')
      const newBookmarkId = res.data.id
      setBookmarkMap(prev => ({ ...prev, [collegeId]: newBookmarkId }))
      setSavedColleges(prev => [...prev, collegeId])
      toast.success('Added to bookmarks!')
    } catch {
      toast.error('Failed to save bookmark')
    }
  }
}
```

- [ ] **Step 3: Pass `isSaved` correctly to ProgramCard**

The existing `isSaved={savedColleges.includes(college.id)}` at line 487 already works — no change needed.

### Task 2: Fix BookmarksSection to load college details

**Files:**
- Modify: `components/user/dashboard/sections/BookmarksSection.tsx`

- [ ] **Step 1: Replace useEffect with detail-fetching logic**

Replace lines 145-154:
```tsx
useEffect(() => {
  if (activeTab !== 'Colleges') {
    apiService.getBookmarksByType(activeTab.toLowerCase())
      .then(res => {
        const items = res.data?.bookmarks || []
        setBookmarks(items.map(b => ({ ...b, type: activeTab })))
        setError(null)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
    return
  }

  let cancelled = false
  const fetch = async () => {
    try {
      setLoading(true)
      const res = await apiService.getBookmarksByType('colleges')
      const items = (res.data?.bookmarks || []) as BookmarkItem[]
      if (cancelled) return

      const collegeDetails = await Promise.all(
        items.map(b => apiService.getCollegeById(b.item_id).then(r => r.data).catch(() => null))
      )
      if (cancelled) return

      const enriched = items.map((b, i) => {
        const c = collegeDetails[i]
        if (!c) return { ...b, type: 'Colleges' as const }
        return {
          id: b.id,
          type: 'Colleges' as const,
          name: c.name,
          imageUrl: c.image_url,
          location: c.location || '',
          rating: c.rating?.toString() || '0',
          affiliation: c.affiliation || '',
          collegeType: c.type || '',
          isVerified: c.verified || false,
          featured: c.featured || false,
        }
      })
      if (!cancelled) {
        setBookmarks(enriched)
        setError(null)
      }
    } catch (err) {
      if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load bookmarks')
    } finally {
      if (!cancelled) setLoading(false)
    }
  }
  fetch()
  return () => { cancelled = true }
}, [activeTab])
```

