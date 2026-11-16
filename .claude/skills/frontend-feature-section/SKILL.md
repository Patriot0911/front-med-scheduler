---
name: frontend-feature-section
description: Як додати новий розділ / сторінку дашборду front-med-scheduler від маршруту до таблиці — серверна page.tsx + Suspense + клієнтська *Section з перевіркою доступу, пункт сайдбару з isVisible, тулбар з пошуком і фільтрами, таблиця з пагінацією, стан у URL, модалки створення / редагування, порожні стани, а також новий довідник через dictionaries.config і новий погляд занять через LESSONS_VIEWS. Використовуй, коли створюєш нову сторінку, розділ, вкладку, таблицю-список чи CRUD-екран.
---

# Новий розділ дашборду

Спершу визнач доступ (`frontend-domain`) і контракт API (`frontend-api-resource`). Потім — чи це не випадок «розширення конфігом» (розділ 5): новий довідник або новий погляд занять не потребують нової сторінки.

## 1. Маршрут і сторінка

```
src/app/(platform)/dashboard/<name>/page.tsx     # серверний компонент
src/components/<domain>/<Name>Section/           # клієнтська секція
```

```tsx
// page.tsx — лише компонує
const UsersPage = async () => {
  const t = await getServerTranslation('layout');
  return (
    <>
      <Heading level={1}>{t('pages.users')}</Heading>
      <Suspense fallback={<Loading />}>
        <UsersSection />
      </Suspense>
    </>
  );
};
```

- `RequireAuth` уже стоїть у `(platform)/layout.tsx` — не повторюй.
- `Suspense` обов'язковий, якщо всередині є `useSearchParams`.
- Публічна сторінка (без токена) — `app/(public)/`, без сайдбару; дані лише з ендпоінтів 🔓.
- Заголовок сторінки — ключ `layout:pages.<name>`.

## 2. Сайдбар

Пункт у потрібній групі `SIDEBAR_GROUPS` (`configs/sidebar.config.ts`): `href`, `label` (ключ `layout`), `icon`, `isVisible`.
- Адмінський розділ: `isVisible: ({ hasAny, }) => hasAny(X_READ_PERMISSIONS)` — **той самий** набір, що в секції.
- Розділ за профілем: `isVisible: ({ user, }) => !!user?.teacher`.
- Порядок у масиві = порядок у навбарі. Schedule — календарі занять, Administration — адмінка.

## 3. Секція

```tsx
'use client';
const READ_PERMISSIONS = [Permission.READ_USERS, Permission.MANAGE_USERS, Permission.ADMIN];
const MANAGE_PERMISSIONS = [Permission.MANAGE_USERS, Permission.ADMIN];

const UsersSection = () => {
  const { t, } = useTranslation('users');
  const { hasAny, isReady, } = usePermissions();
  const [form, setForm] = useState<{ isOpen: boolean; item: IUser | null }>({ isOpen: false, item: null, });

  if (!isReady) return <Loading />;
  if (!hasAny(READ_PERMISSIONS)) return <p className={styles.empty}>{t('noAccess')}</p>;

  const canManage = hasAny(MANAGE_PERMISSIONS);
  return (
    <section className={styles.section}>
      <p className={styles.description}>{t('description')}</p>
      <UsersToolbar ... canManage={canManage} onCreate={() => setForm({ isOpen: true, item: null, })} />
      <UsersTable ... onEdit={(item) => setForm({ isOpen: true, item, })} />
      <UserFormModal isOpen={form.isOpen} item={form.item} onClose={() => setForm((prev) => ({ ...prev, isOpen: false, }))} />
    </section>
  );
};
```

Порядок: очікування `isReady` → заглушка доступу → опис розділу → тулбар → вміст → модалки. Секція перевіряє доступ сама, навіть якщо пункт сайдбару вже прихований.

## 4. Тулбар, таблиця, стан

| Елемент | Правило |
|---|---|
| Пошук | локальний стан → `useDebouncedValue` → у запит; зміна пошуку / фільтрів скидає сторінку на 1 |
| Фільтри | кнопка «Filters» з лічильником → `SideModal` з формою-чернеткою, що монтується при відкритті; застосовує лише «Apply» |
| Стан, яким діляться | у URL: `useTabParam(keys, param)` для вкладок / режимів, `useCalendarSearchParams` для дати й виду; імена параметрів = імена в API; `router.replace(..., { scroll: false })` |
| Таблиця | `Table` з `columns` (фабрика від `t`), `rowKey`, `pageSize` + `pagination`, `rowLock` з `canManage`, `actions` (іконка олівця — редагувати, кошик — видалити з `ConfirmModal`) |
| Скидання сторінки без ефекту | `{ key, page }` у стані, де `key` — серіалізовані параметри запиту |
| Порожньо / завантаження / помилка | `emptyText` з i18n, скелетон таблиці, текст помилки — не порожня таблиця |
| Кнопка створення | лише з `canManage` |

Колонки таблиці — фабрика `create<X>Columns(t)` або `useMemo` в компоненті, не модульна константа з текстами.

## 5. Розширення конфігом замість нової сторінки

**Новий довідник** (`/dashboard/dictionaries`, вкладка):
1. `interfaces/dictionaries/<x>.ts` — `I<X>`, `I<X>Payload`, `I<X>Response`.
2. `lib/services/<x>.service.ts` + `<X>QueryKey`.
3. `components/dictionaries/forms/<X>FormModal/` — `index.tsx` + `<x>.scheme.ts`, оболонка `DictionaryModal`, пропси `IDictionaryFormModalProps<I<X>>`.
4. `defineDictionary<I<X>>({ icon, queryKey, pageSize, readPermissions, managePermissions, fetchList, remove, getItemLabel, FormModal, columns, relatedQueryKeys, rowActions?, rowLock? })` у `dictionariesConfig` (порядок ключів = порядок вкладок).
5. Тексти `<key>.title / description / add / edit / delete / empty / confirmDelete / created / updated / deleted / form.*` в обох `dictionaries.json`.
6. `readPermissions` додати в `DICTIONARIES_READ_PERMISSIONS` у `sidebar.config.ts`.

**Новий погляд занять:** запис у `LESSONS_VIEWS` (`source`, `scope`, `filters`, `canCreate`) + сторінка з `<LessonsBrowser view="..." />` + пункт сайдбару. Новий фільтр: поле в `ILessonsFilters` (= query-параметр API) → `EMPTY_LESSONS_FILTERS` → `lessons:filters.<key>.*` в обох мовах → довідник у `useLessonsFilterOptions` → ключ у поглядах.

## 6. Після реалізації

- Онови CLAUDE.md: маршрут у «Структура», нову поведінку в «Потік даних», незавершене — у «Поточний стан і пастки».
- `npx tsc --noEmit` і `npm run lint`.
- Перевір розділ під трьома ролями: без доступу (заглушка, пункт прихований), лише читання (без кнопок дій, `rowLock`), керування.

## 7. Чекліст

- [ ] `page.tsx` серверна, `Suspense` навколо секції з `useSearchParams`.
- [ ] Пункт сайдбару з тим самим набором дозволів / предикатом профілю, що й секція.
- [ ] Секція: `isReady` → `noAccess` → вміст; дозволи + `ADMIN`.
- [ ] Стан, яким діляться, — в URL з іменами API.
- [ ] Таблиця: `rowLock`, пагінація, скидання сторінки, порожній стан.
- [ ] Модалки за `frontend-modals`, форми за `frontend-forms`.
- [ ] Тексти в обох мовах, включно з описом розділу.
