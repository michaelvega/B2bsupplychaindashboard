import { ScheduleCalendar } from '../components/ScheduleCalendar';

export function Rules() {
  return (
    <div className="h-full p-8 flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-xl font-semibold text-gray-900">Schedule</h1>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <ScheduleCalendar />
      </div>
    </div>
  );
}
