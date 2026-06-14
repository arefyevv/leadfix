# LeadFix App Instructions

## Приложение

Это Next.js приложение LeadFix. Оно собирает URL сайта, анализирует HTML страницы и формирует демо/полный отчёт по CRO-аудиту.

Основной backend flow:

1. `app/api/analyze/route.ts` принимает URL.
2. `src/lib/analyzeHtml.ts` собирает базовые данные страницы.
3. `src/lib/audit/prompt.ts` собирает prompt по методологии LeadFix.
4. `src/lib/openaiAudit.ts` отправляет запрос в ProxyAPI, если есть `PROXYAPI_API_KEY`.
5. `src/lib/audit/quality.ts` проверяет результат.
6. Фронтенд строит отчёт из `AuditResult`.

Если ключа ProxyAPI нет или AI-запрос упал, сайт должен работать через fallback.

## Команды

```bash
npm run audit:export-criteria
npm run audit:dry-run -- https://example.com
npm run typecheck
npm run build
```

`audit:export-criteria` экспортирует критерии из:

```text
../CRO/2. Сriteria v1.xlsx
```

в:

```text
src/lib/audit/criteria.csv
```

`audit:dry-run` собирает prompt без отправки в ProxyAPI.

## Audit Contract

Главный контракт данных — `AuditResult` в:

```text
src/types/audit.ts
```

Дизайн отчёта можно менять свободно, но нельзя ломать структуру `AuditResult` без осознанной миграции всех мест:

- `src/lib/audit/schema.ts`
- `src/lib/audit/result.ts`
- `src/lib/openaiAudit.ts`
- `src/components/FullReport.tsx`
- `src/components/PreviewReport.tsx`

Фронтенд должен отображать данные из `AuditResult`, а не придумывать контент внутри компонентов.

## Конфиденциальность

Файлы в `src/lib/audit/` считаются серверными и конфиденциальными:

- `methodology.md`
- `criteria.csv`
- `scoring.md`
- `prompt.ts`
- `schema.ts`
- `quality.ts`

Нельзя:

- переносить их в `public/`;
- импортировать их в client components;
- отдавать их через API;
- выводить полный prompt в UI;
- логировать prompt в production.

Dry-run файл:

```text
tmp/audit-prompt-preview.txt
```

нужен только для ручной проверки и не должен попадать в git.

## Frontend Rules

- Не делать отчёт статическим.
- Не хардкодить score, категории, проблемы и рекомендации, если они есть в `AuditResult`.
- Сохранять fallback-состояние, если `aiProvider` пустой.
- Не ломать checkout и full-report маршруты.
- Не показывать один и тот же post-payment сценарий для `Экспресс` и `LeadFix Pro`: `Экспресс` ведёт в автоматический `/full-report`, `LeadFix Pro` ведёт на статус ручной экспертной проверки.
- После правок интерфейса проверять `/report` и `/full-report`.

## Environment

Для AI-аудита через ProxyAPI нужны:

```env
PROXYAPI_API_KEY=
PROXYAPI_BASE_URL=https://openai.api.proxyapi.ru/v1
PROXYAPI_AUDIT_MODEL=gpt-5.4-mini
```

Без `PROXYAPI_API_KEY` сайт должен работать без AI.

Production-процесс должен запускаться через:

```bash
pm2 start ecosystem.config.cjs --update-env
```

`ecosystem.config.cjs` читает `.env` и `.env.local`, чтобы PM2 стабильно видел `YOOKASSA_*` и `PROXYAPI_*`.
