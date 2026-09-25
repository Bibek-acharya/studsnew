import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://studsphere.com"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

type RouteDef = {
  path: string
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}

const STATIC_ROUTES: RouteDef[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.8 },
  { path: "/admissions", changeFrequency: "daily", priority: 0.8 },
  { path: "/blogs", changeFrequency: "daily", priority: 0.9 },
  { path: "/campus-forum", changeFrequency: "daily", priority: 0.7 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.6 },
  { path: "/college-recommender", changeFrequency: "monthly", priority: 0.7 },
  { path: "/compare-colleges", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.6 },
  { path: "/counseling", changeFrequency: "weekly", priority: 0.7 },
  { path: "/course-finder", changeFrequency: "daily", priority: 0.8 },
  { path: "/downloads", changeFrequency: "weekly", priority: 0.6 },
  { path: "/entrance", changeFrequency: "daily", priority: 0.8 },
  { path: "/events", changeFrequency: "daily", priority: 0.8 },
  { path: "/find-college", changeFrequency: "daily", priority: 0.9 },
  { path: "/institution-zone", changeFrequency: "monthly", priority: 0.6 },
  { path: "/institution-zone/pricing", changeFrequency: "monthly", priority: 0.5 },
  { path: "/media-press", changeFrequency: "weekly", priority: 0.6 },
  { path: "/news", changeFrequency: "daily", priority: 0.9 },
  { path: "/our-story", changeFrequency: "monthly", priority: 0.6 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.6 },
  { path: "/scholarship-apply", changeFrequency: "weekly", priority: 0.7 },
  { path: "/scholarship-apply/project-shiksha", changeFrequency: "weekly", priority: 0.7 },
  { path: "/scholarship-finder", changeFrequency: "daily", priority: 0.9 },
  { path: "/scholarship-provider", changeFrequency: "monthly", priority: 0.5 },
  { path: "/scholarship-recommender", changeFrequency: "monthly", priority: 0.7 },
  { path: "/sphere-ai", changeFrequency: "monthly", priority: 0.7 },
  { path: "/study-resources", changeFrequency: "weekly", priority: 0.7 },
  { path: "/study-resources/study-notes", changeFrequency: "weekly", priority: 0.7 },
  { path: "/study-resources/past-questions", changeFrequency: "weekly", priority: 0.7 },
  { path: "/study-resources/model-questions", changeFrequency: "weekly", priority: 0.7 },
  { path: "/study-resources/syllabus", changeFrequency: "weekly", priority: 0.7 },
  { path: "/study-resources/video-lectures", changeFrequency: "weekly", priority: 0.7 },
  { path: "/study-resources/mock-test", changeFrequency: "weekly", priority: 0.7 },
  { path: "/team", changeFrequency: "monthly", priority: 0.6 },
  { path: "/universities/nepali", changeFrequency: "weekly", priority: 0.8 },
  { path: "/universities/foreign", changeFrequency: "weekly", priority: 0.8 },
  { path: "/volunteer", changeFrequency: "monthly", priority: 0.6 },
  { path: "/write-review", changeFrequency: "monthly", priority: 0.5 },
]

const ADMISSION_LEVELS = ["+2", "bachelor", "master", "a-level", "ctevt"]

const FETCH_TIMEOUT_MS = 5000

async function safeFetchJson(
  url: string
): Promise<{ data?: Record<string, unknown[]> } | null> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    // Race a wall-clock timer against the whole fetch+parse, not just
    // AbortSignal: during `next build` the patched fetch can ignore the
    // signal, which previously let a stalled API call hang sitemap.xml
    // generation past the 60s static-export limit and fail the build.
    const dataPromise = (async () => {
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        })
        if (!res.ok) return null
        return await res.json()
      } catch {
        return null
      }
    })()
    const timeoutPromise = new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), FETCH_TIMEOUT_MS)
    })
    return await Promise.race([dataPromise, timeoutPromise])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

// ─── Blogs ───────────────────────────────────────────────────────────────────

interface BlogSection {
  id: number | string
  slug?: string
  published?: boolean
  status?: string
  created_at?: string
  published_at?: string
}

// Source: same as app/blogs (services/blogApi.ts + BlogPage.tsx):
//   - /api/v1/education/blogs          (main education blogs)
//   - /api/v1/public/blogs             (provider blogs, listed as provider-<slug>)
//   - /api/v1/institutions/public/blogs (institution blogs, listed as inst-<id|-slug>)
async function fetchBlogPages(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  const [eduJson, providerJson, instJson] = await Promise.all([
    safeFetchJson(`${API_BASE_URL}/api/v1/education/blogs?page=1&limit=500`),
    safeFetchJson(`${API_BASE_URL}/api/v1/public/blogs?page=1&limit=500`),
    safeFetchJson(`${API_BASE_URL}/api/v1/institutions/public/blogs?page=1&limit=500`),
  ])
  const eduBlogs = eduJson?.data?.blogs ?? []
  if (Array.isArray(eduBlogs)) {
    for (const blog of eduBlogs as BlogSection[]) {
      if (blog && blog.published === false) continue
      const slug = blog?.slug ?? blog?.id
      if (slug === undefined || slug === null) continue
      entries.push({
        url: `${BASE_URL}/blogs/${slug}`,
        lastModified: blog.created_at ? new Date(blog.created_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    }
  }

  const providerBlogs = providerJson?.data?.blogs ?? []
  if (Array.isArray(providerBlogs)) {
    for (const blog of providerBlogs as BlogSection[]) {
      if (blog && blog.status && blog.status !== "published") continue
      const slug = blog?.slug ?? blog?.id
      if (slug === undefined || slug === null) continue
      const modified: string | undefined = blog.published_at || blog.created_at
      entries.push({
        url: `${BASE_URL}/blogs/provider-${slug}`,
        lastModified: modified ? new Date(modified) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    }
  }

  const instBlogs = instJson?.data?.blogs ?? []
  if (Array.isArray(instBlogs)) {
    for (const blog of instBlogs as BlogSection[]) {
      if (blog && blog.status && blog.status !== "published") continue
      const slug = blog?.slug ?? (blog?.id !== undefined ? `inst-${blog.id}` : null)
      if (!slug) continue
      const modified: string | undefined = blog.published_at || blog.created_at
      entries.push({
        url: `${BASE_URL}/blogs/${slug}`,
        lastModified: modified ? new Date(modified) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    }
  }

  return entries
}

// ─── News ────────────────────────────────────────────────────────────────────

interface NewsSection {
  id: number | string
  slug?: string
  news_type?: string
  created_at?: string
}

// Source: same as app/news (NewsPage.tsx / NewsDetailsPage.tsx):
//   - /api/v1/institutions/public/news (listed as inst-<id>)
//   - /api/v1/education/news           (listed by slug or id)
async function fetchNewsPages(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  const [instJson, eduJson] = await Promise.all([
    safeFetchJson(`${API_BASE_URL}/api/v1/institutions/public/news?page=1&limit=500`),
    safeFetchJson(`${API_BASE_URL}/api/v1/education/news?page=1&limit=500`),
  ])
  const instNews = instJson?.data?.news ?? []
  if (Array.isArray(instNews)) {
    for (const news of instNews as NewsSection[]) {
      if (!news || news.id === undefined || news.id === null) continue
      const slug = news.slug ? `inst-${news.slug}` : `inst-${news.id}`
      entries.push({
        url: `${BASE_URL}/news/${slug}`,
        lastModified: news.created_at ? new Date(news.created_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    }
  }

  const eduNews = eduJson?.data?.news ?? []
  if (Array.isArray(eduNews)) {
    for (const news of eduNews as NewsSection[]) {
      if (!news) continue
      const slug = news.slug ?? news.id
      if (slug === undefined || slug === null) continue
      entries.push({
        url: `${BASE_URL}/news/${slug}`,
        lastModified: news.created_at ? new Date(news.created_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    }
  }

  return entries
}

// ─── Events ──────────────────────────────────────────────────────────────────

interface EventSection {
  id: string | number
  slug?: string
  published?: boolean
  created_at?: string
}

// Source: same as app/events (services/eventApi.ts + EventsPage.tsx):
//   - /api/v1/education/events         (education events)
//   - /api/v1/institutions/public/events (listed as inst-<id>)
async function fetchEventPages(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  const [eduJson, instJson] = await Promise.all([
    safeFetchJson(`${API_BASE_URL}/api/v1/education/events?page=1&limit=500`),
    safeFetchJson(`${API_BASE_URL}/api/v1/institutions/public/events?page=1&limit=500`),
  ])
  const eduEvents = eduJson?.data?.events ?? []
  if (Array.isArray(eduEvents)) {
    for (const event of eduEvents as EventSection[]) {
      if (!event || event.published === false) continue
      const slug = event.slug ?? event.id
      if (slug === undefined || slug === null) continue
      entries.push({
        url: `${BASE_URL}/events/${slug}`,
        lastModified: event.created_at ? new Date(event.created_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    }
  }

  const instEvents = instJson?.data?.events ?? []
  if (Array.isArray(instEvents)) {
    for (const event of instEvents as EventSection[]) {
      if (!event || event.id === undefined || event.id === null) continue
      entries.push({
        url: `${BASE_URL}/events/inst-${event.id}`,
        lastModified: event.created_at ? new Date(event.created_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    }
  }

  return entries
}

// ─── Colleges & Scholarships (Go API) ────────────────────────────────────────

async function fetchCollegePages(): Promise<MetadataRoute.Sitemap> {
  const json = await safeFetchJson(`${API_BASE_URL}/api/v1/colleges?limit=1000`)
  const colleges = (json?.data?.colleges ?? []) as { id?: number }[]
  if (!Array.isArray(colleges)) return []

  return colleges.map((college: { id?: number }) => ({
    url: `${BASE_URL}/find-college/${college.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))
}

async function fetchScholarshipPages(): Promise<MetadataRoute.Sitemap> {
  const json = await safeFetchJson(`${API_BASE_URL}/api/v1/education/scholarships?limit=1000`)
  const scholarships = (json?.data?.scholarships ?? []) as { id?: number }[]
  if (!Array.isArray(scholarships)) return []

  return scholarships.map((s: { id?: number }) => ({
    url: `${BASE_URL}/scholarship-finder/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const admissionLevelPages = ADMISSION_LEVELS.map((level) => ({
    url: `${BASE_URL}/admissions/${level}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  const [blogPages, newsPages, eventPages, collegePages, scholarshipPages] = await Promise.all([
    fetchBlogPages().catch(() => [] as MetadataRoute.Sitemap),
    fetchNewsPages().catch(() => [] as MetadataRoute.Sitemap),
    fetchEventPages().catch(() => [] as MetadataRoute.Sitemap),
    fetchCollegePages().catch(() => [] as MetadataRoute.Sitemap),
    fetchScholarshipPages().catch(() => [] as MetadataRoute.Sitemap),
  ])

  return [
    ...staticPages,
    ...admissionLevelPages,
    ...blogPages,
    ...newsPages,
    ...eventPages,
    ...collegePages,
    ...scholarshipPages,
  ]
}
