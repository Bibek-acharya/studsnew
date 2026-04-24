import { NextRequest, NextResponse } from "next/server";
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogs = await getBlogsData();
    
    // Try both string and numeric comparison
    let blog = blogs.find((b: any) => String(b.id) === id);
    if (!blog) {
      blog = blogs.find((b: any) => b.id === parseInt(id));
    }

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Only allow published blogs for public API
    if (!blog.published) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}