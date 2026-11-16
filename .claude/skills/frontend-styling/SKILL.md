---
name: frontend-styling
description: Контракт стилів front-med-scheduler — CSS-токени (кольори, радіуси, тіні, типографіка) і токени, яких бракує (шкала відступів, шари z-index, тривалості анімацій), SCSS-модулі, mobile-first з mq(), кольори з прозорістю через *-rgb, правила скролбару й стилів сторонніх бібліотек, зміна бренду. Використовуй, коли пишеш або змінюєш будь-який .scss, додаєш токен, міняєш бренд / палітру, або перед стартом UI-кіта в новому проєкті.
---

# Стилі й токени

Токени — `src/styles/abstracts/` (`_colors.scss`, `_variables.scss`, `_typography.scss`, `_breakpoints.scss`, `_mixins.scss`), підключаються один раз у `global.scss`. Модулі компонентів **лише споживають** токени.

## 1. Наявні токени

| Група | Токени | Вживання |
|---|---|---|
| База | `--color-light`, `--color-dark` (+ `-rgb`) | |
| Поверхні | `--color-bg`, `--color-surface`, `--color-surface-hover` | фон сторінки / карток / hover рядків |
| Межі | `--color-border`, `--color-border-strong` | |
| Текст | `--color-text-primary`, `--color-text-secondary`, `--color-text-muted` | `--color-text` = primary |
| Нейтральні | `--color-neutral-50…600` | |
| Бренд | `--color-primary` (+ `-rgb`, `-50…500`) | дії, фокус, активне |
| Вторинний | `--color-secondary` (+ `-100…400`) | темні акценти |
| Акцент | `--color-accent` (+ `-rgb`, `-50…500`) | ролі, адмінські позначки |
| Стани | `--color-error`, `--color-success`, `--color-warning` (+ `-rgb`, `-50…500`) | |
| Радіуси | `--radius-sm` 6, `--radius-md` 10, `--radius-lg` 16, `--radius-full` | |
| Тіні | `--shadow-sm`, `--shadow-md`, `--shadow-lg` | картка / випадне / модалка |
| Текст | `--text-sm` .875, `--text-md` 1, `--text-lg` 1.25, `--text-xl` 1.75 rem | |
| Насиченість | `--font-weight-regular / medium / semibold / bold` | не цифрами |
| Шрифти | `--font-jost`, `--font-geist-sans`, `--font-geist-mono`, `--font-oswald` (з `next/font`) | |

Прозорість — лише через `-rgb`: `rgba(var(--color-primary-rgb), 0.12)`. Новий колір зі шкалою, якому потрібна прозорість, отримує й `-rgb`.

## 2. Токени, яких бракує

У коді зараз 12+ різних значень `gap` (px і rem упереміш), z-index 1 / 5 / 6 / 10 / 20 / 50 / 60 / 1000 / 1100 без системи, тривалості 0.1–0.25s. При перереалізації ці токени заводяться **до** першого компонента; у поточному коді — додаються в `abstracts` разом з першою зміною, яка їх потребує, і далі вживаються в нових стилях (масово старі файли не переписуй без прохання).

```scss
// _variables.scss — пропозиція, побудована з фактично вживаних значень
:root {
  --space-3xs: 2px;
  --space-2xs: 4px;
  --space-xs: 6px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;

  --z-raised: 1;          // елемент над сусідами в межах компонента
  --z-calendar: 10;       // внутрішні шари react-big-calendar
  --z-sticky: 20;         // липкі тулбари
  --z-sidebar: 50;
  --z-floating: 60;       // плаваючі кнопки (LanguageSwitch, BackToPlatform)
  --z-overlay: 1000;      // Modal, SideModal, оверлей RequireAuth; стек модалок — порядком порталів
  --z-popover: 1100;      // панелі useFloatingPanel (над модалками)
  // react-hot-toast — власний z-index 9999

  --duration-fast: 0.12s; // hover дрібних елементів
  --duration-base: 0.15s; // типові переходи
  --duration-slow: 0.25s; // розгортання, панелі
  --ease-standard: ease;
}
```

Поки токенів немає — бери значення **з цієї шкали** (а не довільні), щоб пізніша заміна на змінні була механічною.

## 3. Шрифти

`_typography.scss` оголошує `--font-primary: var(--font-plus-jakarta)` і `--font-secondary: var(--font-lora)`, але ці шрифти **не завантажуються** — посилання на них порожні. Реально вживаються `--font-jost` (основний для контенту й кнопок) і `--font-geist-sans`. Правило: токен шрифту посилається лише на змінну, створену в `src/fonts/*.ts` через `next/font`. При зміні бренду — спершу `fonts/`, потім `_typography.scss`, потім заміна прямих `--font-jost` на семантичні `--font-primary`.

## 4. SCSS-модулі

- Файл `styles.module.scss` поруч з компонентом; класи kebab-case, звертання `styles['nav-container']`.
- Mobile-first: базові стилі для телефона, далі
  ```scss
  @use '../../../styles/abstracts/mixins' as *;
  .fields {
    display: grid;
    grid-template-columns: 1fr;
    @include mq('md') { grid-template-columns: 1fr 1fr; }
  }
  ```
  Брейкпоінти sm 576 / md 768 / lg 992 / xl 1200; у JS — `configs/breakpoints.config.ts` + `useMediaQuery`.
- Хардкод кольорів заборонений (зараз порушують `ui/Loading` і `ui/Button` — не копіюй звідти).
- Tailwind — лише дрібні утиліти в JSX (`flex-1`); верстка — SCSS.
- Скролбар — лише глобальний `styles/base/_scrollbar.scss`; локально `scrollbar-width` не задавати (крім `none` + `&::-webkit-scrollbar { display: none; }`).
- Стилі сторонніх бібліотек — `styles/vendors/_<lib>.scss`, не `:global` у модулях.
- Модуль доменного компонента не перевизначає оформлення ui-компонента (контейнер модалки, кнопки): потрібен варіант — додай його в кіт.
- Фокус — `:focus-visible` з `outline` на `rgba(var(--color-primary-rgb), 0.5)`.

## 5. Зміна бренду / палітри

1. Міняються лише значення в `_colors.scss` (зберігаючи імена й шкали 50–500 + `-rgb`).
2. Перевір контраст тексту на `primary` / `accent` / станах (WCAG AA: 4.5:1 для тексту).
3. Пошук залишків: `grep -rnE "#[0-9a-fA-F]{3,6}\b|rgba\([0-9]" src --include='*.scss' | grep -v abstracts`.
4. Перевір календар (`vendors/_calendar.scss`) — він має найбільше власних кольорових правил.

## 6. Чекліст

- [ ] Кольори, радіуси, тіні, шрифти, насиченість — лише токени; прозорість через `-rgb`.
- [ ] Відступи й z-index — зі шкали розділу 2.
- [ ] Mobile-first через `mq()`; перевірено < 576px.
- [ ] Без локального `scrollbar-width`, без `:global` для бібліотек.
- [ ] Новий токен доданий в `abstracts`, а не в модуль.
