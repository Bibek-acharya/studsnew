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

async function saveNewsData(data: any[]): Promise<void> {
  const fs = await import("fs/promises");
  await fs.writeFile(newsFilePath, JSON.stringify(data, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await getNewsData();
    const item = news.find((n: any) => String(n.id) === id);

    if (!item) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const news = await getNewsData();
    const index = news.findIndex((n: any) => String(n.id) === id);

    if (index === -1) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    news[index] = { ...news[index], ...body };
    await saveNewsData(news);

    return NextResponse.json({ success: true, data: news[index] });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await getNewsData();
    const filtered = news.filter((n: any) => String(n.id) !== id);

    if (filtered.length === news.length) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    await saveNewsData(filtered);

    return NextResponse.json({ success: true, message: "News deleted" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}