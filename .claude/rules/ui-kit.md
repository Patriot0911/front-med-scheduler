---
paths:
  - "src/components/ui/**"
  - "src/interfaces/ui/**"
---

# UI kit

- Before a new component check `.claude/skills/frontend-ui-kit/references/component-inventory.md`; update it afterwards.
- The kit knows nothing about the domain: no queries, `Permission`, entities.
- Props live in `src/interfaces/ui/*.d.ts`, extend native attributes, `className` is passed last into `cn(...)`.
- Field = base component + `Form*` wrapper (`useFormInputProps` / `useController`); the wrapper does not accept `error` / `touched` from outside.
- Every declared prop has an effect (do not repeat `Button size` without styles).
- Dropdown panels — only `useFloatingPanel`; modals — only `Modal` / `SideModal`.
- Kit texts — namespace `ui`; contextual texts come via props.
- Changing a prop contract — update all call sites in the same change.
