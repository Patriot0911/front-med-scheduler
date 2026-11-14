---
name: frontend-modals
description: Як будувати модальні вікна у front-med-scheduler — центрована Modal чи бічна SideModal, структура файлів, композиція через Header / FormBody / Content / Footer, вибір розміру з адаптивністю, стани завантаження та стилізація токенами. Використовуй щоразу, коли створюєш нову модалку, змінюєш наявну (AuthModal, ConfirmModal тощо) або переносиш форму в модальне вікно.
---

# Модалки у front-med-scheduler

Усі модалки будуються на базовому компоненті `@/components/ui/Modal`. Еталон — `src/components/auth/AuthModal`. Не пиши власних overlay, порталів, `position: fixed` чи обробки Escape — це вже робить `Modal`.

Для create / edit форм довідників є готова оболонка `src/components/modals/DictionaryModal` (Header + FormBody + Cancel / Save). Використовуй її замість ручної композиції, див. `components/dictionaries/forms/SemesterFormModal`. Вона закриває модалку одразу через `onSuccess` мутації і показує toast, а не таймер 1500ms із розділу 5.

## 1. Де лежать файли

```
src/components/<domain>/<Name>Modal/
  index.tsx              # компонент модалки
  styles.module.scss     # лише специфічні стилі вмісту (опційно)
  <name>.scheme.ts       # zod-схема форми (якщо модалка з формою)

src/interfaces/<domain>/modal.ts   # пропси модалки
src/configs/<domain>.dictionary.ts # тексти кнопок за LoadingState
```

- Доменна модалка (логін, урок, користувач) — у `components/<domain>/`.
- Загальна модалка, яка не належить до домену (підтвердження тощо) — у `components/modals/`.
- Назва компонента і папки завжди закінчується на `Modal`.

## 2. Пропси

Пропси завжди розширюють `IModalBaseProps` (`isOpen`, `onClose`) з `@/interfaces/shared/modal`:

```ts
import { IModalBaseProps } from '../shared/modal';

export interface ILessonModalProps extends IModalBaseProps {
  lessonId?: string;
};
```

Відкритість контролює батьківський компонент:

```tsx
const [isShownLessonModal, setIsShownLessonModal] = useState(false);

<LessonModal
  isOpen={isShownLessonModal}
  onClose={() => setIsShownLessonModal(false)}
/>
```

## 3. Структура компонента

Порядок завжди такий: `Modal` → `Modal.FormBody` (або без нього, якщо форми немає) → `Modal.Header` → `Modal.Content` → `Modal.Footer`.

### Модалка з формою

```tsx
const LessonModal = (props: ILessonModalProps) => {
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mutation = useCreateLessonMutation();
  const methods = useForm<TLessonForm>({
    resolver: zodResolver(lessonSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const submitHandler = (data: TLessonForm) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (!props.isOpen) {
      mutation.reset();
      methods.reset();
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (!props.isOpen || !mutation.isSuccess) return;

    fadeTimer.current = setTimeout(() => props.onClose(), 1500);

    return () => {
      if (fadeTimer.current) {
        clearTimeout(fadeTimer.current);
        fadeTimer.current = null;
      }
    };
  }, [mutation.isSuccess, props.isOpen]);

  const loadingState = mutationToLoadingState(mutation);
  const isLocked = mutation.isPending || mutation.isSuccess;

  return (
    <Modal {...props} size="md" isLoading={mutation.isPending}>
      <Modal.FormBody methods={methods} onSubmit={methods.handleSubmit(submitHandler)}>
        <Modal.Header
          title="Create lesson"
          description="Fill in lesson details"
        />
        <Modal.Content>
          <FormInput<TLessonForm> name="title" label="Title" required disabled={isLocked} />
        </Modal.Content>
        <Modal.Footer>
          <Button className="flex-1" variant="secondary" onClick={props.onClose} disabled={isLocked}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!methods.formState.isValid || isLocked}
            variant={LoadingStateVariantsMap[loadingState]}
          >
            {LessonCreateButtonDictionary[loadingState]}
          </Button>
        </Modal.Footer>
      </Modal.FormBody>
    </Modal>
  );
};
```

### Модалка без react-hook-form

Якщо полів немає або вони прості, як у `ConfirmModal`, передавай у `Modal.FormBody` лише `onSubmit`, без `methods`. Тоді Enter усе одно надсилає форму, а submit-кнопка лишається `type="submit"`.

Якщо це суто інформаційна модалка без дій, `Modal.FormBody` не потрібен: `Modal` → `Header` → `Content` → `Footer`.

### Правила композиції

- **Не вкладай** власний `<form>` всередину `Modal.FormBody`, бо він сам рендерить `<form>` і `FormProvider`.
- **`Modal.Header`** — обов'язковий. `title` короткий, 1–3 слова. `description` — опційно, одне речення.
- **`Modal.Content`** — усі поля та текст. Пояснювальний текст під полями оформлюй класом `description` з `styles.module.scss` модалки (див. AuthModal / ConfirmModal).
- **`Modal.Footer`**:
  - кнопки — лише `@/components/ui/Button`;
  - порядок: спочатку `secondary` (Cancel), потім основна дія;
  - обом кнопкам став `className="flex-1"`, якщо їх дві або одна на всю ширину;
  - деструктивна дія — `variant="danger"`.

## 4. Розміри та адаптивність

`size` задає максимальну ширину модалки на екранах від 576px. Якщо розмір не вказано, використовується `sm`.

| `size` | max-width | Для чого |
|---|---|---|
| `sm` (за замовч.) | 420px | Підтвердження, логін, форми до ~3 полів в одну колонку |
| `md` | 600px | Стандартні CRUD-форми, до двох колонок полів |
| `lg` | 800px | Складні форми, вкладені таблиці, детальний перегляд (наприклад, заняття) |

Як базовий `Modal` адаптує модалку (див. `src/components/ui/Modal/styles.module.scss`):

- **< 576px.** Модалка виїжджає знизу як bottom sheet на всю ширину, із заокругленими верхніми кутами. Розмір `size` тут не має значення.
- **≥ 576px.** Модалка по центру, ширина `100%` до `max-width` за розміром, навколо відступ 16–24px.
- **Висота** обмежена висотою екрана, довгий вміст прокручується всередині модалки, а не сторінка.

Правила для нових модалок:

- **Не задавай** `width`, `min-width`, `max-width` чи `height` модалці через `className`. Обирай `size`. Якщо жоден розмір не підходить, додай новий модифікатор у базовий `Modal/styles.module.scss` (змінна `--modal-width`) і тип у `IModalProps['size']`, а не перевизначай локально.
- **Кілька колонок** у `md` / `lg` роби mobile-first: на мобільному одна колонка, з `mq('sm')` або `mq('md')` — дві.

  ```scss
  @use '../../../styles/abstracts/mixins' as *;

  .fields {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;

    @include mq('md') {
      grid-template-columns: 1fr 1fr;
    }
  }
  ```

  Брейкпоінти беруться з `src/styles/abstracts/_breakpoints.scss`: `sm` 576, `md` 768, `lg` 992, `xl` 1200.
- **Таблиці та широкий вміст** всередині модалки загортай у контейнер з `overflow-x: auto`. Модалка не повинна розширюватись через вміст.

## 4a. Бічна модалка (`SideModal`)

`@/components/ui/SideModal` — панель на всю висоту екрана, що виїжджає справа (overlay, тінь `--shadow-lg`, Esc і клік по overlay закривають). Композиція та сама: `SideModal.Header` / `FormBody` / `Content` / `Footer` — це ті самі компоненти, що й у `Modal`; через `ModalLayoutContext` (`ui/Modal/context.ts`) вони знають, що рендеряться в панелі: `FormBody` розтягується на висоту, прокручується **лише** `Content`, а `Header` і `Footer` (з розділювачем) лишаються на місці.

Коли брати `SideModal`, а не `Modal`:
- фільтри, налаштування, довгі панелі, яким потрібна вся висота екрана (випадні списки вже не проблема: вони рендеряться порталом через `useFloatingPanel` і не обрізаються жодною модалкою);
- допоміжні дії, під час яких сторінка позаду має лишатися «на місці» (не стрибати).

Для підтверджень і коротких форм лишається `Modal`.

| `size` | ширина | Для чого |
|---|---|---|
| `sm` (за замовч.) | 400px | Фільтри, поля в одну колонку |
| `md` | 520px | Форми з ширшими полями |
| `lg` | 680px | Дві колонки полів, детальний перегляд |
| `xl` | 880px | Таблиці, складний вміст |

- **< 576px** панель на всю ширину екрана; **≥ 576px** — ширина за `size`, але не ширша за `100vw - 48px`, ліві кути заокруглені.
- Ширину не задавай через `className`: новий розмір — модифікатор у `ui/SideModal/styles.module.scss` (`--side-modal-width`) і значення в `TSideModalSize`.
- Поля в панелі зазвичай в одну колонку. Горизонтальний відступ панелі — змінна `--side-modal-padding-x`, з нею вирівняний `Content`.
- Чернетку стану (як у фільтрах) тримай у дочірньому компоненті всередині `SideModal`: він монтується лише при відкритій панелі, тож кожне відкриття починається з актуальних значень (див. `LessonsFiltersModal`).



- **Під час запиту** передавай у `Modal` `isLoading`. Він накриває модалку напівпрозорим оверлеєм із `Loading`.
- **Поля блокуй** через `disabled` на час `isPending` і після `isSuccess`.
- **Текст і варіант кнопки** беруться зі стану через `mutationToLoadingState` і `LoadingStateVariantsMap` (`@/lib/loading-mappers`). Тексти кнопок під кожен стан тримай у `src/configs/<domain>.dictionary.ts`:

  ```ts
  export const LessonCreateButtonDictionary: Record<LoadingState, string> = {
    [LoadingState.Ide]: 'Create',
    [LoadingState.Pendding]: 'Processing...',
    [LoadingState.Loading]: 'Loading...',
    [LoadingState.Success]: 'Created successfully!',
  };
  ```
- **Після успіху** модалка закривається сама через 1500ms. Таймер зберігай у `useRef` і обов'язково очищай у cleanup ефекту.
- **При закритті** (`isOpen === false`) скидай мутацію (`mutation.reset()`) і форму (`methods.reset()`), а також локальний стан, як `confirmWord` у ConfirmModal.

## 6. Стилізація

- **Тільки токени** з `src/styles/abstracts`: `--color-*`, `--radius-*`, `--shadow-*`, `--text-*`, `--font-weight-*`. Шрифт `--font-jost` модалка вже успадковує.
- **Жодних** захардкоджених кольорів, `--ink-*`, `--surface*` чи `:global`.
- **`styles.module.scss` модалки** містить лише стилі її вмісту: описи, сітки полів. Оформлення контейнера, overlay, заголовка та футера живе в `ui/Modal` і локально не перевизначається.

## 7. Чекліст перед завершенням

- [ ] Пропси розширюють `IModalBaseProps`, `isOpen` контролює батько.
- [ ] Структура `Modal → FormBody? → Header → Content → Footer`, без власного `<form>` чи overlay.
- [ ] Вибрано `Modal` чи `SideModal` і `size` за таблицею, без локальних `width` / `min-width`.
- [ ] Багатоколонковий вміст на мобільному стає однією колонкою.
- [ ] Є `isLoading`, поля блокуються, тексти кнопок узято з dictionary за `LoadingState`.
- [ ] Стан скидається при закритті, таймер автозакриття очищується.
- [ ] Стилі тільки на токенах.
- [ ] Модалку перевірено на ширині < 576px і на десктопі.
