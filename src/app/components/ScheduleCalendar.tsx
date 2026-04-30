import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays, startOfDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ScheduleEditDialog } from './ScheduleEditDialog';
import { Button } from './ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { ThinkingTimer } from './ThinkingTimer';

const AZURE_CALENDAR_FILE = 'agent-calendar.json';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface AgentEvent extends Event {
  id: string;
  title: string;
  recurrence: 'none' | 'daily' | 'weekly';
  desc?: string;
  color?: string;
}

// Initial Mock Data
const today = startOfDay(new Date());
const initialEvents: AgentEvent[] = [
  {
    id: '1',
    title: 'Weekly Report Sync',
    start: new Date(today.setHours(9, 0, 0, 0)),
    end: new Date(today.setHours(10, 0, 0, 0)),
    recurrence: 'weekly',
    color: '#3b82f6', // blue
  },
  {
    id: '2',
    title: 'Daily Data Fetch',
    start: addDays(new Date(today.setHours(12, 0, 0, 0)), 1),
    end: addDays(new Date(today.setHours(12, 30, 0, 0)), 1),
    recurrence: 'daily',
    color: '#10b981', // green
  },
  {
    id: '3',
    title: 'Inventory Update',
    start: addDays(new Date(today.setHours(15, 0, 0, 0)), -1),
    end: addDays(new Date(today.setHours(16, 0, 0, 0)), -1),
    recurrence: 'none',
    color: '#f59e0b', // amber
  }
];

export function ScheduleCalendar() {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AgentEvent | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch(`/api/azure/${AZURE_CALENDAR_FILE}`);
        if (res.ok) {
          const text = await res.text();
          if (text) {
            const parsed = JSON.parse(text);
            const eventsWithDates = parsed.map((e: any) => ({
              ...e,
              start: new Date(e.start),
              end: new Date(e.end)
            }));
            setEvents(eventsWithDates);
          } else {
            setEvents(initialEvents);
          }
        } else {
          setEvents(initialEvents);
        }
      } catch (err) {
        console.error('Failed to load events', err);
        setEvents(initialEvents);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  const saveEvents = async (newEvents: AgentEvent[]) => {
    setEvents(newEvents);
    try {
      await fetch(`/api/azure/${AZURE_CALENDAR_FILE}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvents, null, 2)
      });
    } catch (err) {
      console.error('Failed to save events', err);
    }
  };

  const handleSelectEvent = (event: object) => {
    setSelectedEvent(event as AgentEvent);
    setSelectedSlot(null);
    setIsDialogOpen(true);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setSelectedEvent(undefined);
    setIsDialogOpen(true);
  };

  const handleSaveEvent = (savedEvent: AgentEvent) => {
    let newEvents;
    if (events.find((e) => e.id === savedEvent.id)) {
      newEvents = events.map((e) => (e.id === savedEvent.id ? savedEvent : e));
    } else {
      newEvents = [...events, savedEvent];
    }
    saveEvents(newEvents);
    setIsDialogOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    const newEvents = events.filter((e) => e.id !== id);
    saveEvents(newEvents);
    setIsDialogOpen(false);
  };

  const handleAddNew = () => {
    setSelectedSlot({
      start: startOfDay(new Date()),
      end: new Date(startOfDay(new Date()).setHours(1, 0, 0, 0))
    });
    setSelectedEvent(undefined);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden items-center justify-center gap-2 min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-gray-500 font-medium"><ThinkingTimer label="Loading schedule" /></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-3 border-b border-gray-200 flex justify-end items-center bg-gray-50/50 shrink-0">
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <div className="flex-1 p-4 min-h-[600px] schedule-calendar-wrapper">
        <style>{`
          .schedule-calendar-wrapper .rbc-calendar {
            font-family: inherit;
          }
          .schedule-calendar-wrapper .rbc-event {
            background-color: #3b82f6;
            border-radius: 4px;
          }
          .schedule-calendar-wrapper .rbc-today {
            background-color: #f8fafc;
          }
          .schedule-calendar-wrapper .rbc-toolbar button:active,
          .schedule-calendar-wrapper .rbc-toolbar button.rbc-active {
            background-color: #e2e8f0;
            box-shadow: none;
          }
        `}</style>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          views={['month', 'week', 'day']}
          defaultView="month"
          eventPropGetter={(event: AgentEvent) => ({
            style: {
              backgroundColor: event.color || '#3b82f6',
            },
          })}
        />
      </div>

      <ScheduleEditDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialEvent={selectedEvent}
        selectedSlot={selectedSlot}
      />
    </div>
  );
}
