import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import path from "path";

const blogsFilePath = path.join(process.cwd(), "lib", "blogs-data.json");

async function getBlogsData(): Promise<any[]> {
  try {
    const fs = await import("fs/promises");
    if (existsSync(blogsFilePath)) {
      const data = await fs.readFile(blogsFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch {}
  return [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    let blogs = await getBlogsData();

    // Only show published blogs
    blogs = blogs.filter((b: any) => b.published === true);

    if (category && category !== "All") {
      blogs = blogs.filter((b: any) => b.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      blogs = blogs.filter((b: any) => 
        b.title.toLowerCase().includes(s) || 
        b.excerpt?.toLowerCase().includes(s)
      );
    }

    // Sort by created_at descending
    blogs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = blogs.length;
    const start = (page - 1) * limit;
    const paginatedBlogs = blogs.slice(start, start + limit);

    return NextResponse.json({
      data: {
        blogs: paginatedBlogs,
        meta: { total, page, limit, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({
      data: {
        blogs: [],
        meta: { total: 0, page: 1, limit: 12, pages: 0 }
      }
    });
  }
}