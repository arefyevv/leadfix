import { NextResponse } from "next/server";
import { analyzeHtml } from "@/lib/analyzeHtml";

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
    const body = (await request.json()) as { url?: unknown };
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
    const analysis = analyzeHtml(html, response.url || url.href);

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
