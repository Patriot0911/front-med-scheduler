---
name: frontend-api-resource
description: Як підключити ресурс API у front-med-scheduler від контракту бекенду до хуків — типи в interfaces/ з DTO та моделей NestJS, клас-сервіс з enum QueryKey, query-хуки (ключі, staleTime, placeholderData), мутації з картою інвалідації й toast, серіалізація масивів, обробка помилок, синхронізація Permission. Використовуй, коли додаєш або змінюєш ендпоінт, сервіс, query / mutation хук, тип відповіді, або коли бекенд змінив DTO і треба звірити фронт.
---

# Ресурс API: контракт → сервіс → хуки

## 0. Спершу контракт бекенду

У `../api-med-scheduler/src/modules/<name>/`:
- `controllers/*.controller.ts` — метод, шлях, `@Permissions(...)` / `@LessonActor()`, query-параметри;
- `dto/*-request.dto.ts` — тіло й фільтри (поля, опційність, обмеження class-validator → їх же віддзеркалює zod);
- `models/*.model.ts` — відповідь (`I<Entity>ItemModel`, `ListItemModel`, `DictionaryItem`);
- `mappers/*.mapper.ts` — які поля реально потрапляють у відповідь.

Шлях у сервісі фронту — **без** `/api` (він у `NEXT_PUBLIC_API_URL`). Відповідь бекенду обгорнута в `{ status, data }`; `apiClient` її розгортає, тож сервіс повертає `data`.

Якщо змінюєш контракт — спершу бекенд, потім фронт, і обидва в одній задачі (CLAUDE.md кореня).

## 1. Типи — `interfaces/<domain>/<resource>.ts`

```ts
import type { IGenericListResponse } from '../shared/generic-response';

export interface IDepartment {          // = I<Entity>ItemModel / ListItemModel
  id: string;
  name: string;
  headTeacherId: string | null;         // nullable з моделі → `| null`, не `?`
};

export interface IDepartmentPayload {   // = Create/Edit DTO
  name: string;
};

export type IDepartmentResponse = IGenericListResponse<IDepartment>;   // { items, meta: { count } }
```

- Імена полів — **точно як у моделі бекенду** (`teacherIds`, а не `teachers_ids`); фільтри — як query-параметри API, бо їх же беруть URL-стан і `ILessonsFilters`.
- Enum-и бекенду дзеркалити enum-ом зі значеннями-рядками (`LessonVisibility`).
- Прапорці рішень з відповіді (`canEdit`, `canManage`) обов'язково в типі — UI спирається на них (`frontend-domain`).
- Довідникові елементи — `{ id, name }` (`ILessonRef` / dictionary-items).

## 2. Сервіс — `lib/services/<resource>.service.ts`

```ts
export enum DepartmentsQueryKey {
  DepartmentsList = 'departmentsList',
};

class DepartmentsService {
  static async getDepartments(params: IFilterParams = { page: 1, pageSize: 20 }): Promise<IDepartmentResponse> {
    return apiClient.get('/departments', { params, });
  }

  static async createDepartment(payload: IDepartmentPayload): Promise<IDepartment> {
    return apiClient.post('/departments', payload);
  }
}

export default DepartmentsService;
```

- Один клас на ресурс, статичні методи, default export; enum ключів поруч. Значення ключів глобально унікальні.
- Масиви в query — `paramsSerializer: { indexes: null, }` (`roleIds=a&roleIds=b`).
- Порожні фільтри не надсилати: `...(search ? { search, } : {})`.
- `/dictionaries/*` — лише в `DictionariesService` з `DictionaryQueryKey`.
- Варіанти одного ресурсу в різних доменах (`/lessons` vs `/admin/lessons`) — окремі методи (`editLesson` / `editAdminLesson`), вибір — у хуку за `source`.
- JSDoc лише там, де поведінка неочевидна (`setDepartmentTeachers` замінює весь склад).

## 3. Query-хук — `hooks/queries/<domain>/use<X>Query.ts`

| Тип даних | Налаштування |
|---|---|
| Таблиця / список з пагінацією | ключ `[Key.List, page, search, filters]`, `placeholderData: (prev) => prev`, `staleTime: 30 * 1000` |
| Довідник для селектів | ключ `[DictionaryQueryKey.X]`, `staleTime: 5 * 60 * 1000`, параметр `enabled` (вантажити лише при відкритій модалці / фільтрах) |
| Календар | діапазон дат у ключі, без `page` — API віддає весь діапазон |
| Профіль | `[AuthQueryKey.Me]`; логін кладе дані через `setQueryData` |

Перший елемент ключа — завжди значення enum: за ним іде інвалідація.

## 4. Мутації — `hooks/mutations/<domain>/use<X>Mutation.ts`

Стандарт — `useDictionaryMutation({ mutationFn, invalidateKeys, successMessage, onSuccess })` (назва історична: це загальна мутація «інвалідація + toast», вживається й для занять). Повідомлення — з i18n (`t('form.saved')`).

**Карта інвалідації** — найчастіше джерело багів «не оновилось». Перед написанням мутації випиши, **хто показує** змінену сутність:

| Змінено | Інвалідувати |
|---|---|
| заняття | `LessonsQueryKey.List`, `.My`, `.Admin` (+ `LessonGroupsQueryKey.AdminList`, якщо змінюється кількість / період групи) |
| група занять | `LESSON_GROUPS_INVALIDATE_KEYS` |
| елемент довідника | список таблиці **і** відповідний `DictionaryQueryKey` (+ `relatedQueryKeys` конфігу: кафедра → `Teachers`) |
| користувач | `UsersList` (+ `Teachers`, якщо змінився профіль викладача) |

Якщо набір повторюється у 2+ мутаціях — виносиш у константу поруч (`lesson-groups-invalidate-keys.ts`).

## 5. Помилки

- API reject-ить `{ status: false, message: string | string[] }`. Текст — лише `getErrorMessage(error)`; тексти бекенду англійською й не перекладаються.
- Глобальний `onError` у `queryClient` нічого не показує: toast помилки дає сама мутація. Для query-помилок — стан у компоненті (порожній стан / заглушка).
- 401 обробляє інтерцептор (refresh). Не перехоплюй його в компонентах.
- 403 / 404 від доменних правил — показуй як є; 404 для занять означає «приховано» (`frontend-domain`).

## 6. Новий дозвіл

Бекенд `src/shared/models/permission.enum.ts` + міграція → фронт `interfaces/auth/permission.ts` (значення ідентичні) → підпис у `configs/permissions.config.ts` → тексти в обох `permissions.json`. Дозволи з'являються лише з потреби домену, не під кнопку.

## 7. Чекліст

- [ ] Поля типів звірено з моделлю / мапером бекенду, nullable позначено `| null`.
- [ ] Сервіс без `/api`, масиви з `indexes: null`, порожні фільтри не йдуть.
- [ ] Ключ починається з enum; таблиця — `placeholderData`, довідник — `staleTime` 5 хв + `enabled`.
- [ ] Карта інвалідації охоплює всі місця, що показують сутність.
- [ ] Помилки — через `getErrorMessage`, успіх — toast з i18n.
- [ ] `npx tsc --noEmit` чистий.
