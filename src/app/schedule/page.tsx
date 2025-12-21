'use client'

import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'

dayjs.locale('uk')

const localizer = dayjsLocalizer(dayjs)

const events = [
  {
    title: 'Math',
    start: new Date(2025, 12, 16, 9, 0),
    end: new Date(2025, 12, 16, 10, 30),
  },
  {
    title: 'Physics',
    start: new Date(),
    end: new Date((new Date().getTime())+20000),
  },
]

export default function SchedulePage() {
  return (
    <div className="calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        views={[Views.WEEK]}
        defaultDate={new Date()}
        toolbar={false}
        min={new Date(1970, 1, 1, 8, 0)}
        max={new Date(1970, 1, 1, 22, 0)}
        step={60}
        timeslots={1}
        formats={{
          timeGutterFormat: 'H:mm',
        }}
      />
    </div>
  )
}
