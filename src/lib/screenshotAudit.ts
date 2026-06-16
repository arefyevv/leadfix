import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { AuditScreenshot } from "@/types/audit";

const SCREENSHOTS_DIR = path.join(process.cwd(), "data", "audit-screenshots");
const SCREENSHOT_TIMEOUT_MS = Number(process.env.AUDIT_SCREENSHOT_TIMEOUT_MS || 35_000);

type CaptureAuditScreenshotsInput = {
  url: string;
  leadId?: unknown;
};

type ScreenshotTarget = {
  id: AuditScreenshot["id"];
  width: number;
  height: number;
  isMobile: boolean;
  deviceScaleFactor: number;
};

const TARGETS: ScreenshotTarget[] = [
  { id: "desktop", width: 1440, height: 1200, isMobile: false, deviceScaleFactor: 1 },
  { id: "mobile", width: 390, height: 1400, isMobile: true, deviceScaleFactor: 2 }
];

export function normalizeScreenshotLeadId(leadId: unknown) {
  if (typeof leadId !== "string") return "";
  const value = leadId.trim();
  return /^[a-zA-Z0-9_-]+$/.test(value) ? value : "";
}

export function getScreenshotFilePath(leadId: string, type: unknown) {
  const normalizedLeadId = normalizeScreenshotLeadId(leadId);
  if (!normalizedLeadId || (type !== "desktop" && type !== "mobile")) return null;

  return path.join(SCREENSHOTS_DIR, normalizedLeadId, `${type}.jpg`);
}

export async function captureAuditScreenshots({ url, leadId }: CaptureAuditScreenshotsInput): Promise<AuditScreenshot[]> {
  const normalizedLeadId = normalizeScreenshotLeadId(leadId);
  if (!normalizedLeadId) return [];

  try {
    const { chromium } = await import("playwright");
    const targetDir = path.join(SCREENSHOTS_DIR, normalizedLeadId);
    await mkdir(targetDir, { recursive: true });

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"]
    });

    try {
      const screenshots: AuditScreenshot[] = [];

      for (const target of TARGETS) {
        const page = await browser.newPage({
          viewport: { width: target.width, height: target.height },
          isMobile: target.isMobile,
          deviceScaleFactor: target.deviceScaleFactor,
          userAgent: target.isMobile
            ? "LeadFixAuditScreenshot/1.0 Mobile"
            : "LeadFixAuditScreenshot/1.0 Desktop"
        });

        try {
          await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: SCREENSHOT_TIMEOUT_MS
          });
          await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => undefined);
          await page.evaluate(() => {
            document.querySelectorAll("video").forEach((video) => video.pause());
          }).catch(() => undefined);

          const filePath = path.join(targetDir, `${target.id}.jpg`);
          await page.screenshot({
            path: filePath,
            type: "jpeg",
            quality: 72,
            fullPage: false,
            animations: "disabled"
          });

          screenshots.push({
            id: target.id,
            url: `/api/audit-screenshots?lead=${encodeURIComponent(normalizedLeadId)}&type=${target.id}`,
            width: target.width,
            height: target.height,
            mimeType: "image/jpeg"
          });
        } finally {
          await page.close().catch(() => undefined);
        }
      }

      return screenshots;
    } finally {
      await browser.close().catch(() => undefined);
    }
  } catch (error) {
    console.error("Audit screenshots failed", error);
    return [];
  }
}
