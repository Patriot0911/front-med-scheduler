---
paths:
  - "src/components/ui/**"
  - "src/interfaces/ui/**"
---

# UI-кіт

- Перед новим компонентом звір `.claude/skills/frontend-ui-kit/references/component-inventory.md`; після — онови його.
- Кіт не знає домену: без запитів, `Permission`, сутностей.
- Пропси — у `src/interfaces/ui/*.d.ts`, розширюють нативні атрибути, `className` прокидається останнім у `cn(...)`.
- Поле = базовий компонент + `Form*`-обгортка (`useFormInputProps` / `useController`); обгортка не приймає `error` / `touched` ззовні.
- Кожен оголошений проп має ефект (не повторюй `Button size` без стилів).
- Випадні панелі — лише `useFloatingPanel`; модальне — лише `Modal` / `SideModal`.
- Тексти кіта — namespace `ui`; контекстні тексти приходять пропами.
- Зміна контракту пропа — оновити всі виклики в тій самій зміні.
