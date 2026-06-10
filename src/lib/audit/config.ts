import type { AuditCategoryId, AuditCategoryStatus } from "@/types/audit";

export const AUDIT_METHOD_VERSION = "1.0";

export const AUDIT_CATEGORIES: Array<{
  id: AuditCategoryId;
  title: string;
  weight: number;
}> = [
  { id: "offer", title: "Оффер и первый экран", weight: 20 },
  { id: "ads", title: "Соответствие рекламе и запросу", weight: 15 },
  { id: "mobile", title: "Мобильная версия", weight: 15 },
  { id: "cta", title: "CTA и путь к заявке", weight: 15 },
  { id: "trust", title: "Доверие и доказательства", weight: 15 },
  { id: "forms", title: "Формы и снижение трения", weight: 8 },
  { id: "structure", title: "Структура страницы", weight: 7 },
  { id: "technical", title: "Скорость и технические барьеры", weight: 5 }
];

export const CATEGORY_BY_ID = Object.fromEntries(AUDIT_CATEGORIES.map((category) => [category.id, category]));

export function getCategoryStatus(score: number): AuditCategoryStatus {
  if (score <= 3) return "Слабое место";
  if (score <= 6) return "Требует внимания";
  if (score <= 8) return "Нормально";
  return "Хорошо";
}
