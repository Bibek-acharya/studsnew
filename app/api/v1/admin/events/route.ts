import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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

async function saveEventsData(data: any[]): Promise<void> {
  const fs = await import("fs/promises");
  const dir = path.dirname(eventsFilePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await fs.writeFile(eventsFilePath, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let events = await getEventsData();

    if (category && category !== "All") {
      events = events.filter((e: any) => e.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      events = events.filter((e: any) => 
        e.title.toLowerCase().includes(s) || 
        e.excerpt?.toLowerCase().includes(s)
      );
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const events = await getEventsData();

    const newEvent = {
      id: Date.now().toString(),
      ...body,
      interestedCount: 0,
      published: body.published !== false,
      created_at: new Date().toISOString(),
    };

    events.unshift(newEvent);
    await saveEventsData(events);

    return NextResponse.json({ success: true, data: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
