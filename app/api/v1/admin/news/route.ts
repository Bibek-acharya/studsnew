import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const newsFilePath = path.join(process.cwd(), "lib", "news-data.json");

async function getNewsData(): Promise<any[]> {
  try {
    if (existsSync(newsFilePath)) {
      const fs = await import("fs/promises");
      const data = await fs.readFile(newsFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch {}
  return [];
}

async function saveNewsData(data: any[]): Promise<void> {
  const fs = await import("fs/promises");
  const dir = path.dirname(newsFilePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await fs.writeFile(newsFilePath, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let news = await getNewsData();

    if (category && category !== "All") {
      news = news.filter((n: any) => n.category === category);
    }
    if (status && status !== "all") {
      news = news.filter((n: any) => n.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      news = news.filter((n: any) => 
        n.title.toLowerCase().includes(s) || 
        n.desc?.toLowerCase().includes(s)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        news,
        meta: { total: news.length, page: 1, limit: 20, pages: 1 }
      }
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const news = await getNewsData();

    const newNews = {
      id: Date.now(),
      ...body,
      views: 0,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      tags: body.tags || [],
      targetAudience: body.targetAudience || ["All"],
      branch: body.branch || "All",
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      date: body.date || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      deadline: body.deadline || "-",
    };

    news.unshift(newNews);
    await saveNewsData(news);

    return NextResponse.json({ success: true, data: newNews });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}