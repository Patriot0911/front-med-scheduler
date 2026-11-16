---
name: frontend-i18n
description: Тексти й мультимовність у front-med-scheduler (uk + en, i18next) — де брати t у серверних / клієнтських компонентах і поза React, як додати ключ чи namespace, множина для української (_one/_few/_many/_other), цілі фрази без склеювання, ключі в конфігах замість текстів, повідомлення zod, дати й локаль dayjs, стиль описів і підказок. Використовуй щоразу, коли з'являється або змінюється текст в UI, додається конфіг з підписами, zod-схема, форматування дат, або при старті нового проєкту, щоб i18n був з першого компонента.
---

# Тексти та i18n

Мови: `uk` (дефолт), `en` (мова ключів і fallback). Без префікса мови в URL; мова — cookie `NEXT_LOCALE` → `Accept-Language` → `uk`. Перемикання перезавантажує сторінку.

**Урок історії:** i18n додали наприкінці — ретрофіт зачепив ~3 850 рядків, бо тексти були в JSX, у модульних константах (колонки, опції) і склеювались у коді. Тому будь-який новий текст одразу йде через ключ в **обох** мовах.

## 1. Де брати `t`

| Де код | Як |
|---|---|
| серверна сторінка, `layout`, `generateMetadata` | `const t = await getServerTranslation('<ns>')` з `@/i18n/server` |
| клієнтський компонент / хук | `const { t, } = useTranslation('<ns>')`; кілька: `useTranslation(['lessons', 'common'])` + `t('common:actions.cancel')` |
| поза React (фабрики колонок, axios, `getErrorMessage`, підписи дозволів) | `getGlobalI18n().t(...)` з `@/i18n/client/i18nRef` |
| zod-схема | `validationError('key', { count, })` / `validationMessage(...)` з `@/i18n/client/validation` |

Межі: `react-i18next` — лише в модулях з `'use client'`; `i18n/server/*` — `server-only`; `i18n/client/*` — `client-only`. Типи з `server/resources` — тільки `import type`.

## 2. Ключі й файли

- `src/i18n/locales/<uk|en>/<ns>.json`. Namespace на домен: `common`, `layout`, `auth`, `ui`, `public`, `validation`, `permissions`, `dictionaries`, `users`, `lessons`.
- Новий namespace: JSON в обох мовах + імпорт і запис в обидва об'єкти `en` / `uk` у `i18n/server/resources.ts`.
- `uk` типізований через `en`: відсутній ключ — помилка `tsc`. Ключі типобезпечні (`interfaces/i18n/i18next.d.ts`), тож `t('typo')` теж не скомпілюється.
- Структура ключів: `<розділ>.<елемент>` — `form.createTitle`, `form.editDescription`, `filters.teacherIds.label`, `columns.name`, `button.ide`. Спільні дії (`cancel`, `close`, `saveChanges`) — `common:actions.*`, не дублюй у доменних.

## 3. Правила тексту

- **Фраза цілком.** `t('departments.add')`, а не `` `${t('add')} ${name}` `` — склеювання ламає відмінки. Змінна частина — інтерполяція: `"confirmDelete": "Видалити «{{name}}»?"`.
- **Множина** — через `count`:
  ```json
  // en
  "count_one": "{{count}} lesson", "count_other": "{{count}} lessons"
  // uk
  "count_one": "{{count}} заняття", "count_few": "{{count}} заняття", "count_many": "{{count}} занять", "count_other": "{{count}} заняття"
  ```
  `t('count', { count, })`. Жодних `count === 1 ? … : …`. В `uk` завжди чотири форми.
- **Конфіги зберігають ключі.** `label: 'nav.overview'`, заголовки колонок — ключі namespace; тексти кнопок за станом мутації — `Record<LoadingState, ParseKeys<'<ns>'>>` у `configs/<domain>.dictionary.ts`, у компоненті `t(dict[state])`.
- **Модульні константи з текстом заборонені**: вони обчислюються до вибору мови. Колонки таблиць, опції селектів — фабрика від `t` (`createLessonColumns(t)`) або збираються в компоненті.
- Тексти помилок бекенду приходять англійською і показуються як є.

## 4. Стиль

| Що | Як |
|---|---|
| Заголовок модалки / вкладки | 1–3 слова |
| Опис розділу, вкладки, модалки | 1–3 речення: що це, на що впливає, обмеження |
| Опис create / edit модалки | обидва: `form.createDescription` і `form.editDescription` |
| `hint` поля | кілька слів |
| Порожній стан | що тут буде і як це додати |
| Заглушка доступу | `noAccess` — чому не видно, без технічних деталей |

Описи **не обіцяють** поведінки, якої немає в `../api-med-scheduler/docs/domain.md`. Українська — природна, без кальок («Зберегти зміни», а не «Зберегти редагування»); терміни з глосарію `frontend-domain` (група занять ≠ студентська група).

## 5. Дати

- `dayjs` лише з `@/lib/dayjs` (локаль `uk` / `en-gb`, тиждень з понеділка).
- Назви місяців і днів — з dayjs (`format('MMM')`, `getWeekdayLabels()`), не з JSON.
- Календарю передається `culture`.
- Під час SSR локаль dayjs глобальна — у коді, що форматує дати на сервері, передавай її явно: `dayjs(x).locale(locale)`.

## 6. Чекліст

- [ ] У JSX немає літеральних текстів (крім розділових знаків і чисел).
- [ ] Ключ додано в `en` **і** `uk`; `npx tsc --noEmit` чистий.
- [ ] Множина через `count`, в `uk` чотири форми.
- [ ] Жодного склеювання фраз у коді.
- [ ] Конфіги й константи містять ключі або є фабриками від `t`.
- [ ] Серверний код — `getServerTranslation`, клієнтський — `useTranslation`, поза React — `getGlobalI18n`.
- [ ] Перевірено обома мовами (довші українські рядки не ламають верстку).
