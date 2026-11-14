# front-med-scheduler

Веб-клієнт розкладу занять медичного університету: календар занять, публічний розклад, керування користувачами та довідниками.
API — сусідній репозиторій `../api-med-scheduler`. Доменна модель і правила доступу описані в `../api-med-scheduler/docs/domain.md`.

## Git

- **Не комітити й не пушити без прямого прохання.** Зміни лишаються в робочому дереві, доки користувач сам не попросить коміт. Дозвіл на один коміт не поширюється на наступні.

## Стек

Next.js 16 (App Router) · React 19 · TypeScript (strict) · TanStack Query 5 · Redux Toolkit (лише стан автентифікації) · axios · react-hook-form + zod · SCSS-модулі + CSS-токени · Tailwind 4 (лише утиліти) · framer-motion · react-big-calendar · dayjs · react-hot-toast · react-icons.

## Команди

```bash
npm run start:dev   # next dev (README зі згадкою `npm run dev` застарів)
npm run build
npm run start
npm run lint        # eslint (next core-web-vitals + typescript)
```

- `.env`: `NEXT_PUBLIC_API_URL=http://localhost:3001/api` (з суфіксом `/api`; шляхи в сервісах його не містять).
- Тестів немає.

## Структура

```
src/
  app/
    layout.tsx                 # шрифти, Providers, Toaster, global.scss
    providers.tsx              # StoreProvider → QueryClientProvider → AuthProvider
    (public)/page.tsx          # Welcome (/): відкрита всім, кнопка входу або «Open dashboard»
    (public)/schedule/         # публічний календар без сайдбару
    (platform)/layout.tsx      # RequireAuth + BaseLayout (сайдбар) для всього дашборду
    (platform)/dashboard/      # /dashboard (Overview), /study, /teaching, /lessons (усі), /admin/lessons, /users, /dictionaries
  components/
    ui/                        # дизайн-система: Button, Input, Textarea, Form*, Select, MultiSelect, Modal, SideModal, Table, Tabs, Calendar, DatePicker, TimePicker, DateTimeField, ...
    layout/                    # BaseLayout, Sidebar (+ components/), Header, Footer
    auth/                      # AuthModal, ProfileModal, LogOutModal, RequireAuth, RequirePermission
    welcome/                   # WelcomeHero
    dictionaries/              # DictionarySection, таблиця, тулбар, cells/, forms/<X>FormModal
    users/                     # UsersSection, UsersTable, UsersToolbar, cells/, forms/UserFormModal
    lessons/                   # *LessonsSection → LessonsBrowser (тулбар + QuerySyncedCalendar → LessonsSection → LessonsCalendar), LessonDetailsModal
    schedule/                  # компоненти сторінки /schedule
    modals/                    # загальні модалки: ConfirmModal, DictionaryModal
    providers/                 # StoreProvider, AuthProvider
  hooks/
    queries/<domain>/use<X>Query.ts
    mutations/<domain>/use<X>Mutation.ts
    redux/                     # типізовані useAppDispatch/useAppSelector + селектори
    shared/                    # useDebouncedValue, useMediaQuery, useOnClickOutside, usePersistentState, useTabParam
    calendar/, forms/, layout/ (useSidebarState, useNavbarGroups)
  interfaces/<domain>/         # УСІ типи й пропси (не поруч з компонентом); ui/*.d.ts — пропси ui-компонентів
  configs/                     # декларативні конфіги: dictionaries.config.tsx, sidebar, permissions, *.dictionary.ts (тексти кнопок)
  lib/
    axios.ts                   # apiClient з інтерцепторами
    services/<x>.service.ts    # один клас на ресурс API
    query-client.ts, cn.ts, dayjs.ts, errors.ts, loading-mappers.ts, password.ts
  store/                       # makeStore, storeRef (доступ до стору поза React), slices/authSlice
  styles/                      # abstracts (токени, міксини, брейкпоінти), base, vendors
  fonts/                       # next/font: geist, jost, oswald
```

## Потік даних

### HTTP і автентифікація

- `apiClient` (`lib/axios.ts`):
  - додає `Authorization: Bearer <access>` з пам'яті (`AuthService.getToken()`);
  - на 401 один раз робить refresh (паралельні запити чекають у черзі), а при невдачі диспатчить `logout()`;
  - **розгортає обгортку API**: сервіси одразу повертають `data` з `{ status, data }`, тож `apiClient.get<...>()` віддає payload, а не `AxiosResponse`;
  - помилки reject-ить як `{ status: false, message }`, де `message` — рядок або масив. Текст для користувача отримуй лише через `getErrorMessage(error)` з `lib/errors.ts`.
- Токени: access — у статичному полі `AuthService` + `localStorage.access_token`, refresh — у `localStorage.refresh_token`.
- Redux зберігає лише `auth.status`: `'init' | 'guest' | 'authenticated'`. `AuthProvider` на старті викликає `initAuth()`. Дані користувача **не** в Redux, а в query `[AuthQueryKey.Me]` (`useMeQuery`). Логін кладе `user` прямо в кеш через `setQueryData`.
- Не додавай нових slice-ів для серверних даних — це завжди TanStack Query.

### Сервіси (`lib/services/*.service.ts`)

```ts
export enum DepartmentsQueryKey {
  DepartmentsList = 'departmentsList',
};

class DepartmentsService {
  static async getDepartments(params: IFilterParams = { page: 1, pageSize: 20 }): Promise<IDepartmentResponse> {
    return apiClient.get('/departments', { params, });
  }
  ...
}

export default DepartmentsService;
```

- Клас зі статичними методами, default export; поруч експортується enum `<X>QueryKey`.
- Типи payload / response — з `interfaces/<domain>/`. Списки: `IGenericListResponse<T>` = `{ items, meta: { count } }`.
- Масиви в query — `paramsSerializer: { indexes: null }` (`roleIds=a&roleIds=b`), див. `users.service.ts`.
- `/dictionaries/*` (легкі списки `{ id, name }` для селектів і підписів id → назва) — у `DictionariesService` з окремим enum `DictionaryQueryKey`.

### Query / mutation хуки

- Один хук — один файл, default export: `hooks/queries/<domain>/use<X>Query.ts`.
- Ключ: `[<X>QueryKey.Y, ...параметри]`. Інвалідація йде за першим елементом (`invalidateQueries({ queryKey: [key] })`).
- Таблиці: `placeholderData: (prev) => prev`, `staleTime: 30s`; довідники: `staleTime: 5 хв`, параметр `enabled` для ледачого завантаження.
- Мутації довідників і користувачів — через `useDictionaryMutation({ mutationFn, invalidateKeys, successMessage, onSuccess })`: інвалідація + toast успіху / помилки. Після змін інвалідуй і список таблиці, і відповідний `DictionaryQueryKey`.

### Дозволи на клієнті

- `usePermissions().hasAny([...])` — **OR**, як і на бекенді. Перевіряй тим самим набором дозволів, що в `@Permissions(...)` ендпоінту, **плюс** `Permission.ADMIN`: на бекенді admin проходить guard автоматично, а `hasAny` такого байпасу не має.
- Чи можна редагувати конкретного користувача або роль, визначає не дозвіл, а ієрархія ролей на бекенді. Для цього використовуй прапорець `canManage` з відповіді `/users` і `/roles`. Недоступні рядки не ховаються: `Table` приймає `rowLock` (`isLocked` + `reason`), показує замочок із підказкою, вимикає дії й клік по рядку. У довідниках це поле `rowLock` у конфігу (див. roles).
- `Permission` enum — дзеркало бекенду (`interfaces/auth/permission.ts`); підписи — `configs/permissions.config.ts`. Новий дозвіл додається в обидва файли (і на бекенді, див. `api-med-scheduler/CLAUDE.md`).
- Секції самі показують заглушку «You don't have access…», якщо `!hasAny(READ_PERMISSIONS)` (див. `UsersSection`, `DictionarySection`).
- `RequireAuth` стоїть один раз у `(platform)/layout.tsx` і закриває весь `/dashboard/*`: гостя перекидає на `/` (Welcome). У сторінках дашборду його не повторюй. Welcome і `/schedule` guard-ом не закриті. `RequirePermission` перевіряє через `every` (AND), на відміну від `hasAny`.
- Нова сторінка дашборду: `app/(platform)/dashboard/<name>/page.tsx` + пункт у потрібній групі `SIDEBAR_GROUPS` (`configs/sidebar.config.ts`) з `href: '/dashboard/<name>'`.
- Після успішного входу `AuthModal` викликає `onAuthenticated` (коли спливає таймер 1500ms). Welcome передає туди перехід на `/dashboard`.

### Сайдбар і розділи занять

- `SIDEBAR_GROUPS` — групи за змістом з підписом-заголовком; порядок у масиві = порядок у навбарі. **Schedule** — усі календарі занять (Studying, Teaching, All lessons); **Administration** — адмінські розділи. Окремі групи Study / Teaching — для майбутніх не-календарних розділів студента / викладача.
- Видимість пункту — предикат `isVisible({ user, hasAny })`, а не масив дозволів: розділи занять залежать від **профілю** (`user.student` / `user.teacher`), бо в домені викладачів `Permission` нічого не вирішує. Адмінські пункти — через `hasAny` з тими ж наборами, що й у секціях. `useNavbarGroups` фільтрує пункти й прибирає порожні групи.
- Розділи занять:

  | Маршрут | Хто бачить | Дані (після інтеграції) |
  |---|---|---|
  | `/dashboard/study` | є `student` | `/lessons/my?scope=studying` |
  | `/dashboard/teaching` | є `teacher` | `?tab=teaching` → `scope=teaching`; `?tab=department` (лише завідувач, `headOfDepartmentId`) → `scope=department` |
  | `/dashboard/lessons` | усі | `/lessons/list` |
  | `/dashboard/admin/lessons` | `read_lessons` / `manage_lessons` / `admin` | `/admin/lessons`: усі заняття без обмежень видимості й доступу; редагування — лише з `manage_lessons` / `admin` |

  Секції ще раз перевіряють профіль і показують заглушку: прихований пункт навбару не закриває маршрут.

### Фільтри занять

- Кожен розділ рендерить `LessonsBrowser view={...}` (`study` | `teaching` | `department` | `all` | `admin`). Набір фільтрів погляду — `LESSONS_VIEWS` у `configs/lessons-views.config.ts`; підписи мультиселектів — `LESSONS_LIST_FILTERS`. Новий фільтр: поле в `ILessonsFilters` (= ім'я query-параметра бекенду) → `EMPTY_LESSONS_FILTERS` / `LESSONS_LIST_FILTERS` → довідник у `useLessonsFilterOptions` → ключ у потрібних поглядах.
- Стан — у URL через `useLessonsFiltersParams(keys)`: `?search=` і повторювані ключі масивів (`teacherIds=a&teacherIds=b`), ті самі імена, що й у API. Хук читає й пише лише ключі свого погляду.
- `LessonsToolbar`: пошук (debounce → URL) і кнопка «Filters» з лічильником, що відкриває `LessonsFiltersModal` (`SideModal`, щоб календар не зсувався, а випадні списки не обрізались). Чернетка живе в `LessonsFiltersForm`, яка монтується лише при відкритій модалці, тож кожне відкриття починається із застосованих фільтрів; застосовує лише «Apply filters». Довідники вантажаться лише при відкритій модалці й лише для фільтрів погляду.
- `/dictionaries/*`, з яких беруться опції, доступні будь-якому токену (зокрема `departments`), тож фільтри працюють і для студентів.

### Створення занять

- Погляди з `canCreate` у `LESSONS_VIEWS` (зараз `teaching`, `department`): кнопка «Add lesson» у тулбарі (`nextHourLessonDraft`) і клік / виділення слоту календаря (`slotToLessonDraft`: день у місячному виді → 9:00, одиночний клік → `DEFAULT_LESSON_DURATION`, протягнутий діапазон → його тривалість).
- `LessonFormModal` — центрована `Modal size="lg"`; `LessonForm` монтується лише при відкритті, тож стартує з чернетки без `reset`-ефектів. Схема — фабрика `createLessonSchema({ teacherId, headsOwnDepartment })`, бо правило «кафедри — лише кафедри обраних викладачів» (так само перевіряє бекенд) залежить від довідника викладачів. Автор завжди серед викладачів: поле блокує його через `lockedValues` («(you)», зняти не можна).
- Кафедри заняття — мультиселектор `departmentIds` (0..N): опції — кафедри обраних викладачів; у вкладці Department за замовчуванням вибрана своя. Модель заняття: `departmentIds` + `departments` (`{ id, name }[]`).
- Група занять заняттю **не обов'язкова** (`lessonGroupId` / `lessonGroupName` можуть бути `null`); наявну групу в модалці не вибирають — нова група створюється лише разом із серією (нижче). Бекенд для цього вже має `GET /lessons-groups/usable` (групи, куди викладач може класти заняття).
- `useCreateLessonMutation` інвалідовує всі `LessonsQueryKey` і адмінський список груп.
- **Група занять і повтори** («Add to a lesson group» під нотаткою → `RecurrenceSection`, відділена лінією й заголовком). Група: **New group** (назва; іде в `POST /lessons-groups/with-lessons` разом із заняттями) або **Existing group** — одна з моїх груп (`GET /lessons-groups/my`, автор — я; заняття йдуть у `POST /lessons-groups/:id/lessons`; бекенд додатково перевіряє `canUseGroup`). Repeats: `none` (лише це заняття — група для занять, які додаватимуться пізніше), `daily` / `weekly` / `biweekly` по днях тижня до «Until», або `custom` (перше заняття + вибрані дні). Дати будує `buildSeriesDates` (`lib/lesson-recurrence.ts`): у локальному часі, час кожного заняття — з «Starts at», один на день, сортовані; ≤ `MAX_SERIES_LESSONS` (200). Ті самі дати йдуть у перегляд у `MultiMonthCalendar` (два місяці поруч; у `custom` дні вибираються кліком, перше заняття заблоковане, дні до нього недоступні), кнопку «Create N lessons» і запит, тож створюється рівно те, що видно.

### Календар / список (адмінка)

- `/dashboard/admin/lessons`: `?mode=calendar|list` (`LessonsModeSwitch`, `useTabParam(MODES, 'mode')`). Пошук і фільтри в URL спільні для обох режимів.
- Список має вкладки `?tab=lessons|lesson-groups`: `LessonsBrowser mode="list"` (тулбар + `LessonsTable` з пагінацією, за замовчуванням лише майбутні — `dateFrom` = сьогодні, перемикач «Include past lessons») і `AdminLessonGroupsList` (пошук + `LessonGroupsTable` з `/admin/lessons-groups`).
- Сторінка списку скидається на першу при зміні запиту без ефекту: `{ key, page }` у стані, де `key` — серіалізовані параметри.
- `useTabParam(keys, param = 'tab')` — для будь-якого параметра-перемикача в URL.

### Дані календаря

- `QuerySyncedCalendar view={...} filters search` — контейнер даних: дата й вид з URL (`useCalendarSearchParams`) → `getCalendarRange` (видимі дні; у місяці — разом із крайніми тижнями сусідніх місяців) → `useLessonsQuery(view, params)` → `lessonToCalendarEvent`. Без `page` API віддає весь діапазон.
- Джерело — `source` / `scope` погляду в `LESSONS_VIEWS`: `list` → `/lessons/list` (працює й без токена, ним користується `/schedule`), `my` → `/lessons/my?scope=`, `admin` → `/admin/lessons`. Ключі запитів — `LessonsQueryKey.List | My | Admin`; мутації занять мають інвалідовувати всі три.
- Заняття стоїть у календарі на **фактичній** даті `delayedDate ?? date` (`getLessonStart`); бекенд фільтрує й сортує за нею ж. Назви викладачів, груп, курсу й кафедри приходять у самому занятті (`teachers`, `studentGroups`, `lessonGroupName`, `departmentName`), довідники для показу не потрібні.

### Стан у URL

Стан, яким можна поділитися чи який має пережити перезавантаження, живе в query-параметрах: `useCalendarSearchParams` (`?date=YYYY-MM-DD&view=day|week|month`), `useTabParam(availableKeys)` (`?tab=`, недоступне значення → перша вкладка). Оновлення — `router.replace(..., { scroll: false })`. Компоненти з `useSearchParams` сторінка обгортає в `<Suspense fallback={<Loading />}>`.

## Довідники — розширюються конфігом

Сторінка `/dictionaries` повністю керується `configs/dictionaries.config.tsx` (`IDictionaryConfig<T>`): назва, іконка, дозволи на читання / керування, колонки, `fetchList`, `remove`, `FormModal`, `rowActions`, `relatedQueryKeys`. Порядок ключів об'єкта = порядок вкладок.

Новий довідник:
1. `interfaces/dictionaries/<x>.ts` — `I<X>`, `I<X>Payload`, `I<X>Response`.
2. `lib/services/<x>.service.ts` + `<X>QueryKey`.
3. `components/dictionaries/forms/<X>FormModal/` — `index.tsx` + `<x>.scheme.ts`; оболонка — `DictionaryModal`, пропси — `IDictionaryFormModalProps<I<X>>` (`item: null` = створення).
4. Запис `defineDictionary<I<X>>({...})` у `dictionariesConfig`.
5. Кастомні клітинки — `components/dictionaries/cells/`.

## Форми

- `react-hook-form` + `zodResolver`; схема — `<name>.scheme.ts` поруч з модалкою, тип `T<Name>Form = z.infer<typeof schema>`; `mode: 'onTouched'`.
- Кожне поле — базовий компонент (`Input`, `Textarea`, `Select`, …) + тонка `Form*`-обгортка через `useFormInputProps` / `useController`; пропси обох — в `interfaces/ui/*.d.ts`. `Textarea` має `maxRows` (росте з вмістом до N рядків). `MultiSelect` має `lockedValues` — завжди вибрані значення, які не можна зняти чи очистити. Дата / дата й час — `FormDateTimeField` (значення — `Date`; `withTime` додає колонку годин і хвилин біля календаря `DatePicker`). Панель `DateTimeField` рендериться порталом з `position: fixed` і відкривається вгору, коли внизу мало місця, тож модалки її не обрізають; Escape закриває панель, а не модалку. Нативні `type="date" / "time"` у нових формах не використовуй. Сітка днів місяця — `MonthGrid` (`lib/calendar-grid.ts`), спільна для `DatePicker` і `MultiMonthCalendar`. У `MultiMonthCalendar` вибрані дні підряд показуються діапазоном (`joinSelectedDays`; сусідами вважаються календарні дні, тож діапазон тягнеться через межу тижня й місяця: суцільні крайні дні, між ними нижча світла смуга; це лише вигляд — кожен день вибраний окремо; смуга й край — псевдоелементи `::before` / `::after`, бо фон самої кнопки лягав би під смугу), а сітка доповнюється днями сусідніх місяців на суцільному світлому фоні (`shadeOutsideDays`), крім тих місяців, що вже показані в іншій половині (`isOutsideDayHidden`): розворот A | B доповнюється A−1 зліва і B+1 справа.
- Поля — лише `Form*`-обгортки з `components/ui` (`FormInput`, `FormSelect`, `FormMultiSelect`, `FormSwitch`, `FormCheckboxGroup`, `FormTextarea`, `FormPasswordInput`). Вони беруть контекст форми через `useFormInputProps` і показують помилки за спільними правилами. Generic поля: `<FormInput<TForm> name="..." />`.
- `toFormValues(item)` мапить сутність у значення форми; при відкритті модалки викликається `methods.reset(toFormValues(item))` + `mutation.reset()`.
- Порожній селект — `''`, у payload перетворюється на `null` / пропуск.
- Щільні форми (форма заняття): `hideErrorMessage` на **всіх** полях, щоб вони однаково не займали місця під текст помилки; поле з помилкою лише червоніє, а `handleSubmit(onValid, onInvalid)` показує першу помилку toast-ом (див. `LessonForm`).

## Модалки

Окремий skill: [.claude/skills/frontend-modals/SKILL.md](.claude/skills/frontend-modals/SKILL.md). Коротко: лише базові `ui/Modal` (центрована, `size` sm / md / lg) або `ui/SideModal` (бічна панель справа на всю висоту, `size` sm / md / lg / xl — для фільтрів і форм із багатьма селектами) з композицією `FormBody → Header → Content → Footer`, пропси `extends IModalBaseProps`, відкритість контролює батько. Щоб під час анімації закриття модалка не втрачала вміст, `item` зберігай у стані і після закриття (`{ isOpen, item }` у `UsersSection`).

## Компоненти та код-стиль

- Папка на компонент: `Name/index.tsx` + `styles.module.scss`; підкомпоненти — у `Name/components/` або сусідніх папках (`cells/`, `forms/`).
- Компонент — стрілкова функція, `const X = (...) => {}` + `export default X`. `'use client'` — у кожному компоненті з хуками / подіями. Сторінки в `app/` лишаються серверними і лише компонують клієнтські секції.
- Типи: інтерфейси з префіксом `I`, типи-аліаси з `T`, enum-и в PascalCase. Пропси лежать в `interfaces/<domain>/`, а не в файлі компонента. Імпорт типів — `import type`.
- Імпорти через `@/`; стилі імпортуються останніми: `import styles from './styles.module.scss'`.
- Кома після останнього елемента навіть в однорядкових об'єктах: `{ page, pageSize, }`, `const { data, } = ...`.
- Константи модуля — `UPPER_SNAKE_CASE` угорі файлу (`READ_PERMISSIONS`, `PAGE_SIZE`).
- **Коментарі — лише ситуативно.** Елементарний код (прості компоненти, пропси, обробники, стилі, конфіги, очевидні умови) не коментуємо взагалі, навіть JSDoc. Коментар доречний тільки як опис справді складного компонента чи логіки, яку без нього не зрозуміти. Не коментуй те, що видно з назв. Наявні в коді рясні коментарі — не зразок для нового коду.
- Тексти UI — англійською. Тексти кнопок, що залежать від стану мутації, — у `configs/<domain>.dictionary.ts` як `Record<LoadingState, string>`. Назви `LoadingState.Ide` / `Pendding` — історичні опечатки, не перейменовуй точково.
- Класи: `cn(...)` (clsx + tailwind-merge).
- Дати — `dayjs` з `@/lib/dayjs` (локаль `en-gb`, тиждень з понеділка). Частина файлів імпортує `'dayjs'` напряму — у новому коді бери `@/lib/dayjs`.

## Стилі

- SCSS-модулі на CSS-змінних із `styles/abstracts`: `--color-*` (primary, secondary, accent, neutral, error / success…), `--radius-*`, `--shadow-*`, `--text-*`, `--font-weight-*`. Хардкод кольорів не допускається.
- Адаптивність mobile-first: `@use '<відносний шлях>/styles/abstracts/mixins' as *;` → `@include mq('md') { ... }`. Брейкпоінти: sm 576, md 768, lg 992, xl 1200 (у JS — `configs/breakpoints.config.ts`, `useMediaQuery`).
- Імена класів — kebab-case, звертання `styles['nav-container']`.
- Tailwind підключений, але використовується лише для дрібних утиліт (`flex-1`). Верстку пиши в SCSS.
- Скролбар один на весь застосунок — `styles/base/_scrollbar.scss` (6px, прозора доріжка, сірий повзунок; `::-webkit-scrollbar` для Chromium / Safari, `scrollbar-width` / `-color` лише там, де webkit-варіанта немає). Локально `scrollbar-width` не задавай: у Chromium він вимикає глобальний вигляд. Виняток — `none`, щоб сховати скролбар (тоді ще `&::-webkit-scrollbar { display: none; }` для Safari, див. `Tabs`).
- Глобальні стилі сторонніх бібліотек — `styles/vendors/` (наприклад, `_calendar.scss` для react-big-calendar), а не `:global` у модулях.

## Поточний стан і пастки

- Редагування й видалення занять ще не підключені (`ILesson.canEdit` уже приходить з API).
- Welcome і Overview (`/dashboard`) поки без контенту.
- `RequireAuth` рендерить children завжди і лише накриває їх оверлеєм, тож сторінки дашборду монтуються і для гостя на мить до редіректу.
- `Button` приймає проп `size`, але стилів розмірів для нього немає: проп нічого не змінює.
- `Input` показує текст помилки під полем лише з `hideHintOnError` (умова `showError && !isHintHidden`); за замовчуванням видно тільки червону рамку й підпис. `Textarea` і `Select` текст помилки показують.
- Docker-образ запускає `.next/standalone/server.js` (`output: 'standalone'` у `next.config.ts`). `NEXT_PUBLIC_API_URL` вшивається під час `next build`, тож його треба передавати на етапі збірки образу, а не запуску.
- `queryClient`: глобальний `onError` нічого не показує (toast закоментовано). Помилки показують мутації самі.
