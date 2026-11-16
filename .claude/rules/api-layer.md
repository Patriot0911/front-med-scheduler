---
paths:
  - "src/lib/services/**"
  - "src/lib/axios.ts"
  - "src/hooks/queries/**"
  - "src/hooks/mutations/**"
  - "src/interfaces/**/*.ts"
---

# Шар API

- Типи відповідей і payload звіряй з `../api-med-scheduler/src/modules/<name>/{dto,models,mappers}`; імена полів — як у бекенді, nullable — `| null`.
- Сервіс: клас зі статичними методами + enum `<X>QueryKey`, шлях без `/api`, масиви — `paramsSerializer: { indexes: null, }`.
- Перший елемент ключа query — значення enum; таблиці — `placeholderData: (prev) => prev`, довідники — `staleTime` 5 хв + `enabled`.
- Мутація інвалідує **усі** списки, що показують сутність (див. карту в скілі `frontend-api-resource`); повідомлення — з i18n.
- Помилки — лише `getErrorMessage(error)`; 401 обробляє інтерцептор.
- Серверні дані не кладуться в Redux.
- `Permission` змінюється синхронно з бекендом (enum + міграція там, `permission.ts` + `permissions.config.ts` + `permissions.json` тут).
