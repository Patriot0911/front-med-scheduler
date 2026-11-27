---
paths:
  - "src/lib/services/**"
  - "src/lib/axios.ts"
  - "src/hooks/queries/**"
  - "src/hooks/mutations/**"
  - "src/interfaces/**/*.ts"
---

# API layer

- Check response and payload types against `../api-med-scheduler/src/modules/<name>/{dto,models,mappers}`; field names as in the backend, nullable — `| null`.
- Service: a class with static methods + enum `<X>QueryKey`, path without `/api`, arrays — `paramsSerializer: { indexes: null, }`.
- The first element of a query key is the enum value; tables — `placeholderData: (prev) => prev`, dictionaries — `staleTime` 5 min + `enabled`.
- A mutation invalidates **all** lists that show the entity (see the map in skill `frontend-api-resource`); messages come from i18n.
- Errors — only `getErrorMessage(error)`; 401 is handled by the interceptor.
- Server data never goes into Redux.
- `Permission` changes in sync with the backend (enum + migration there, `permission.ts` + `permissions.config.ts` + `permissions.json` here).
