# front-med-scheduler

Веб-клієнт розкладу занять медичного університету: календар занять, публічний розклад, керування користувачами та довідниками.
API — сусідній репозиторій `../api-med-scheduler`. Доменна модель і правила доступу описані в `../api-med-scheduler/docs/domain.md`.

## Git

- **ШІ ніколи не комітить і не пушить** — навіть на прохання (тоді лише текст повідомлення коміту). Зміни лишаються в робочому дереві, коміти робить користувач. Деталі — `.claude/rules/git.md`.

## Гілки й CI

- `master` — розробка; `production` — те, що задеплоєно (деплой — лише з неї, через PR `master → production`). Гілку `staging` поки не плануємо.
- `.github/workflows/ci.yml` запускається на PR у `master` / `production`, на push у `master` і вручну; CD викликатиме його через `workflow_call`. Jobs:
  - `quality` — `npm run lint` (падає лише на помилках, попередження допустимі), `next typegen` + `tsc --noEmit`;
  - `docker` — збірка образу без push; `next build` іде всередині Dockerfile, тож це й перевірка збірки. `NEXT_PUBLIC_API_URL` — з repository variable або заглушка.
- Dependabot (`.github/dependabot.yml`) — npm, docker, github-actions, PR у `master`.

## Стек

Next.js 16 (App Router) · React 19 · TypeScript (strict) · i18next + react-i18next · TanStack Query 5 · Redux Toolkit (лише стан автентифікації) · axios · react-hook-form + zod · SCSS-модулі + CSS-токени · Tailwind 4 (лише утиліти) · framer-motion · react-big-calendar · dayjs · react-hot-toast · react-icons.

## Команди

```bash
npm run start:dev   # next dev (README зі згадкою `npm run dev` застарів)
npm run build
npm run start
npm run lint        # eslint (next core-web-vitals + typescript)
```

- `.env`: `NEXT_PUBLIC_API_URL=http://localhost:3001/api` (з суфіксом `/api`; шляхи в сервісах його не містять).
- Docker: `docker build --build-arg NEXT_PUBLIC_API_URL=https://api.<домен>/api .` — змінна вшивається в клієнтський бандл під час збірки, тому образ збирається окремо під кожне середовище (без build-arg збірка падає). `.env` до образу не потрапляє (`.dockerignore`). Healthcheck — `GET /healthz`.
- Тестів немає.

## Скіли й правила

Процедури — у `.claude/skills/`: `frontend-rebuild-plan` (рішення дня нуль і порядок побудови), `frontend-domain` (бізнес-правила → UI), `frontend-api-resource`, `frontend-ui-kit`, `frontend-styling`, `frontend-i18n`, `frontend-forms`, `frontend-modals`, `frontend-feature-section`. Короткі обмеження — `.claude/rules/` (`git` завжди; за шляхами `styles`, `ui-kit`, `api-layer`, `texts`, `comments`).

## Структура

```
src/
  app/
    layout.tsx                 # мова запиту, шрифти, Providers, Toaster, global.scss
    providers.tsx              # I18nProvider → StoreProvider → QueryClientProvider → AuthProvider
    (public)/page.tsx          # Welcome (/): відкрита всім, кнопка входу або «Open dashboard»
    (public)/schedule/         # публічний календар без сайдбару
    (platform)/layout.tsx      # RequireAuth + BaseLayout (сайдбар) для всього дашборду
    (platform)/dashboard/      # /dashboard (Overview), /study, /teaching, /lessons (усі), /admin/lessons, /users, /dictionaries
  components/
    ui/                        # дизайн-система: Button, Input, Textarea, Form*, Select, MultiSelect, Modal, SideModal, Table, Tabs, Calendar, DatePicker, TimePicker, DateTimeField, ...
    layout/                    # BaseLayout, Sidebar (+ components/), Header, Footer
    auth/                      # AuthModal, ProfileModal (+ AccountsTab), AccountsList, LogOutModal, RequireAuth, RequirePermission
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
    auth-accounts.ts, jwt.ts   # збережені акаунти й токени; декодування JWT (лише підказки, без перевірки)
    services/<x>.service.ts    # один клас на ресурс API
    query-client.ts, cn.ts, dayjs.ts, errors.ts, loading-mappers.ts, password.ts
  i18n/                        # config, create-i18n (спільні); server/ (server-only); client/ (client-only); locales/<uk|en>/<ns>.json
  store/                       # makeStore, storeRef (доступ до стору поза React), slices/authSlice
  styles/                      # abstracts (токени, міксини, брейкпоінти), base, vendors
  fonts/                       # next/font: geist, jost, oswald
```

## Потік даних

### HTTP і автентифікація

- `apiClient` (`lib/axios.ts`):
  - додає `Authorization: Bearer <access>` активного акаунта (`AuthAccounts.getAccessToken()`, з пам'яті);
  - на 401 один раз робить refresh (паралельні запити чекають на той самий проміс; вкладки одного акаунта — під `navigator.locks`, і вкладка, що чекала, бере вже ротовані іншою токени). Сесію завершує лише відхилений токен (401 / 403): акаунт позначається `signed_out`, `logout()` + `queryClient.clear()`. Мережеві помилки й 5xx сесію не чіпають;
  - **розгортає обгортку API**: сервіси одразу повертають `data` з `{ status, data }`, тож `apiClient.get<...>()` віддає payload, а не `AxiosResponse`;
  - помилки reject-ить як `{ status: false, message }`, де `message` — рядок або масив. Текст для користувача отримуй лише через `getErrorMessage(error)` з `lib/errors.ts`.
- **Кілька акаунтів** (`lib/auth-accounts.ts`, `AuthAccounts`): `localStorage.auth_accounts` — до `MAX_ACCOUNTS` (5) записів `{ id, email, fullName, status, accessToken, refreshToken, lastUsedAt }`, `auth_active_account` — лише id активного, спільного для всіх вкладок. Список парситься в пам'ять один раз (і знову на `storage` чи перед refresh), активний — посилання в ньому. Компоненти читають через `useAuthAccounts()` (`useSyncExternalStore`).
  - Акаунт, не використаний тиждень (протермінований refresh, `exp` з JWT), при старті стає `signed_out`: токени стираються, запис лишається з позначкою «Signed out» і просить пароль знову. Так само після відхиленого refresh.
  - Перемикання — `AuthAccounts.switchTo(id)`: робить акаунт активним і **перезавантажує** на `/dashboard` (скидає кеш, запити в польоті, сторінку, недоступну новому акаунту). Інші вкладки на зміну активного id перезавантажуються самі (`AuthProvider`).
  - `useLogoutMutation(accountId?)` — `POST /auth/logout` з refresh-токеном цього акаунта (тож працює й для неактивних), видаляє запис; вихід з активного перемикає на останній живий акаунт або в гостя. `useLogoutAllMutation` — усі одразу.
  - UI: вкладка **Accounts** у `ProfileModal` (`AccountsList` + «Add account» / «Log out of all», дії — з `ConfirmModal`); «Add account» — `AuthModal mode="add-account"` (зберігає акаунт без активації, перемикання — в `onAuthenticated`). Гостьова `AuthModal` показує збережені акаунти: живий — перемкнутись, `signed_out` — підставити email.
  - Старі ключі `access_token` / `refresh_token` переносяться в список при першому запуску; профіль запису оновлюється з `useMeQuery`.
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
- Після успішного входу `AuthModal` викликає `onAuthenticated(user)` (коли спливає таймер 1500ms). Welcome передає туди перехід на `/dashboard`.

### Сайдбар і розділи занять

- `SIDEBAR_GROUPS` — групи за змістом з підписом-заголовком; порядок у масиві = порядок у навбарі. **Schedule** — усі календарі занять (Studying, Teaching, All lessons); **Administration** — адмінські розділи. Окремі групи Study / Teaching — для майбутніх не-календарних розділів студента / викладача.
- Видимість пункту — предикат `isVisible({ user, hasAny })`, а не масив дозволів: розділи занять залежать від **профілю** (`user.student` / `user.teacher`), бо в домені викладачів `Permission` нічого не вирішує. Адмінські пункти — через `hasAny` з тими ж наборами, що й у секціях. `useNavbarGroups` фільтрує пункти й прибирає порожні групи.
- Розділи занять:

  | Маршрут | Хто бачить | Дані (після інтеграції) |
  |---|---|---|
  | `/dashboard/study` | є `student` | `/lessons/my?scope=studying` |
  | `/dashboard/teaching` | є `teacher` | `?tab=teaching` → `scope=teaching`; `?tab=department` (лише завідувач, `headOfDepartmentId`) → `scope=department`; у режимі списку групи — `/lessons-groups/usable/list` |
  | `/dashboard/lessons` | усі | `/lessons/list` |
  | `/dashboard/admin/lessons` | `read_lessons` / `manage_lessons` / `admin` | `/admin/lessons`: усі заняття без обмежень видимості й доступу; редагування — лише з `manage_lessons` / `admin` |

  Секції ще раз перевіряють профіль і показують заглушку: прихований пункт навбару не закриває маршрут.

### Фільтри занять

- Кожен розділ рендерить `LessonsBrowser view={...}` (`study` | `teaching` | `department` | `all` | `admin`). Набір фільтрів погляду — `LESSONS_VIEWS` у `configs/lessons-views.config.ts`; підписи мультиселектів — `lessons:filters.<key>.{label,placeholder,search}`. Новий фільтр: поле в `ILessonsFilters` (= ім'я query-параметра бекенду) → `EMPTY_LESSONS_FILTERS` → тексти `filters.<key>` в обох `lessons.json` (без них `tsc` падає) → довідник у `useLessonsFilterOptions` → ключ у потрібних поглядах.
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

### Перегляд і редагування занять

- `LessonDetails` — спільний вміст деталей заняття (`LessonDetailsModal`, модалка тижня, таблиця). Кнопка **Edit** — коли `lesson.canEdit` (викладач заняття або завідувач його кафедри) і погляд дозволяє редагувати (`LessonsBrowser canEdit`; в адмінці — лише з `manage_lessons`).
- **Місячний вид:** клік по дню відкриває `WeekLessonsModal` — заняття тижня за днями з уже завантажених даних місяця; заняття відкривається в тій самій модалці («Back»), там же «Add lesson» на цей день (якщо погляд `canCreate`). Створення кліком по слоту лишилось у тижневому й денному видах.
- **Редагування** — та сама `LessonFormModal` з `lesson` (без секції груп): `PATCH /lessons/:id`, в адмінці (`source: 'admin'`) — `PATCH /admin/lessons/:id`. Надсилаються всі поля, зокрема `date`. Поле **Lesson group** (замість секції груп): «No group» (`lessonGroupId: null`) або одна з моїх груп (`/lessons-groups/my`; в адмінці — усі з довідника), поточна група заняття є в списку завжди; бекенд перевіряє `canUseGroup` при зміні. Себе як викладача заняття форма блокує; кафедри, що вже є в занятті, лишаються допустимими (як на бекенді); в адмінці правила кафедр немає.

### Календар / список (адмінка й викладач)

- `/dashboard/admin/lessons` і `/dashboard/teaching`: `?mode=calendar|list` (`LessonsModeSwitch`, `useTabParam(MODES, 'mode')`). Пошук і фільтри в URL спільні для обох режимів. Тексти режимів і вкладок списку — `lessons:listMode.*`.
- Режим списку — `LessonsListPanel` з вкладками lessons / lesson-groups (параметр задає секція: в адмінці `?tab=`, у викладача `?list=`, бо `?tab=` там уже teaching / department): `LessonsBrowser mode="list"` (тулбар + `LessonsTable` з пагінацією, за замовчуванням лише майбутні — `dateFrom` = сьогодні, перемикач «Include past lessons») і `LessonGroupsList source` (пошук + `LessonGroupsTable`).
- Джерело груп — `TLessonGroupsSource`: `admin` → `/admin/lessons-groups` (`LessonGroupsQueryKey.AdminList`), `usable` → `/lessons-groups/usable/list` (`UsableList`; мої групи й групи моєї кафедри). Заняття групи в модалці беруться з `/lessons/list` (погляд `all`) у викладача і з `/admin/lessons` в адмінці. Викладач не перейменовує й не видаляє групу (`canManage={false}`), але **автор групи** (`group.canManageLessons` з `usable/list`) на екрані Lessons виймає будь-які заняття (`POST /lessons-groups/:id/lessons/remove`) і додає наявні, які сам веде (`AssignLessonsModal` бере погляд `teaching`, `PUT /lessons-groups/:id/lessons`). Видалення занять — лише в адмінці. Редагування рядка у викладача є лише для занять з `canEdit` (`LessonFormModal source="my"`). Модалка рахує `canManageLessons` так: в адмінці це `canManage`, у викладача — прапорець групи. Мутації `useAssign…` / `useRemoveLessonsFromGroupMutation(source, …)` вибирають ендпоінт за джерелом. Мутації занять і груп інвалідовують обидва ключі списків груп.
- **Керування групою** (`LessonGroupsList`, адмінка): клік по рядку або іконка редагування (олівець, як в інших таблицях) відкриває `LessonGroupModal` — центровану `Modal lg` з двома екранами (перехід як у `WeekLessonsModal`, варіанти — `lib/modal-screens.ts`). **Огляд** — форма модалки: назва й нотатка, «Save changes» у футері (активна лише зі змінами, закриває модалку); форма живе в `LessonGroupModal`, тож правки переживають перехід на екран Lessons і назад. Там же лише статистика з рядка списку (кількість занять і період) і кнопка «Edit lessons»; заняття вантажаться лише на екрані Lessons; видалення групи — тиха кнопка «Delete group» з іконкою в хедері (`Modal.Header actions`). **Lessons**: таблиця занять із чекбоксами (клік по рядку теж вибирає / знімає вибір) (`createSelectColumn` з `components/ui/Table/selectColumn`) і масовими «Take out» / «Delete», дії рядка (редагувати через `LessonFormModal source="admin"`, вийняти, видалити) — усе з підтвердженням `ConfirmModal`; «Add existing lessons» → `AssignLessonsModal` (пошук, «Only lessons without a group» = `withoutLessonGroup`, вибір зберігається між сторінками). `DeleteLessonGroupModal` питає, чи видаляти й заняття (за замовчуванням ні); його перемонтовують новим `key` на кожне відкриття, щоб вибір і мутація починались наново. Без `manage_lessons` модалка групи лише для перегляду. Мутації інвалідовують `LESSON_GROUPS_INVALIDATE_KEYS` (усі списки занять, груп і довідник груп).
- Сторінка списку скидається на першу при зміні запиту без ефекту: `{ key, page }` у стані, де `key` — серіалізовані параметри.
- `useTabParam(keys, param = 'tab')` — для будь-якого параметра-перемикача в URL.

### Дані календаря

- `QuerySyncedCalendar view={...} filters search` — контейнер даних: дата й вид з URL (`useCalendarSearchParams`) → `getCalendarRange` (видимі дні; у місяці — разом із крайніми тижнями сусідніх місяців) → `useLessonsQuery(view, params)` → `lessonToCalendarEvent`. Без `page` API віддає весь діапазон.
- Джерело — `source` / `scope` погляду в `LESSONS_VIEWS`: `list` → `/lessons/list` (працює й без токена, ним користується `/schedule`), `my` → `/lessons/my?scope=`, `admin` → `/admin/lessons`. Ключі запитів — `LessonsQueryKey.List | My | Admin`; мутації занять мають інвалідовувати всі три.
- Заняття має одну дату `date` (`getLessonStart`); окремого «перенесення» немає — заняття переносять, редагуючи дату. Бекенд фільтрує й сортує за нею ж. Назви викладачів, груп, курсу й кафедри приходять у самому занятті (`teachers`, `studentGroups`, `lessonGroupName`, `departmentName`), довідники для показу не потрібні.

### Стан у URL

Стан, яким можна поділитися чи який має пережити перезавантаження, живе в query-параметрах: `useCalendarSearchParams` (`?date=YYYY-MM-DD&view=day|week|month`), `useTabParam(availableKeys)` (`?tab=`, недоступне значення → перша вкладка). Оновлення — `router.replace(..., { scroll: false })`. Компоненти з `useSearchParams` сторінка обгортає в `<Suspense fallback={<Loading />}>`.

## Мультимовність (i18n)

Мови: `uk` (за замовчуванням) і `en` (мова ключів і fallback). Бібліотека — i18next + react-i18next, без префікса мови в URL.

Модуль поділено за середовищем, межу стережуть `import 'server-only'` / `import 'client-only'` (порушення — помилка збірки, а не тихий баг):

| Шар | Файли | Хто імпортує |
|---|---|---|
| спільний | `i18n/config.ts`, `i18n/create-i18n.ts` — чистий i18next, **без react-i18next** | будь-хто |
| server | `i18n/server/index.ts` (`getRequestLocale`, `getServerTranslation`), `i18n/server/resources.ts` (JSON, `pickResources`) | лише серверні компоненти (`app/**/page.tsx`, `layout.tsx`, `generateMetadata`) |
| client | `i18n/client/useLocale.ts`, `i18n/client/i18nRef.ts`, `i18n/client/validation.ts` | лише клієнтський код |

- `react-i18next` (`useTranslation`, `I18nextProvider`) створює React-контекст, тож імпортується **лише** в модулях з `'use client'` (і в хуках, які викликають лише вони). У серверних компонентах тексти — тільки через `getServerTranslation`. Плагін `initReactI18next` не підключаємо: інстанс у дерево передає `I18nProvider`.
- Типи (`TTranslationResources`) з `server/resources` беруться лише через `import type` — він стирається й межу не порушує.

- **Мова запиту** — `getRequestLocale()` (`i18n/server`): cookie `NEXT_LOCALE` → `Accept-Language` → `uk`. Через `cookies()` усі маршрути динамічні.
- `RootLayout` ставить `<html lang>` і передає в `Providers` ресурси лише активної мови й fallback (`pickResources`). `I18nProvider` один раз створює інстанс і виставляє локаль dayjs (`setDayjsLocale`), zod (`z.config(z.locales.uk())`) і `i18nRef`.
- **Перемикання** — `useLocale().setLocale(locale)`: пише cookie і **перезавантажує** сторінку (так само як `AuthAccounts.switchTo`), тож dayjs, zod і тексти завжди однієї мови. UI: `SidebarLanguage` у сайдбарі, `LanguageSwitch` (`components/layout/LanguageSwitch`) на Welcome і `/schedule`.
- **Переклади** — `src/i18n/locales/<uk|en>/<namespace>.json`; namespace на домен (`common`, `layout`, `auth`, `ui`, `public`, `validation`, `permissions`, `dictionaries`, `users`, `lessons`). Новий namespace: JSON в обох мовах + запис у `i18n/server/resources.ts`. Українські ресурси типізовані англійськими: брак ключа валить `tsc`. Ключі типобезпечні (`interfaces/i18n/i18next.d.ts`).
- Множина — суфікси i18next: в `en` `_one` / `_other`, в `uk` `_one` / `_few` / `_many` / `_other`; виклик `t('key', { count, })`.
- **Де брати `t`:**
  - клієнтські компоненти й хуки — `useTranslation('<ns>')`; ключі з інших namespace — `useTranslation(['auth', 'common'])` + `t('common:actions.cancel')`;
  - серверні сторінки й `generateMetadata` — `await getServerTranslation('<ns>')`;
  - код поза React (фабрики колонок, `getErrorMessage`, axios, `getPermissionLabel`) — `getGlobalI18n()` з `i18n/client/i18nRef`.
- **Конфіги** зберігають ключі, а не тексти: `label: 'nav.overview'` (`TNavLabelKey`), `PermissionLabels` → ключі `permissions`, `*.dictionary.ts` — `Record<LoadingState, ParseKeys<'<ns>'>>`, у компоненті `t(dict[state])`. Модульні константи з текстами (колонки таблиць, опції селектів) стають фабриками від `t` або будуються в компоненті (`createLessonColumns(t)`).
- **Фрази цілком**, без склеювання слів у коді (`Add ${itemName}` ламає відмінки в українській): кожна дія має свій ключ (`departments.add`, `departments.delete`). Лічильники — через множину i18next (`t('count', { count, })`), а не `count === 1 ? … : …`.
- **Стиль текстів:** описи (розділів, вкладок, модалок) — розгорнуті, 1–3 речення: що це, на що впливає, обмеження. Підказки полів (`hint`) — коротко, кілька слів. Кожна модалка створення / редагування має `description` і для створення, і для редагування (`form.createDescription` / `form.editDescription`); описи не обіцяють поведінки, якої немає в `api-med-scheduler/docs/domain.md`.
- **Zod-схеми** лишаються модульними константами: повідомлення — `validationError('minChars', { count: 8, })` з `i18n/client/validation.ts` (zod викликає його при кожній перевірці, тож текст поточною мовою). Стандартні повідомлення zod без власного тексту — з `z.locales`.
- **Дати**: локаль dayjs — `uk` / `en-gb` (`DAYJS_LOCALES`); календарю передається `culture`. Назви місяців і днів беріть з dayjs (`format('MMM')`, `getWeekdayLabels()`), а не хардкодом.
- Повідомлення помилок бекенду приходять англійською (перекладу немає).

## Довідники — розширюються конфігом

Сторінка `/dictionaries` повністю керується `configs/dictionaries.config.tsx` (`IDictionaryConfig<T>`): іконка, дозволи на читання / керування, колонки, `fetchList`, `remove`, `FormModal`, `rowActions`, `relatedQueryKeys`. Порядок ключів об'єкта = порядок вкладок. Тексти — у `dictionaries.json` під ключем вкладки: `<key>.title`, `.description`, `.add`, `.edit`, `.delete`, `.empty`, `.confirmDelete` (`{{name}}`), `.created` / `.updated` / `.deleted`, `.form.*`; у конфігу заголовки колонок, `rowActions[].label` і `rowLock.reason` — ключі цього namespace.

Новий довідник:
1. `interfaces/dictionaries/<x>.ts` — `I<X>`, `I<X>Payload`, `I<X>Response`.
2. `lib/services/<x>.service.ts` + `<X>QueryKey`.
3. `components/dictionaries/forms/<X>FormModal/` — `index.tsx` + `<x>.scheme.ts`; оболонка — `DictionaryModal`, пропси — `IDictionaryFormModalProps<I<X>>` (`item: null` = створення).
4. Запис `defineDictionary<I<X>>({...})` у `dictionariesConfig` + тексти `<key>.*` в обох `dictionaries.json`.
5. Кастомні клітинки — `components/dictionaries/cells/`.

## Форми

- `react-hook-form` + `zodResolver`; схема — `<name>.scheme.ts` поруч з модалкою, тип `T<Name>Form = z.infer<typeof schema>`; `mode: 'onTouched'`.
- Кожне поле — базовий компонент (`Input`, `Textarea`, `Select`, …) + тонка `Form*`-обгортка через `useFormInputProps` / `useController`; пропси обох — в `interfaces/ui/*.d.ts`. `Textarea` має `maxRows` (росте з вмістом до N рядків). `MultiSelect` має `lockedValues` — завжди вибрані значення, які не можна зняти чи очистити. Дата / дата й час — `FormDateTimeField` (значення — `Date`; `withTime` додає колонку годин і хвилин біля календаря `DatePicker`). Випадні панелі (список `Select` / `MultiSelect`, панель `DateTimeField`) — `useFloatingPanel`: портал у `body`, `position: fixed` від поля, вниз або вгору (де більше місця, з обмеженням висоти), тож модалки їх не обрізають і не розтягують; закриваються кліком поза полем і панеллю, Escape (раніше за модалку) і будь-якою прокруткою поза панеллю. Позицію хук ставить прямо на елемент, тож панель без `style`-пропа і в CSS `position: fixed; visibility: hidden`. Нативні `type="date" / "time"` у нових формах не використовуй. Сітка днів місяця — `MonthGrid` (`lib/calendar-grid.ts`), спільна для `DatePicker` і `MultiMonthCalendar`. У `MultiMonthCalendar` вибрані дні підряд показуються діапазоном (`joinSelectedDays`; сусідами вважаються календарні дні, тож діапазон тягнеться через межу тижня й місяця: суцільні крайні дні, між ними нижча світла смуга; це лише вигляд — кожен день вибраний окремо; смуга й край — псевдоелементи `::before` / `::after`, бо фон самої кнопки лягав би під смугу), а сітка доповнюється днями сусідніх місяців на суцільному світлому фоні (`shadeOutsideDays`), крім тих місяців, що вже показані в іншій половині (`isOutsideDayHidden`): розворот A | B доповнюється A−1 зліва і B+1 справа.
- Поля — лише `Form*`-обгортки з `components/ui` (`FormInput`, `FormSelect`, `FormMultiSelect`, `FormSwitch`, `FormCheckboxGroup`, `FormTextarea`, `FormPasswordInput`). Вони беруть контекст форми через `useFormInputProps` і показують помилки за спільними правилами. Generic поля: `<FormInput<TForm> name="..." />`.
- `toFormValues(item)` мапить сутність у значення форми; при відкритті модалки викликається `methods.reset(toFormValues(item))` + `mutation.reset()`.
- Порожній селект — `''`, у payload перетворюється на `null` / пропуск.
- Щільні форми (форма заняття): `hideErrorMessage` на **всіх** полях, щоб вони однаково не займали місця під текст помилки; поле з помилкою лише червоніє, а `handleSubmit(onValid, onInvalid)` показує першу помилку toast-ом (див. `LessonForm`).

## Модалки

Окремий skill: [.claude/skills/frontend-modals/SKILL.md](.claude/skills/frontend-modals/SKILL.md). Коротко: лише базові `ui/Modal` (центрована, `size` sm / md / lg) або `ui/SideModal` (бічна панель справа на всю висоту, `size` sm / md / lg / xl — для фільтрів і форм із багатьма селектами) з композицією `FormBody → Header → Content → Footer`, пропси `extends IModalBaseProps`, відкритість контролює батько. Модалки можна відкривати одна з одної (портал у `body`, нова — зверху): `useModalDismiss` веде стек, тож Escape закриває лише верхню, а прокрутка сторінки повертається, коли закрита остання. `ConfirmModal` рендерить `children` під описом (напр. перемикач). Окремий чекбокс — `ui/Checkbox` (з `indeterminate`). Щоб під час анімації закриття модалка не втрачала вміст, `item` зберігай у стані і після закриття (`{ isOpen, item }` у `UsersSection`).

## Компоненти та код-стиль

- Папка на компонент: `Name/index.tsx` + `styles.module.scss`; підкомпоненти — у `Name/components/` або сусідніх папках (`cells/`, `forms/`).
- Компонент — стрілкова функція, `const X = (...) => {}` + `export default X`. `'use client'` — у кожному компоненті з хуками / подіями. Сторінки в `app/` лишаються серверними і лише компонують клієнтські секції.
- Типи: інтерфейси з префіксом `I`, типи-аліаси з `T`, enum-и в PascalCase. Пропси лежать в `interfaces/<domain>/`, а не в файлі компонента. Імпорт типів — `import type`.
- Імпорти через `@/`; стилі імпортуються останніми: `import styles from './styles.module.scss'`.
- Кома після останнього елемента навіть в однорядкових об'єктах: `{ page, pageSize, }`, `const { data, } = ...`.
- Константи модуля — `UPPER_SNAKE_CASE` угорі файлу (`READ_PERMISSIONS`, `PAGE_SIZE`).
- **Коментарі — лише ситуативно.** Елементарний код (прості компоненти, пропси, обробники, стилі, конфіги, очевидні умови) не коментуємо взагалі, навіть JSDoc. Коментар доречний тільки як опис справді складного компонента чи логіки, яку без нього не зрозуміти. Не коментуй те, що видно з назв. Наявні в коді рясні коментарі — не зразок для нового коду.
- Тексти UI — лише через i18n (див. «Мультимовність»), без хардкоду в JSX. Тексти кнопок, що залежать від стану мутації, — у `configs/<domain>.dictionary.ts` як `Record<LoadingState, ParseKeys<'<ns>'>>`. Назви `LoadingState.Ide` / `Pendding` — історичні опечатки, не перейменовуй точково.
- Класи: `cn(...)` (clsx + tailwind-merge).
- Дати — `dayjs` з `@/lib/dayjs` (локаль за мовою: `uk` / `en-gb`, тиждень з понеділка). Частина файлів імпортує `'dayjs'` напряму — у новому коді бери `@/lib/dayjs`.

## Стилі

- SCSS-модулі на CSS-змінних із `styles/abstracts`: `--color-*` (primary, secondary, accent, neutral, error / success…), `--radius-*`, `--shadow-*`, `--text-*`, `--font-weight-*`. Хардкод кольорів не допускається.
- Адаптивність mobile-first: `@use '<відносний шлях>/styles/abstracts/mixins' as *;` → `@include mq('md') { ... }`. Брейкпоінти: sm 576, md 768, lg 992, xl 1200 (у JS — `configs/breakpoints.config.ts`, `useMediaQuery`).
- Імена класів — kebab-case, звертання `styles['nav-container']`.
- Tailwind підключений, але використовується лише для дрібних утиліт (`flex-1`). Верстку пиши в SCSS.
- Скролбар один на весь застосунок — `styles/base/_scrollbar.scss` (6px, прозора доріжка, сірий повзунок; `::-webkit-scrollbar` для Chromium / Safari, `scrollbar-width` / `-color` лише там, де webkit-варіанта немає). Локально `scrollbar-width` не задавай: у Chromium він вимикає глобальний вигляд. Виняток — `none`, щоб сховати скролбар (тоді ще `&::-webkit-scrollbar { display: none; }` для Safari, див. `Tabs`).
- Глобальні стилі сторонніх бібліотек — `styles/vendors/` (наприклад, `_calendar.scss` для react-big-calendar), а не `:global` у модулях.

## Поточний стан і пастки

- Видалення занять підключене лише в адмінці, у модалці групи (`POST /admin/lessons/delete`); у доменах викладачів його немає.
- Welcome і Overview (`/dashboard`) поки без контенту.
- `RequireAuth` рендерить children завжди і лише накриває їх оверлеєм, тож сторінки дашборду монтуються і для гостя на мить до редіректу.
- `Button` приймає проп `size`, але стилів розмірів для нього немає: проп нічого не змінює.
- `Input` показує текст помилки під полем лише з `hideHintOnError` (умова `showError && !isHintHidden`); за замовчуванням видно тільки червону рамку й підпис. `Textarea` і `Select` текст помилки показують.
- Docker-образ запускає `.next/standalone/server.js` (`output: 'standalone'` у `next.config.ts`). `NEXT_PUBLIC_API_URL` вшивається під час `next build`, тож його треба передавати на етапі збірки образу, а не запуску.
- Локаль dayjs глобальна: на сервері її виставляє `I18nProvider` на кожен рендер, тож паралельні SSR-запити різними мовами теоретично можуть перехопити одне одного. Календар від цього захищений (`culture`); у новому коді, що форматує дати під час SSR, за потреби передавайте локаль явно (`dayjs(x).locale(...)`).
- `queryClient`: глобальний `onError` нічого не показує (toast закоментовано). Помилки показують мутації самі.
