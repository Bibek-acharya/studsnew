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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await getNewsData();
    
    // Find by id (handle both string and number ids)
    const article = news.find((n: any) => 
      String(n.id) === id || String(n.id) === id
    );

    if (!article) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Only allow published news
    if (article.status !== "Published") {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}