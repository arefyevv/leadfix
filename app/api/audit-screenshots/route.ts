import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { getScreenshotFilePath, normalizeScreenshotLeadId } from "@/lib/screenshotAudit";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const leadId = normalizeScreenshotLeadId(url.searchParams.get("lead"));
  const type = url.searchParams.get("type");
  const filePath = getScreenshotFilePath(leadId, type);

  if (!filePath) {
    return NextResponse.json({ error: "Screenshot not found" }, { status: 404 });
  }

  try {
    const image = await readFile(filePath);
    return new NextResponse(image, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, max-age=3600"
      }
    });
  } catch {
    return NextResponse.json({ error: "Screenshot not found" }, { status: 404 });
  }
}
