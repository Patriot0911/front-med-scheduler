---
paths:
  - "src/**/*.tsx"
  - "src/configs/**"
  - "src/i18n/**"
  - "src/**/*.scheme.ts"
---

# Texts

- No literal texts in JSX or configs: only i18n keys, added to both `en` **and** `uk`.
- `t`: server pages — `getServerTranslation`, client components — `useTranslation`, outside React — `getGlobalI18n()`, zod — `validationError` / `validationMessage`.
- Whole phrases (no gluing words together), plurals — `t('key', { count, })` with four forms in `uk`.
- Module constants with texts (columns, options) — factories taking `t`.
- Descriptions never promise behavior that is not in `../api-med-scheduler/docs/domain.md`; terms follow the glossary in skill `frontend-domain`.
- Dates — `@/lib/dayjs`, month and day names — from dayjs.
