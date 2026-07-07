import nodemailer from "nodemailer";

type SendReportReadyEmailInput = {
  to: string;
  plan: string;
  reportUrl: string;
};

type NotifyOwnerInput = SendReportReadyEmailInput & {
  leadId: string;
  auditedUrl: string;
};

function getSmtpConfig() {
  const host = process.env.LEADFIX_SMTP_HOST;
  const port = Number(process.env.LEADFIX_SMTP_PORT || 465);
  const user = process.env.LEADFIX_SMTP_USER;
  const pass = process.env.LEADFIX_SMTP_PASSWORD;
  const from = process.env.LEADFIX_NOTIFICATION_FROM || user;

  if (!host || !user || !pass || !from) return null;

  return { host, port, user, pass, from };
}

function createTransporter() {
  const config = getSmtpConfig();
  if (!config) return null;

  return {
    config,
    transporter: nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass
      }
    })
  };
}

export async function sendReportReadyEmail({ to, plan, reportUrl }: SendReportReadyEmailInput) {
  const mailer = createTransporter();
  if (!mailer || !to) return;

  const isPro = plan.toLocaleLowerCase("ru-RU").includes("pro");
  const text = [
    "Здравствуйте.",
    "",
    "Ваш аудит LeadFix готов:",
    reportUrl,
    "",
    isPro
      ? "По тарифу LeadFix Pro автоматический AI-отчет доступен сразу. Финальная экспертная проверка будет подготовлена отдельно."
      : "Отчет доступен по ссылке выше.",
    "",
    "Если ссылка не открывается, напишите в Telegram: @LeadFixRu"
  ].join("\n");

  await mailer.transporter.sendMail({
    from: mailer.config.from,
    to,
    subject: `Ваш аудит LeadFix готов: ${plan}`,
    text
  });
}

export async function notifyOwnerReportReady({ leadId, auditedUrl, to, plan, reportUrl }: NotifyOwnerInput) {
  const ownerEmail = process.env.LEADFIX_NOTIFICATION_EMAIL;
  const mailer = createTransporter();
  if (!mailer || !ownerEmail) return;

  await mailer.transporter.sendMail({
    from: mailer.config.from,
    to: ownerEmail,
    subject: `LeadFix: отчет готов ${plan}`,
    text: [
      "Отчет LeadFix готов.",
      "",
      `ID: ${leadId}`,
      `Тариф: ${plan}`,
      `URL: ${auditedUrl}`,
      `Email клиента: ${to}`,
      "",
      reportUrl
    ].join("\n")
  });
}
