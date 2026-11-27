---
name: frontend-ui-kit
description: Як створювати, змінювати або перестворювати компоненти дизайн-системи front-med-scheduler (src/components/ui) — анатомія компонента, контракт пропсів у interfaces/ui, пара базовий компонент + Form*-обгортка, матриця станів, оверлеї через useFloatingPanel, compound-компоненти через контекст, доступність, адаптивність і процедура міграції з іншого UI-кіта. Використовуй, коли додаєш новий ui-компонент, новий проп / варіант / розмір, переносиш компонент з іншого проєкту або бачиш, що в доменному коді з'являється верстка, яка мала б бути в кіті.
---

# UI-кіт (`src/components/ui`)

Перш ніж писати компонент — переглянь [references/component-inventory.md](references/component-inventory.md). Розширити наявний (новий проп / варіант) майже завжди краще, ніж зробити схожий другий. Стилі й токени — за `frontend-styling`; модалки — `frontend-modals`.

## 1. Анатомія

```
src/components/ui/<Name>/
  index.tsx              # 'use client', якщо є хуки / події
  styles.module.scss
  components/<Part>/     # внутрішні частини (SelectArea, TableBody…)
  context.ts             # для compound-компонентів
src/interfaces/ui/<group>.d.ts   # пропси: I<Name>Props (+ IForm<Name>Props)
```

```tsx
const Button = ({ variant = 'primary', size = 'md', isLoading = false, disabled, className, children, ...props }: IButtonProps) => (
  <button type="button" className={cn(styles.button, styles[variant], styles[size], className)} disabled={disabled || isLoading} aria-busy={isLoading} {...props}>
    {children}
  </button>
);
```

- Пропси розширюють нативні атрибути елемента (`ButtonHTMLAttributes<HTMLButtonElement>`), решта прокидається `...props`; `className` — останнім у `cn(...)`.
- Дефолти — у деструктуризації. Union-типи варіантів / розмірів — окремі `type` (`ButtonVariant`), щоб ними користувались мапи (`LoadingStateVariantsMap`).
- Кіт **не знає домену**: жодних запитів, `Permission`, сутностей. Доменні обгортки — у `components/<domain>/`.
- Тексти всередині кіта (aria-підписи, «Nothing found», пагінація) — з namespace `ui`; усе, що залежить від місця вживання (`label`, `placeholder`, `emptyText`), приходить пропом.

## 2. Контракт поля

Однаковий для всіх полів (`Input`, `Textarea`, `Select`, `MultiSelect`, `DateTimeField`, `Switch`, …):

| Проп | Сенс |
|---|---|
| `label`, `hint`, `placeholder` | тексти з місця вживання |
| `error?: string` | повідомлення; наявність = стан помилки |
| `touched?: boolean` | успішно заповнене поле (зелений стан) |
| `hideErrorMessage` | поле лише червоніє, не тримає місце під текст (щільні форми) |
| `required` / прапорець «optional» | **одна** назва для всіх полів |
| `disabled` | |

Пара для форм — `Form<Name>` з `name: Path<T>`: бере значення й стан із `useFormInputProps` (Input-подібні) або `useController`, **не** приймає `error` / `touched` ззовні:

```tsx
const FormInput = <T extends FieldValues>({ name, ...props }: IFormInputProps<T>) => {
  const fieldProps = useFormInputProps<T>(name);
  return <Input {...props} {...fieldProps} />;
};
// IFormInputProps<T> = Omit<IInputProps, 'name' | 'error' | 'touched'> & { name: Path<T> }
```

Коли показувати помилку, вирішує **лише** `useFormInputProps` (після submit, або коли поле змінене / має значення). Не дублюй цю логіку в компонентах.

Відомі розбіжності (не повторювати в новому коді, вирівнювати при нагоді): `Select` має `showOptionalFlag`, інші — `required`; `Input` показує текст помилки лише з `hideHintOnError`, а `Textarea` / `Select` — завжди; `Checkbox` / `Switch` мають `onChange(checked)` замість події.

## 3. Матриця станів

Кожен інтерактивний компонент перед готовністю перевіряється в усіх станах, що йому властиві:

| Стан | Вимога |
|---|---|
| default / hover | hover лише `:hover:not(:disabled)` |
| focus-visible | видимий `outline` на `--color-primary` (rgba), не `outline: none` без заміни |
| active / selected | |
| disabled | `opacity` + `cursor: default`, без hover |
| loading | `isLoading` блокує взаємодію, `aria-busy` |
| error / touched | кольори `--color-error*` / `--color-success*` |
| порожній / довгий вміст | обрізання `text-overflow` або перенос, без розширення батька |
| мобільний (< 576px) | |

**Кожен оголошений проп має візуальний ефект.** `Button size` зараз оголошений, але стилів розмірів немає — так не робимо: або стилі, або без пропа.

## 4. Оверлеї та випадні панелі

- Випадне (список селекта, панель дати) — **лише** `useFloatingPanel({ isOpen, anchorRef, panelRef, onClose, matchWidth })`: портал у `body`, `position: fixed`, вибір сторони, закриття по кліку поза, Escape, прокрутці. CSS панелі: `position: fixed; visibility: hidden;`, без `style`-пропа.
- Модальне — `Modal` / `SideModal` (стек через `useModalDismiss`). Власних порталів, overlay, обробників Escape не пишемо.
- Шар z-index — з таблиці шарів у `frontend-styling`.

## 5. Compound-компоненти

Коли в компонента є частини, які споживач компонує (`Modal.Header / Content / Footer`, `Table` + `TableBody` / `TablePagination`): стан у `context.ts` (`createContext` + хук з перевіркою), частини — статичні властивості (`Modal.Header = ModalHeader`). Конфіг-подібні дані (колонки, дії, `rowLock`) — пропи кореня, а не діти.

## 6. Доступність

- `<button type="button">` за замовчуванням; `type="submit"` лише явно.
- Іконкові кнопки — `aria-label` (`iconLabel` в `Input`).
- Списки: стрілки, Enter, Escape; `role="listbox" / "option"`, `aria-selected`, `aria-expanded` на тригері.
- `label` пов'язаний з полем (`htmlFor` / вкладення).
- Змішаний стан (`Checkbox indeterminate`) має бути помітним і для скрінрідера (`aria-checked="mixed"`), а не лише візуально.

## 7. Перестворення / міграція з іншого кіта

Так зайшов кіт з іншого проєкту (коміт `0c2d3fb`), і після нього лишились чужі токени та розбіжні пропи. Процедура:

1. Інвентар: для кожного компонента випиши старі пропи → нові за контрактом розділу 2. Розбіжні імена (`hideOptionalFlag` / `showOptionalFlag` / `required`) зводь до одного **до** перенесення.
2. Стилі: усі кольори, відступи, радіуси, тіні, z-index, шрифти → токени `frontend-styling`. Невідомі змінні (`--ink-*`, `--surface*`, `--font-lora`) не переносити.
3. Тексти → namespace `ui`.
4. Типи пропсів → `interfaces/ui/*.d.ts`.
5. Пройди матрицю станів (розділ 3) і мобільну ширину.
6. Онови виклики й видали старий компонент у тій самій зміні — двох варіантів одного компонента в коді бути не повинно.
7. Онови `references/component-inventory.md`.

## 8. Чекліст

- [ ] Наявного компонента з тією ж роллю немає (інвентар).
- [ ] Пропси в `interfaces/ui/*.d.ts`, розширюють нативні атрибути, `className` прокидається.
- [ ] Поле: контракт розділу 2 + `Form*`-обгортка через `useFormInputProps` / `useController`.
- [ ] Усі стани матриці; кожен проп має ефект.
- [ ] Випадне — `useFloatingPanel`, модальне — `Modal` / `SideModal`.
- [ ] Стилі лише на токенах, mobile-first.
- [ ] Тексти кіта з `ui`, решта — пропами.
- [ ] Інвентар оновлено.
