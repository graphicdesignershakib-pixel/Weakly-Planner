import { PlannerState } from '../types/planner';

/**
 * Generates an iCalendar (.ics) format file string for all planned tasks
 * that have scheduled times or are marked high priority.
 */
export function generateIcsCalendar(state: PlannerState): string {
  const events: string[] = [];
  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  state.days.forEach((day) => {
    // day.date is in format YYYY-MM-DD
    const dateClean = day.date.replace(/-/g, '');

    day.tasks.forEach((task) => {
      // Parse scheduled time if present e.g. "09:30 AM" or "14:00"
      let dtStartStr = `${dateClean}T090000`;
      let dtEndStr = `${dateClean}T100000`;

      if (task.time) {
        const timeMatch = task.time.match(/(\d{1,2}):(\d{2})(?:\s*([APap][Mm]))?/);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1], 10);
          const minutes = timeMatch[2];
          const ampm = timeMatch[3]?.toUpperCase();

          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;

          const hh = String(hours).padStart(2, '0');
          const endHh = String(Math.min(23, hours + 1)).padStart(2, '0');

          dtStartStr = `${dateClean}T${hh}${minutes}00`;
          dtEndStr = `${dateClean}T${endHh}${minutes}00`;
        }
      }

      const uid = `task-${task.id}-${dateClean}@weeklylifeplanner.app`;
      const summary = task.title.replace(/[,;]/g, ' ');
      const status = task.completed ? 'COMPLETED' : 'CONFIRMED';
      const description = `Priority: ${task.priority || 'normal'}\\nStatus: ${task.completed ? 'Completed' : 'Pending'}`;

      events.push([
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${dtStartStr}`,
        `DTEND:${dtEndStr}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `STATUS:${status}`,
        'END:VEVENT',
      ].join('\r\n'));
    });
  });

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Weekly Life Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Weekly Life Planner (${state.weekStart})`,
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

export function downloadIcsFile(state: PlannerState) {
  const content = generateIcsCalendar(state);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `weekly-schedule-${state.weekStart}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
