# LeadFix Audit Module

Серверный модуль аудита. Здесь лежит рабочая версия методологии, критериев, scoring, JSON-схемы и сборки prompt.

## Файлы

- `methodology.md` — методология LeadFix.
- `audit-checklist.md` — чеклист полного аудита.
- `criteria.csv` — критерии, экспортированные из `../CRO/2. Сriteria v1.xlsx`.
- `scoring.md` — веса, формулы и правила scoring.
- `config.ts` — категории и веса для приложения.
- `schema.ts` — JSON Schema для ответа модели.
- `prompt.ts` — сборка system/user prompt.
- `result.ts` — fallback AuditResult без AI.
- `quality.ts` — Quality Reviewer для результата.

## Процесс

1. Пользователь вводит URL.
2. API скачивает HTML.
3. `analyzeHtml.ts` извлекает title, description, H1/H2, кнопки, формы, контакты, текст страницы.
4. `prompt.ts` собирает prompt из методологии, scoring, criteria и данных сайта.
5. `openaiAudit.ts` отправляет prompt в ProxyAPI, если есть ключ.
6. Модель возвращает `AuditResult`.
7. `quality.ts` проверяет evidence, confidence, overpromise и предупреждения.
8. Отчёт отображает `AuditResult`.

## Dry-run

Проверить prompt без API:

```bash
npm run audit:dry-run -- https://example.com
```

Результат:

```text
tmp/audit-prompt-preview.txt
```

Этот файл не отправляется в ProxyAPI и не должен попадать в git.

## Обновление критериев

После изменения Excel-файла:

```bash
npm run audit:export-criteria
```

Команда экспортирует лист `Критерии` из:

```text
../CRO/2. Сriteria v1.xlsx
```

в:

```text
src/lib/audit/criteria.csv
```

## Правила безопасности

- Не переносить файлы этого модуля в `public/`.
- Не импортировать модуль в client components.
- Не отдавать prompt и criteria через API.
- Не логировать полный prompt в production.

