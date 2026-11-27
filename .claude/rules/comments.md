---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "src/**/*.scss"
---

# Comments

- Zero comments by default, JSDoc included: simple components, props, handlers, hooks, styles, configs, types and obvious conditions get none.
- A comment fits only as a description of a genuinely complex component or logic that cannot be understood without it (`useFloatingPanel`, `buildSeriesDates`).
- Do not restate what names already say. Heavy comments in existing code are not a model.
