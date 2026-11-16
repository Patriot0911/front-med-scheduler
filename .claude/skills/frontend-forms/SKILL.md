---
name: frontend-forms
description: Форми у front-med-scheduler на react-hook-form + zod — файл схеми, тип форми з z.infer, фабрика схеми для правил, що залежать від даних (віддзеркалення валідації бекенду), toFormValues / toPayload, порожні значення ('' → null), скидання форми й мутації при відкритті або монтування форми лише при відкритті, щільні форми з toast першої помилки, поля дат, блокування полів (lockedValues), стани кнопки сабміту. Використовуй, коли створюєш чи змінюєш форму, zod-схему, поле форми, мапінг сутності у форму чи форми в payload.
---

# Форми

Оболонку модалки бери з `frontend-modals` (`DictionaryModal` для довідників), поля — `Form*`-обгортки з `frontend-ui-kit`, тексти помилок — `frontend-i18n`.

## 1. Файли

```
components/<domain>/forms/<Name>FormModal/
  index.tsx
  <name>.scheme.ts        # схема + тип форми
```

```ts
// <name>.scheme.ts
export const semesterSchema = z.object({
  name: z.string().trim().min(3, validationError('minChars', { count: 3, })),
  dateFrom: z.date(validationError('required')),
  dateTo: z.date(validationError('required')),
}).refine(
  ({ dateFrom, dateTo, }) => !dayjs(dateTo).isBefore(dateFrom),
  { ...validationError('notBeforeStart'), path: ['dateTo'], },
);

export type TSemesterForm = z.infer<typeof semesterSchema>;
```

- Схема — модульна константа; повідомлення лише через `validationError` / `validationMessage` (обчислюються при перевірці, тож поточною мовою).
- Правило між полями — `refine` / `superRefine` з `path` на поле, біля якого показати помилку.
- `useForm<T>({ resolver: zodResolver(schema), mode: 'onTouched', })`.

## 2. Фабрика схеми — коли правило залежить від даних

Якщо валідація потребує довідника, поточного користувача чи сутності, що редагується, — фабрика з контекстом, а не перевірка в `onSubmit`:

```ts
export const createLessonSchema = ({ teacherDepartments, keptDepartmentIds = [], restrictDepartments = true, }: ILessonSchemaContext) =>
  z.object({ ... }).superRefine((form, ctx) => {
    const allowed = new Set([...form.teacherIds.map((id) => teacherDepartments.get(id)), ...keptDepartmentIds]);
    if (restrictDepartments && form.departmentIds.some((id) => !allowed.has(id))) {
      ctx.addIssue({ code: 'custom', path: ['departmentIds'], message: validationMessage('onlyTeacherDepartments'), });
    }
  });

const schema = useMemo(() => createLessonSchema({ ... }), [deps]);
```

Фабрика **віддзеркалює** правило бекенду (з `domain.md` / class-validator DTO) — ті самі межі (`duration ≥ 5`, ≤ 200 дат серії, автор серед викладачів). Нове обмеження, якого немає на бекенді, у схему не додається без узгодження.

## 3. Значення форми ↔ сутність ↔ payload

| Що | Правило |
|---|---|
| `toFormValues(item \| null)` | сутність → значення форми; `null` = створення з дефолтами |
| `toPayload(form)` (за потреби) | значення форми → payload API |
| порожній селект | `''` у формі → `null` або пропуск у payload |
| числа з поля вводу | рядок у формі (`z.string().regex(/^\d+$/)`) → `Number()` у payload |
| дата / дата й час | `Date` у формі (`FormDateTimeField`, `withTime`), ISO у payload |
| мультиселект | `string[]` |

Нативні `type="date" | "time"` у нових формах не вживаються (`SemesterFormModal` — застаріле виключення, не зразок).

## 4. Життєвий цикл

Два допустимі патерни — обирай один на форму:

**A. Форма монтується лише при відкритті (переважно для нових форм).** Модалка рендерить `{isOpen && <LessonForm draft={...} />}` або форма живе в дочірньому компоненті, що монтується в `SideModal` / `Modal` при відкритті. Кожне відкриття стартує з `defaultValues`, без ефектів скидання. Так зроблено `LessonForm`, `LessonsFiltersForm`.

**B. Форма живе разом з модалкою (довідники, `DictionaryModal`).**
```ts
useEffect(() => {
  if (isOpen) {
    methods.reset(toFormValues(item));
    mutation.reset();
  }
}, [isOpen, item]);
```

Модалка, що закривається з анімацією, тримає `item` у стані батька й після закриття (`{ isOpen, item }`), щоб вміст не зникав.

Форма, яка має пережити перехід між екранами модалки, живе в батьківській модалці (`LessonGroupModal`), а не на екрані.

## 5. Поля

- Лише `Form*`-обгортки: `<FormInput<TForm> name="name" label={t('fields.name')} required />`.
- Значення, які не можна зняти (автор серед викладачів), — `FormMultiSelect lockedValues`, а не перевірка після вибору.
- Поля блокуються (`disabled`) під час `isPending` і після `isSuccess`.
- Опції селектів з довідників — query-хуки з `enabled: isOpen`; поки вантажаться — `disabled` / плейсхолдер.

## 6. Щільні форми

Для форм із великою кількістю полів (форма заняття): `hideErrorMessage` на **всіх** полях — вони не стрибають висотою, поле з помилкою лише червоніє; першу помилку показує toast:

```ts
const onInvalid = (errors: FieldErrors<TForm>) => {
  const field = FIELD_ORDER.find((name) => errors[name]);
  if (field) toast.error(String(errors[field]?.message));
};
<Modal.FormBody methods={methods} onSubmit={methods.handleSubmit(onValid, onInvalid)}>
```

## 7. Сабміт і результат

- Мутація — `frontend-api-resource` (інвалідація + toast). Помилка сервера — toast через `getErrorMessage`, форма лишається відкритою з даними.
- Кнопка сабміту: `type="submit"`, текст і варіант — з `mutationToLoadingState` + `configs/<domain>.dictionary.ts`.
- Кнопка «Save changes» у формі редагування активна лише з `formState.isDirty`.

## 8. Чекліст

- [ ] Схема в `<name>.scheme.ts`, тип через `z.infer`, повідомлення через `validationError`.
- [ ] Правила, залежні від даних, — фабрика схеми, віддзеркалена з бекенду.
- [ ] `toFormValues` для редагування; `''` → `null` у payload.
- [ ] Обрано один патерн життєвого циклу (A або B), стан не «протікає» між відкриттями.
- [ ] Лише `Form*`-поля; дати — `FormDateTimeField`.
- [ ] Поля блокуються під час запиту; помилка сервера не закриває форму.
- [ ] Обидві мови: тексти полів, підказок, помилок.
