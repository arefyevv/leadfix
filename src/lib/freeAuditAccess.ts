import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AuditAnalysis } from "@/types/audit";

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_FREE_AUDITS_PER_IP = 3;
const CACHE_TTL_MS = DAY_MS;
const DATA_DIR = path.join(process.cwd(), "data");
const CACHE_DIR = path.join(DATA_DIR, "free-audit-cache");
const USAGE_DIR = path.join(DATA_DIR, "free-audit-usage");

type FreeAuditCache = {
  analysis: AuditAnalysis;
  savedAt: string;
};

type FreeAuditUsage = {
  requests: string[];
  urls: Record<string, string>;
};

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getUrlKey(url: URL | string) {
  const parsedUrl = typeof url === "string" ? new URL(url) : url;
  parsedUrl.hash = "";
  return parsedUrl.href;
}

function getCachePath(url: URL | string) {
  return path.join(CACHE_DIR, `${hashValue(getUrlKey(url))}.json`);
}

function getUsagePath(ip: string) {
  return path.join(USAGE_DIR, `${hashValue(ip)}.json`);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function createEmptyUsage(): FreeAuditUsage {
  return {
    requests: [],
    urls: {}
  };
}

async function readUsage(ip: string) {
  try {
    return JSON.parse(await readFile(getUsagePath(ip), "utf8")) as FreeAuditUsage;
  } catch {
    return createEmptyUsage();
  }
}

async function writeUsage(ip: string, usage: FreeAuditUsage) {
  await mkdir(USAGE_DIR, { recursive: true });
  await writeFile(getUsagePath(ip), JSON.stringify(usage, null, 2), "utf8");
}

export async function readFreeAuditCache(url: URL | string) {
  try {
    const cached = JSON.parse(await readFile(getCachePath(url), "utf8")) as FreeAuditCache;
    const savedAt = new Date(cached.savedAt).getTime();
    if (!cached.analysis || Number.isNaN(savedAt) || Date.now() - savedAt > CACHE_TTL_MS) return null;
    return cached.analysis;
  } catch {
    return null;
  }
}

export async function saveFreeAuditCache(url: URL | string, analysis: AuditAnalysis) {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(
    getCachePath(url),
    JSON.stringify({
      analysis,
      savedAt: new Date().toISOString()
    } satisfies FreeAuditCache),
    "utf8"
  );
}

export async function enforceFreeAuditLimit(request: Request, url: URL | string) {
  const ip = getClientIp(request);
  const usage = await readUsage(ip);
  const now = Date.now();
  const urlKey = hashValue(getUrlKey(url));

  usage.requests = usage.requests.filter((item) => {
    const time = new Date(item).getTime();
    return !Number.isNaN(time) && now - time <= DAY_MS;
  });

  usage.urls = Object.fromEntries(
    Object.entries(usage.urls).filter(([, value]) => {
      const time = new Date(value).getTime();
      return !Number.isNaN(time) && now - time <= DAY_MS;
    })
  );

  if (usage.requests.length >= MAX_FREE_AUDITS_PER_IP) {
    throw new Error("FREE_AUDIT_IP_LIMIT");
  }

  if (usage.urls[urlKey]) {
    throw new Error("FREE_AUDIT_URL_LIMIT");
  }

  const timestamp = new Date(now).toISOString();
  usage.requests.push(timestamp);
  usage.urls[urlKey] = timestamp;
  await writeUsage(ip, usage);
}
