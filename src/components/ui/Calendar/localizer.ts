import dayjs from 'dayjs';
import { dayjsLocalizer, Formats } from 'react-big-calendar';

import 'dayjs/locale/en-gb';

export const CALENDAR_CULTURE = 'en-gb';

export const calendarLocalizer = dayjsLocalizer(dayjs);

export const calendarFormats: Formats = {
  timeGutterFormat: 'HH:mm',
  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    `${localizer!.format(start, 'HH:mm', culture)} – ${localizer!.format(end, 'HH:mm', culture)}`,
  dayFormat: 'ddd DD',
  weekdayFormat: 'ddd',
  dayHeaderFormat: 'dddd, DD MMMM YYYY',
  monthHeaderFormat: 'MMMM YYYY',
  dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
    const sameMonth = dayjs(start).isSame(end, 'month');
    return `${localizer!.format(start, sameMonth ? 'DD' : 'DD MMM', culture)} – ${localizer!.format(end, 'DD MMM YYYY', culture)}`;
  },
};
