import type { MetadataRoute } from "next"
import { readFileSync, existsSync } from "fs"
import path from "path"

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
  { path: "/college-recommender", changeFrequency: "monthly", priority: 0.7 },
  { path: "/compare-colleges", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.6 },
  { path: "/counseling", changeFrequency: "weekly", priority: 0.7 },
  { path: "/course-finder", changeFrequency: "daily", priority: 0.8 },
  { path: "/entrance", changeFrequency: "daily", priority: 0.8 },
  { path: "/events", changeFrequency: "daily", priority: 0.8 },
  { path: "/find-college", changeFrequency: "daily", priority: 0.9 },
  { path: "/forgot-password", changeFrequency: "monthly", priority: 0.3 },
  { path: "/institution-zone", changeFrequency: "monthly", priority: 0.6 },
  { path: "/institution-zone/pricing", changeFrequency: "monthly", priority: 0.5 },
  { path: "/login", changeFrequency: "monthly", priority: 0.3 },
  { path: "/news", changeFrequency: "daily", priority: 0.9 },
  { path: "/onboarding", changeFrequency: "monthly", priority: 0.4 },
  { path: "/register", changeFrequency: "monthly", priority: 0.3 },
  { path: "/scholarship-apply", changeFrequency: "weekly", priority: 0.7 },
  { path: "/scholarship-apply/project-shiksha", changeFrequency: "weekly", priority: 0.7 },
  { path: "/scholarship-finder", changeFrequency: "daily", priority: 0.9 },
  { path: "/scholarship-provider", changeFrequency: "monthly", priority: 0.5 },
  { path: "/scholarship-recommender", changeFrequency: "monthly", priority: 0.7 },
  { path: "/search", changeFrequency: "weekly", priority: 0.5 },
  { path: "/write-review", changeFrequency: "monthly", priority: 0.5 },
]

const ADMISSION_LEVELS = ["+2", "bachelor", "master", "a-level", "ctevt"]

interface BlogEntry {
  id: number
  published: boolean
  created_at?: string
}

interface NewsEntry {
  id: number
  status: string
  created?: string
}

interface EventEntry {
  id: string
  published: boolean
  created_at?: string
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
    fetchBlogPages(),
    fetchNewsPages(),
    fetchEventPages(),
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

function readJsonFile<T>(relativePath: string): T[] {
  try {
    const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), relativePath)
    if (!existsSync(fullPath)) return []
    const raw = readFileSync(fullPath, "utf-8")
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

function fetchBlogPages(): MetadataRoute.Sitemap {
  const blogs = readJsonFile<BlogEntry>("lib/blogs-data.json")
  return blogs
    .filter((b) => b.published)
    .map((blog) => ({
      url: `${BASE_URL}/blogs/${blog.id}`,
      lastModified: blog.created_at ? new Date(blog.created_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
}

function fetchNewsPages(): MetadataRoute.Sitemap {
  const allNews = readJsonFile<NewsEntry>("lib/news-data.json")
  return allNews
    .filter((n) => n.status === "Published")
    .map((item) => ({
      url: `${BASE_URL}/news/${item.id}`,
      lastModified: item.created ? new Date(item.created) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
}

function fetchEventPages(): MetadataRoute.Sitemap {
  const events = readJsonFile<EventEntry>("lib/events-data.json")
  return events
    .filter((e) => e.published !== false)
    .map((event) => ({
      url: `${BASE_URL}/events/${event.id}`,
      lastModified: event.created_at ? new Date(event.created_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
}

async function fetchCollegePages(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(`${API_BASE_URL}/api/v1/colleges?limit=1000`, {
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) return []

  const json = await res.json()
  const colleges = json?.data?.colleges ?? []
  if (!Array.isArray(colleges)) return []

  return colleges.map((college: { id?: number }) => ({
    url: `${BASE_URL}/find-college/${college.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))
}

async function fetchScholarshipPages(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(`${API_BASE_URL}/api/v1/education/scholarships?limit=1000`, {
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) return []

  const json = await res.json()
  const scholarships = json?.data?.scholarships ?? []
  if (!Array.isArray(scholarships)) return []

  return scholarships.map((s: { id?: number }) => ({
    url: `${BASE_URL}/scholarship-finder/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))
}
