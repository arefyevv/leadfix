import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { AuditScreenshot, AuditScreenshotId } from "@/types/audit";

const SCREENSHOTS_DIR = path.join(process.cwd(), "data", "audit-screenshots");
const SCREENSHOT_TIMEOUT_MS = Number(process.env.AUDIT_SCREENSHOT_TIMEOUT_MS || 35_000);

type CaptureAuditScreenshotsInput = {
  url: string;
  leadId?: unknown;
};

type ScreenshotTarget = {
  id: AuditScreenshotId;
  width: number;
  height: number;
  isMobile: boolean;
  deviceScaleFactor: number;
};

type BlockScreenshotTarget = {
  id: Exclude<AuditScreenshotId, "desktop" | "mobile">;
  keywords: string[];
  preferForm?: boolean;
};

const TARGETS: ScreenshotTarget[] = [
  { id: "desktop", width: 1440, height: 1200, isMobile: false, deviceScaleFactor: 1 },
  { id: "mobile", width: 390, height: 1400, isMobile: true, deviceScaleFactor: 2 }
];

const SCREENSHOT_IDS: AuditScreenshotId[] = ["desktop", "mobile", "hero", "cases", "trust", "form", "pricing", "faq", "cta"];

const BLOCK_TARGETS: BlockScreenshotTarget[] = [
  { id: "hero", keywords: [""] },
  { id: "cases", keywords: ["кейс", "кейсы", "проект", "результат", "до и после", "портфолио"] },
  { id: "trust", keywords: ["отзыв", "отзывы", "клиент", "клиенты", "сертификат", "гарантия", "доверие", "результат"] },
  { id: "form", keywords: ["заявк", "форма", "контакт", "телефон", "почта", "связаться"], preferForm: true },
  { id: "pricing", keywords: ["тариф", "цена", "стоимость", "пакет", "руб", "₽"] },
  { id: "faq", keywords: ["вопрос", "ответ", "faq", "часто задаваемые"] },
  { id: "cta", keywords: ["оставить заявку", "получить", "заказать", "консультац", "связаться", "обсудить"] }
];

export function normalizeScreenshotLeadId(leadId: unknown) {
  if (typeof leadId !== "string") return "";
  const value = leadId.trim();
  return /^[a-zA-Z0-9_-]+$/.test(value) ? value : "";
}

export function getScreenshotFilePath(leadId: string, type: unknown) {
  const normalizedLeadId = normalizeScreenshotLeadId(leadId);
  if (!normalizedLeadId || typeof type !== "string" || !SCREENSHOT_IDS.includes(type as AuditScreenshotId)) return null;

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

      const blockPage = await browser.newPage({
        viewport: { width: 1440, height: 1200 },
        deviceScaleFactor: 1,
        userAgent: "LeadFixAuditScreenshot/1.0 Desktop"
      });

      try {
        await blockPage.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: SCREENSHOT_TIMEOUT_MS
        });
        await blockPage.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => undefined);
        await blockPage.evaluate(() => {
          document.querySelectorAll("video").forEach((video) => video.pause());
        }).catch(() => undefined);

        for (const target of BLOCK_TARGETS) {
          const captured = await captureBlockScreenshot(blockPage, target, targetDir, normalizedLeadId);
          if (captured) screenshots.push(captured);
        }
      } finally {
        await blockPage.close().catch(() => undefined);
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

async function captureBlockScreenshot(
  page: import("playwright").Page,
  target: BlockScreenshotTarget,
  targetDir: string,
  leadId: string
): Promise<AuditScreenshot | null> {
  const selector = `[data-leadfix-screenshot="${target.id}"]`;
  const found = await page.evaluate(({ id, keywords, preferForm }) => {
    const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();
    const visibleArea = (element: Element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || rect.width < 260 || rect.height < 120) return 0;
      return rect.width * rect.height;
    };
    const chooseContainer = (element: Element | null) => {
      let current = element;
      while (current?.parentElement) {
        const rect = current.getBoundingClientRect();
        const parentRect = current.parentElement.getBoundingClientRect();
        if (rect.width >= 640 && rect.height >= 220) return current;
        if (parentRect.height > window.innerHeight * 1.35) return current;
        current = current.parentElement;
      }
      return element;
    };

    document.querySelectorAll("[data-leadfix-screenshot]").forEach((element) => {
      element.removeAttribute("data-leadfix-screenshot");
    });

    if (id === "hero") {
      const hero = Array.from(document.querySelectorAll("main section, header, section, main > div, body > div"))
        .find((element) => visibleArea(element) > 120_000 && element.getBoundingClientRect().top < window.innerHeight * .75);
      const selected = chooseContainer(hero || document.body);
      selected?.setAttribute("data-leadfix-screenshot", id);
      return Boolean(selected);
    }

    if (preferForm) {
      const form = chooseContainer(document.querySelector("form"));
      if (form && visibleArea(form) > 0) {
        form.setAttribute("data-leadfix-screenshot", id);
        return true;
      }
    }

    const candidates = Array.from(document.querySelectorAll("section, article, form, main > div, [class], [id]"))
      .map((element) => {
        const text = normalize(element.textContent || "");
        const area = visibleArea(element);
        if (!text || area <= 0) return { element, score: 0 };
        const keywordScore = keywords.reduce((score, keyword) => score + (keyword && text.includes(normalize(keyword)) ? 1 : 0), 0);
        const rect = element.getBoundingClientRect();
        const belowHeroBonus = rect.top + window.scrollY > window.innerHeight * .55 ? 1 : 0;
        const sizePenalty = rect.height > window.innerHeight * 2.1 ? -2 : 0;
        return { element, score: keywordScore * 10 + belowHeroBonus + sizePenalty };
      })
      .filter((candidate) => candidate.score > 0)
      .sort((a, b) => b.score - a.score);

    const selected = chooseContainer(candidates[0]?.element || null);
    selected?.setAttribute("data-leadfix-screenshot", id);
    return Boolean(selected);
  }, target);

  if (!found) return null;

  try {
    const locator = page.locator(selector).first();
    await locator.scrollIntoViewIfNeeded({ timeout: 4_000 });
    const box = await locator.boundingBox();
    if (!box || box.width < 260 || box.height < 120) return null;

    const filePath = path.join(targetDir, `${target.id}.jpg`);
    if (box.height <= 1500) {
      await locator.screenshot({
        path: filePath,
        type: "jpeg",
        quality: 72,
        animations: "disabled"
      });
    } else {
      await page.screenshot({
        path: filePath,
        type: "jpeg",
        quality: 72,
        fullPage: false,
        animations: "disabled"
      });
    }

    return {
      id: target.id,
      url: `/api/audit-screenshots?lead=${encodeURIComponent(leadId)}&type=${target.id}`,
      width: Math.round(Math.min(box.width, 1440)),
      height: Math.round(Math.min(box.height, 1500)),
      mimeType: "image/jpeg"
    };
  } catch (error) {
    console.error("Audit block screenshot failed", { screenshotId: target.id, error });
    return null;
  }
}
