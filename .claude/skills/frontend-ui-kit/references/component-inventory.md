# Інвентар `src/components/ui`

Оновлюй при додаванні / видаленні компонента чи суттєвого пропа. Пропси — `src/interfaces/ui/*.d.ts`.

## Дії та структура

| Компонент | Призначення | Ключові пропи / нотатки |
|---|---|---|
| `Button` | кнопка | `variant`: primary / secondary / ghost / danger / success; `isLoading`, `leftIcon`, `rightIcon`. `size` оголошений, але **без стилів** |
| `headings/Heading`, `headings/SubHeading` | заголовки сторінок і секцій | `level` 1–6 |
| `Tabs` | вкладки | `items: ITabItem[]`, `value`, `onChange`, `variant`: tiles / underline; стан у URL — `useTabParam` |
| `Collapse` | анімоване розгортання | `isOpen` |
| `Avatar` | ініціали користувача (перші літери двох слів) | `name`, `size` sm / md / lg; пропси поки оголошені в самому файлі, а не в `interfaces/ui` |
| `Loading` | спінер сторінки / секції | fallback для `Suspense` |
| `Pagination` | пагінація | `page`, `pageSize`, `total`, `onChange`; зазвичай через `Table pagination` |

## Поля (база → Form-обгортка)

| База | Form-обгортка | Нотатки |
|---|---|---|
| `Input` | `FormInput` | `icon` + `onIconClick` + `iconLabel`; текст помилки лише з `hideHintOnError` |
| `PasswordInput` | `FormPasswordInput` | `canReveal`, керована / некерована видимість |
| `Textarea` | `FormTextarea` | `maxRows` — росте до N рядків |
| `Select` | `FormSelect` | `options: ISelectOption[]`, пошук, `showOptionalFlag`; панель через `useFloatingPanel` |
| `MultiSelect` | `FormMultiSelect` | `lockedValues` — завжди вибрані, не знімаються |
| `Switch` | `FormSwitch` | `checked`, `onChange(checked)` |
| `Checkbox` | — (група: `FormCheckboxGroup`) | `indeterminate` |
| `DateTimeField` | `FormDateTimeField` | значення `Date`; `withTime` додає `TimePicker` біля `DatePicker` |
| `DatePicker` | — | `mode` day / week / month; рівні days / months / years; `embedded` |
| `TimePicker` | — | `minuteStep` |

Нативні `type="date" | "time"` не використовуються.

## Календарі

| Компонент | Призначення |
|---|---|
| `Calendar` (+ `CalendarToolbar`) | обгортка react-big-calendar: `events: ICalendarEvent[]`, `view`, `onSlotSelect`, `renderEvent`; глобальні стилі — `styles/vendors/_calendar.scss` |
| `MonthGrid` | сітка днів місяця (`lib/calendar-grid.ts`), спільна для `DatePicker` і `MultiMonthCalendar` |
| `MultiMonthCalendar` | два місяці поруч, вибір днів, діапазони (`joinSelectedDays`), дні сусідніх місяців |

## Оверлеї

| Компонент | Призначення |
|---|---|
| `Modal` | центрована: `size` sm / md / lg; `Modal.FormBody / Header / Content / Footer`; `Header actions` |
| `SideModal` | бічна панель: `size` sm / md / lg / xl; ті самі частини |

Спільні хуки: `useFloatingPanel` (випадні панелі), `useModalDismiss` (стек модалок, Escape, блок прокрутки), `useOnClickOutside`.

## Таблиця

| Компонент | Нотатки |
|---|---|
| `Table` | `columns: ITableColumn[]`, `actions`, `rowKey`, `rowLock` (замочок + причина), `rowSize` sm / md / lg, `pageSize` + `pagination`, `onRowClick`, скелетон |
| `Table/selectColumn` | `createSelectColumn` — колонка чекбоксів для масових дій |
