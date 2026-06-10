# LeadFix Scoring

Общий score считается по весам категорий:

- Оффер и первый экран: 20%
- Соответствие рекламе и запросу: 15%
- Мобильная версия: 15%
- CTA и путь к заявке: 15%
- Доверие и доказательства: 15%
- Формы и снижение трения: 8%
- Структура страницы: 7%
- Скорость и технические барьеры: 5%

Каждая категория получает score 0-10. Взвешенный балл категории:

```text
weightedScore = categoryScore / 10 * categoryWeight
```

Итог:

```text
overallScore = sum(weightedScore)
```

Проблемы сортируются по `priorityScore`:

```text
priorityScore = impact * confidence * severityMultiplier / complexity
```

Severity multiplier:

- critical: 1.25
- high: 1.1
- medium: 1.0
- low: 0.8
