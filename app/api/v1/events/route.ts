import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import path from "path";

const eventsFilePath = path.join(process.cwd(), "lib", "events-data.json");

async function getEventsData(): Promise<any[]> {
  try {
    if (existsSync(eventsFilePath)) {
      const fs = await import("fs/promises");
      const data = await fs.readFile(eventsFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch {}
  return [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let events = await getEventsData();

    // Only return published events for public API
    events = events.filter((e: any) => e.published !== false);

    if (category && category !== "All") {
      events = events.filter((e: any) => e.category === category);
    }

    return NextResponse.json({
      success: true,
      data: {
        events,
        meta: { total: events.length, page: 1, limit: 20, pages: 1 }
      }
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
