import { mkdir, appendFile, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import nodemailer from "nodemailer";
import type { LeadRecord, LeadRequest } from "@/types/lead";

const LEADS_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(LEADS_DIR, "leads.jsonl");
const DEFAULT_OWNER_EMAIL = "viktor-82rus@ya.ru";
const DEFAULT_OWNER_TELEGRAM = "@LeadFixRu";

function createLeadId() {
  return `lf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getPaymentLink() {
  return process.env.LEADFIX_PAYMENT_LINK || "https://t.me/LeadFixRu";
}

export function createLead(input: LeadRequest, userAgent?: string): LeadRecord {
  return {
    ...input,
    id: createLeadId(),
    status: "waiting_payment",
    createdAt: new Date().toISOString(),
    paymentLink: getPaymentLink(),
    userAgent
  };
}

export async function saveLead(lead: LeadRecord) {
  try {
    await mkdir(LEADS_DIR, { recursive: true });
    await appendFile(LEADS_FILE, `${JSON.stringify(lead)}\n`, "utf8");
  } catch {
    const fallbackFile = path.join(os.tmpdir(), "leadfix-leads.jsonl");
    await appendFile(fallbackFile, `${JSON.stringify(lead)}\n`, "utf8");
  }
}

export async function findLeadById(leadId: string) {
  const normalizedLeadId = /^[a-zA-Z0-9_-]+$/.test(leadId) ? leadId : "";
  if (!normalizedLeadId) return null;

  try {
    const lines = (await readFile(LEADS_FILE, "utf8")).split(/\r?\n/).filter(Boolean);

    for (let index = lines.length - 1; index >= 0; index -= 1) {
      const lead = JSON.parse(lines[index]) as LeadRecord;
      if (lead.id === normalizedLeadId) return lead;
    }
  } catch {
    return null;
  }

  return null;
}

export async function notifyLead(lead: LeadRecord) {
  const message = getLeadNotificationMessage(lead);

  const results = await Promise.allSettled([
    notifyLeadByTelegram(message),
    notifyLeadByEmail(lead, message)
  ]);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Lead notification channel failed", result.reason);
    }
  });
}

function getLeadNotificationMessage(lead: LeadRecord) {
  return [
    "Новая заявка LeadFix",
    `ID: ${lead.id}`,
    `Тариф: ${lead.plan}`,
    `URL: ${lead.url}`,
    `Email: ${lead.email}`,
    `Telegram: ${lead.telegram || "-"}`,
    `Источник: ${lead.source || "-"}`,
    `Статус: ${lead.status}`,
    `Контакт владельца: ${DEFAULT_OWNER_TELEGRAM}`
  ].join("\n");
}

async function notifyLeadByTelegram(message: string) {
  const token = process.env.LEADFIX_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.LEADFIX_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true
    })
  });
}

async function notifyLeadByEmail(lead: LeadRecord, message: string) {
  const host = process.env.LEADFIX_SMTP_HOST;
  const port = Number(process.env.LEADFIX_SMTP_PORT || 465);
  const user = process.env.LEADFIX_SMTP_USER;
  const pass = process.env.LEADFIX_SMTP_PASSWORD;
  const from = process.env.LEADFIX_NOTIFICATION_FROM || user;
  const to = process.env.LEADFIX_NOTIFICATION_EMAIL || DEFAULT_OWNER_EMAIL;

  if (!host || !user || !pass || !from || !to) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from,
    to,
    subject: `Новая заявка LeadFix: ${lead.plan}`,
    text: message
  });
}
