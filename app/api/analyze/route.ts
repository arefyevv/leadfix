import { NextResponse } from "next/server";
import { analyzeHtml } from "@/lib/analyzeHtml";
import { readAuditReportByLeadId, saveAuditReportByLeadId } from "@/lib/auditReports";
import { enhanceAuditWithAI } from "@/lib/openaiAudit";
import { captureAuditScreenshots } from "@/lib/screenshotAudit";

const REQUEST_TIMEOUT_MS = 12_000;

function normalizeUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Введите адрес сайта");
  }

  const rawUrl = value.trim();
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  const url = new URL(withProtocol);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Поддерживаются только http и https адреса");
  }

  if (
    url.hostname === "localhost" ||
    url.hostname === "0.0.0.0" ||
    url.hostname === "::1" ||
    url.hostname === "[::1]" ||
    /^127\./.test(url.hostname) ||
    /^169\.254\./.test(url.hostname) ||
    /^10\./.test(url.hostname) ||
    /^192\.168\./.test(url.hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(url.hostname)
  ) {
    throw new Error("Локальные адреса недоступны для анализа");
  }

  return url;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: unknown; requireAi?: unknown; leadId?: unknown };

    if (body.requireAi === true) {
      const storedReport = await readAuditReportByLeadId(body.leadId);
      if (storedReport) {
        return NextResponse.json({
          analysis: storedReport.analysis,
          previewReport: storedReport.previewReport
        });
      }
    }

    const url = normalizeUrl(body.url);
    const response = await fetch(url, {
      headers: {
        "Accept": "text/html,application/xhtml+xml",
        "User-Agent": "LeadFixPreviewAudit/1.0"
      },
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Сайт ответил с ошибкой ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("По этому адресу не найдена HTML-страница");
    }

    const html = await response.text();
    const shouldCaptureScreenshots = body.requireAi === true;
    const screenshots = shouldCaptureScreenshots
      ? await captureAuditScreenshots({ url: response.url || url.href, leadId: body.leadId })
      : [];
    const baseAnalysis = {
      ...analyzeHtml(html, response.url || url.href),
      screenshots
    };
    const analysis = await enhanceAuditWithAI(baseAnalysis);

    if (body.requireAi === true && analysis.auditResult.metadata.generatedBy !== "proxyapi") {
      return NextResponse.json(
        {
          error: "AI audit did not complete. Check ProxyAPI key, model, balance and server logs."
        },
        { status: 502 }
      );
    }

    if (body.requireAi === true) {
      await saveAuditReportByLeadId(body.leadId, analysis);
    }

    return NextResponse.json({
      analysis,
      previewReport: analysis.previewReport
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось проанализировать сайт";
    const isInputError =
      error instanceof SyntaxError ||
      message === "Введите адрес сайта" ||
      message === "Поддерживаются только http и https адреса" ||
      message === "Локальные адреса недоступны для анализа" ||
      message === "Invalid URL";

    return NextResponse.json(
      {
        error: isInputError
          ? "Введите корректный публичный адрес сайта"
          : "Не удалось открыть сайт. Проверьте адрес или попробуйте позже."
      },
      { status: isInputError ? 400 : 502 }
    );
  }
}
