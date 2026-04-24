import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const blogsFilePath = path.join(process.cwd(), "lib", "blogs-data.json");

async function getBlogsData(): Promise<any[]> {
  try {
    if (existsSync(blogsFilePath)) {
      const fs = await import("fs/promises");
      const data = await fs.readFile(blogsFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch {}
  return [];
}

async function saveBlogsData(data: any[]): Promise<void> {
  const fs = await import("fs/promises");
  const dir = path.dirname(blogsFilePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await fs.writeFile(blogsFilePath, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let blogs = await getBlogsData();

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

    return NextResponse.json({
      success: true,
      data: {
        blogs,
        meta: { total: blogs.length, page: 1, limit: 20, pages: 1 }
      }
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const blogs = await getBlogsData();

    const newBlog = {
      id: Date.now(),
      ...body,
      views: 0,
      slug: body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      read_time: "5 min",
      created_at: new Date().toISOString(),
    };

    blogs.unshift(newBlog);
    await saveBlogsData(blogs);

    return NextResponse.json({ success: true, data: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}