---
paths:
  - "src/**/*.tsx"
  - "src/configs/**"
  - "src/i18n/**"
  - "src/**/*.scheme.ts"
---

# Тексти

- Жодних літеральних текстів у JSX і конфігах: лише ключі i18n, додані в `en` **і** `uk`.
- `t`: серверні сторінки — `getServerTranslation`, клієнтські компоненти — `useTranslation`, поза React — `getGlobalI18n()`, zod — `validationError` / `validationMessage`.
- Фраза цілком (без склеювання слів), множина — `t('key', { count, })` з чотирма формами в `uk`.
- Модульні константи з текстами (колонки, опції) — фабрики від `t`.
- Описи не обіцяють поведінки, якої немає в `../api-med-scheduler/docs/domain.md`; терміни — за глосарієм скіла `frontend-domain`.
- Дати — `@/lib/dayjs`, назви місяців і днів — з dayjs.
