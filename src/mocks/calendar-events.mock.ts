import dayjs from 'dayjs';
import { ICalendarEvent, TCalendarEventType } from '@/interfaces/ui/calendar';

interface IMockTemplate {
  title: string;
  type: TCalendarEventType;
  dayOffset: number; // relative to Monday of the current week
  start: string;     // HH:mm
  durationMin: number;
  location?: string;
  host?: string;
  allDay?: boolean;
};

const TEMPLATES: IMockTemplate[] = [
  { title: 'Anatomy', type: 'lesson', dayOffset: 0, start: '08:30', durationMin: 90, location: 'Room 204', host: 'Dr. Kovalenko' },
  { title: 'Biochemistry', type: 'lecture', dayOffset: 0, start: '10:15', durationMin: 90, location: 'Hall A', host: 'Prof. Shevchenko' },
  { title: 'Histology lab', type: 'lesson', dayOffset: 0, start: '13:00', durationMin: 120, location: 'Lab 3' },
  { title: 'Physiology', type: 'lecture', dayOffset: 1, start: '09:00', durationMin: 90, location: 'Hall B', host: 'Prof. Melnyk' },
  { title: 'Latin', type: 'lesson', dayOffset: 1, start: '11:00', durationMin: 60, location: 'Room 112' },
  { title: 'Department meeting', type: 'event', dayOffset: 1, start: '15:00', durationMin: 60, location: 'Conference room' },
  { title: 'Anatomy', type: 'lesson', dayOffset: 2, start: '08:30', durationMin: 90, location: 'Room 204', host: 'Dr. Kovalenko' },
  { title: 'Pharmacology', type: 'lecture', dayOffset: 2, start: '12:00', durationMin: 90, location: 'Hall A' },
  { title: 'Microbiology', type: 'lesson', dayOffset: 2, start: '14:00', durationMin: 90, location: 'Lab 1' },
  { title: 'Biochemistry test', type: 'exam', dayOffset: 3, start: '10:00', durationMin: 120, location: 'Hall C' },
  { title: 'Clinical practice', type: 'lesson', dayOffset: 3, start: '13:30', durationMin: 180, location: 'City Hospital №1' },
  { title: 'Pathology', type: 'lecture', dayOffset: 4, start: '09:00', durationMin: 90, location: 'Hall B' },
  { title: 'First aid workshop', type: 'event', dayOffset: 4, start: '14:00', durationMin: 120, location: 'Simulation center' },
  { title: 'Medical conference', type: 'event', dayOffset: 5, start: '00:00', durationMin: 0, allDay: true },
  { title: 'Anatomy exam', type: 'exam', dayOffset: 9, start: '09:00', durationMin: 180, location: 'Hall C' },
  { title: 'Open lecture: Cardiology', type: 'lecture', dayOffset: -4, start: '11:00', durationMin: 90, location: 'Hall A' },
  { title: 'Physiology', type: 'lecture', dayOffset: 8, start: '09:00', durationMin: 90, location: 'Hall B' },
  { title: 'Student council', type: 'event', dayOffset: 11, start: '16:00', durationMin: 60 },
];

/** Mock events placed around the current week, so every view has something to show. */
export const getMockCalendarEvents = (base: Date = new Date()): ICalendarEvent[] => {
  // dayjs().day(): 0 = Sunday → shift to Monday-based week
  const monday = dayjs(base).startOf('day').subtract((dayjs(base).day() + 6) % 7, 'day');

  return TEMPLATES.map((tpl, index) => {
    const [h, m] = tpl.start.split(':').map(Number);
    const start = monday.add(tpl.dayOffset, 'day').hour(h).minute(m);
    const end = tpl.allDay ? start.add(1, 'day') : start.add(tpl.durationMin, 'minute');

    return {
      id: `mock-${index}`,
      title: tpl.title,
      type: tpl.type,
      start: start.toDate(),
      end: end.toDate(),
      allDay: tpl.allDay,
      location: tpl.location,
      host: tpl.host,
    };
  });
};
