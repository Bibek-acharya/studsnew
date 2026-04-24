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

async function saveBlogsData(data: any[]): Promise<void> {
  const fs = await import("fs/promises");
  await fs.writeFile(blogsFilePath, JSON.stringify(data, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogs = await getBlogsData();
    const item = blogs.find((b: any) => String(b.id) === id);

    if (!item) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const blogs = await getBlogsData();
    const index = blogs.findIndex((b: any) => String(b.id) === id);

    if (index === -1) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    blogs[index] = { ...blogs[index], ...body };
    await saveBlogsData(blogs);

    return NextResponse.json({ success: true, data: blogs[index] });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogs = await getBlogsData();
    const filtered = blogs.filter((b: any) => String(b.id) !== id);

    if (filtered.length === blogs.length) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await saveBlogsData(filtered);

    return NextResponse.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}