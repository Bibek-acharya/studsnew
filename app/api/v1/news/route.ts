import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import path from "path";

const newsFilePath = path.join(process.cwd(), "lib", "news-data.json");

async function getNewsData(): Promise<any[]> {
  try {
    const fs = await import("fs/promises");
    if (existsSync(newsFilePath)) {
      const data = await fs.readFile(newsFilePath, "utf-8");
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

    let news = await getNewsData();

    // Only show published news
    news = news.filter((n: any) => n.status === "Published");

    if (category && category !== "All News") {
      news = news.filter((n: any) => n.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      news = news.filter((n: any) => 
        n.title.toLowerCase().includes(s) || 
        n.desc?.toLowerCase().includes(s)
      );
    }

    // Sort by id descending (newest first)
    news.sort((a: any, b: any) => b.id - a.id);

    const total = news.length;
    const start = (page - 1) * limit;
    const paginatedNews = news.slice(start, start + limit);

    return NextResponse.json({
      data: {
        news: paginatedNews,
        meta: { total, page, limit, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({
      data: {
        news: [],
        meta: { total: 0, page: 1, limit: 12, pages: 0 }
      }
    });
  }
}