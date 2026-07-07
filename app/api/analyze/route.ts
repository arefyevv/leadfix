import { NextResponse } from "next/server";
import { analyzeHtml } from "@/lib/analyzeHtml";
import { enforceFreeAuditLimit, readFreeAuditCache, saveFreeAuditCache } from "@/lib/freeAuditAccess";
import { findLeadById } from "@/lib/leads";
import { generatePaidAudit, isAuditInputError, loadAuditHtml, normalizeAuditUrl } from "@/lib/paidAudit";
import { deliverReportNotification } from "@/lib/reportNotifications";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: unknown; requireAi?: unknown; leadId?: unknown; plan?: unknown };
    const requiresAi = body.requireAi === true;
    const plan = typeof body.plan === "string" ? body.plan.trim() : "";

    if (requiresAi) {
      const leadId = String(body.leadId || "");
      const analysis = await generatePaidAudit({
        url: String(body.url || ""),
        leadId,
        plan
      });
      const lead = await findLeadById(leadId);

      void deliverReportNotification({
        leadId,
        plan,
        url: String(body.url || ""),
        email: lead?.email || ""
      }).catch((deliveryError) => {
        console.error("Paid audit report delivery failed", deliveryError);
      });

      return NextResponse.json({
        analysis,
        previewReport: analysis.previewReport
      });
    }

    const url = normalizeAuditUrl(body.url);
    const cachedAnalysis = await readFreeAuditCache(url);
    if (cachedAnalysis) {
      return NextResponse.json({
        analysis: cachedAnalysis,
        previewReport: cachedAnalysis.previewReport,
        cached: true
      });
    }

    await enforceFreeAuditLimit(request, url);

    const { html, finalUrl } = await loadAuditHtml(url);
    const analysis = {
      ...analyzeHtml(html, finalUrl),
      screenshots: [],
      plan
    };

    await saveFreeAuditCache(url, analysis);

    return NextResponse.json({
      analysis,
      previewReport: analysis.previewReport
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось проанализировать сайт";
    const freeLimitError = message === "FREE_AUDIT_IP_LIMIT" || message === "FREE_AUDIT_URL_LIMIT";

    return NextResponse.json(
      {
        error: freeLimitError
          ? "Бесплатный лимит проверок исчерпан. Попробуйте позже или оформите полный аудит."
          : isAuditInputError(error, message)
            ? "Введите корректный публичный адрес сайта"
            : "Не удалось открыть сайт. Проверьте адрес или попробуйте позже."
      },
      { status: freeLimitError ? 429 : isAuditInputError(error, message) ? 400 : 502 }
    );
  }
}
