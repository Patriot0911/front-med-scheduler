---
paths:
  - "src/**/*.scss"
---

# Styles

- Colors, radii, shadows, fonts, font weights — only CSS tokens from `src/styles/abstracts`. No hex / `rgb()` / color names; transparency — `rgba(var(--color-*-rgb), α)`.
- Spacing and z-index — from the scale in skill `frontend-styling` (section 2), not arbitrary values.
- Fonts — only a variable created in `src/fonts/*.ts`; `--font-plus-jakarta` and `--font-lora` do not exist.
- Mobile-first: base styles for phones, wider ones — `@include mq('sm' | 'md' | 'lg' | 'xl')`.
- No local `scrollbar-width` (except `none`), no `:global` for third-party libraries (they go to `styles/vendors/`).
- A domain component's module does not override a ui component's look; need a variant — add it in `components/ui`.
- A new token goes into `abstracts`, not into a module.
