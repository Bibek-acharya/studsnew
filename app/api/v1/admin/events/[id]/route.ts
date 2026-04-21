import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
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
  await fs.writeFile(eventsFilePath, JSON.stringify(data, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = await getEventsData();
    const event = events.find((e: any) => e.id === id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const events = await getEventsData();
    
    const eventIndex = events.findIndex((e: any) => e.id === id);
    
    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const updatedEvent = {
      ...events[eventIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    events[eventIndex] = updatedEvent;
    await saveEventsData(events);

    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = await getEventsData();
    
    const eventIndex = events.findIndex((e: any) => e.id === id);
    
    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    events.splice(eventIndex, 1);
    await saveEventsData(events);

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}