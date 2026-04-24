import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const inquiriesFilePath = path.join(process.cwd(), "lib", "inquiries.json");

async function getInquiriesData(): Promise<any[]> {
  try {
    if (existsSync(inquiriesFilePath)) {
      const fs = await import("fs/promises");
      const data = await fs.readFile(inquiriesFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch {}
  return [];
}

async function saveInquiriesData(data: any[]): Promise<void> {
  const fs = await import("fs/promises");
  const dir = path.dirname(inquiriesFilePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await fs.writeFile(inquiriesFilePath, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const inquiries = await getInquiriesData();
    return NextResponse.json({
      success: true,
      data: {
        inquiries,
        meta: { total: inquiries.length }
      }
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const inquiries = await getInquiriesData();

    const newInquiry = {
      id: Date.now(),
      ...body,
      status: "new",
      created_at: new Date().toISOString(),
    };

    inquiries.unshift(newInquiry);
    await saveInquiriesData(inquiries);

    return NextResponse.json({ success: true, data: newInquiry });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}