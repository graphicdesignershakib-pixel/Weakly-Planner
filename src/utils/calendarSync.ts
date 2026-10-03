import { Task } from '../types/planner';

/**
 * Converts a 12-hour or 24-hour time string into hours and minutes.
 */
function parseTimeString(timeStr?: string): { hours: number; minutes: number } | null {
  if (!timeStr) return null;
  const cleaned = timeStr.trim().toUpperCase();
  const isPM = cleaned.includes('PM');
  const isAM = cleaned.includes('AM');
  const timeOnly = cleaned.replace(/AM|PM/g, '').trim();
  const parts = timeOnly.split(':');
  if (parts.length < 2) return null;
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  return { hours, minutes };
}

/**
 * Creates a direct Google Calendar event creation URL.
 * Automatically configures task date, start time, end time, and reminder notes.
 */
export function createGoogleCalendarUrl(
  taskTitle: string,
  dateStr: string,
  timeStr?: string,
  endTimeStr?: string,
  dayName?: string
): string {
  const cleanDate = dateStr.replace(/-/g, '');
  let startISO = cleanDate;
  let endISO = cleanDate;

  const parsedStart = parseTimeString(timeStr);
  if (parsedStart) {
    const sH = parsedStart.hours.toString().padStart(2, '0');
    const sM = parsedStart.minutes.toString().padStart(2, '0');
    startISO = `${cleanDate}T${sH}${sM}00`;

    const parsedEnd = parseTimeString(endTimeStr);
    if (parsedEnd) {
      const eH = parsedEnd.hours.toString().padStart(2, '0');
      const eM = parsedEnd.minutes.toString().padStart(2, '0');
      endISO = `${cleanDate}T${eH}${eM}00`;
    } else {
      // Default duration: 45 minutes
      const endTotalMins = (parsedStart.hours * 60 + parsedStart.minutes + 45) % (24 * 60);
      const eH = Math.floor(endTotalMins / 60).toString().padStart(2, '0');
      const eM = (endTotalMins % 60).toString().padStart(2, '0');
      endISO = `${cleanDate}T${eH}${eM}00`;
    }
  }

  const details = encodeURIComponent(
    `📋 কাজ: ${taskTitle}\n📅 দিন: ${dayName || dateStr}\n⏰ সময়: ${timeStr || 'সারাদিন'}\n\n💡 গুগল ক্যালেন্ডার স্বয়ংক্রিয়ভাবে আপনার মোবাইলে অ্যালার্ম বাজাবে এবং আপনার জিমেইলে (Gmail) ফ্রি নোটিফিকেশন পাঠাবে, এমনকি অ্যাপ বন্ধ থাকলেও!`
  );
  const text = encodeURIComponent(taskTitle);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startISO}/${endISO}&details=${details}&add=1`;
}

/**
 * Generates and triggers download of a standard RFC-5545 .ics (iCalendar) file.
 * Compatible with Android, iPhone (Apple Calendar), Google Calendar, Outlook.
 * Includes alarm triggers so phone rings and email reminders are sent even offline!
 */
export function exportTasksToIcs(
  tasks: Task[],
  dateStr: string,
  dayName: string = 'Day'
): void {
  if (tasks.length === 0) return;

  const cleanDate = dateStr.replace(/-/g, '');
  const nowISO = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Weekly Life Planner//Task Calendar//BN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Weekly Planner Tasks',
    'X-WR-TIMEZONE:Asia/Dhaka',
  ].join('\r\n');

  tasks.forEach((task, idx) => {
    const parsedStart = parseTimeString(task.time);
    let dtStart = `${cleanDate}T090000`;
    let dtEnd = `${cleanDate}T100000`;

    if (parsedStart) {
      const sH = parsedStart.hours.toString().padStart(2, '0');
      const sM = parsedStart.minutes.toString().padStart(2, '0');
      dtStart = `${cleanDate}T${sH}${sM}00`;

      const parsedEnd = parseTimeString(task.endTime);
      if (parsedEnd) {
        const eH = parsedEnd.hours.toString().padStart(2, '0');
        const eM = parsedEnd.minutes.toString().padStart(2, '0');
        dtEnd = `${cleanDate}T${eH}${eM}00`;
      } else {
        const endTotalMins = (parsedStart.hours * 60 + parsedStart.minutes + 45) % (24 * 60);
        const eH = Math.floor(endTotalMins / 60).toString().padStart(2, '0');
        const eM = (endTotalMins % 60).toString().padStart(2, '0');
        dtEnd = `${cleanDate}T${eH}${eM}00`;
      }
    } else {
      dtStart = `${cleanDate}T090000`;
      dtEnd = `${cleanDate}T100000`;
    }

    const triggerMins = task.reminderTiming === '5m' ? '5' : task.reminderTiming === '15m' ? '15' : '10';

    const event = [
      'BEGIN:VEVENT',
      `UID:task-${task.id || idx}-${cleanDate}@weeklylifeplanner.app`,
      `DTSTAMP:${nowISO}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${task.title.replace(/,/g, '\\,')}`,
      `DESCRIPTION:Scheduled in Weekly Life Planner for ${dayName}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      `TRIGGER:-PT${triggerMins}M`,
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${task.title.replace(/,/g, '\\,')}`,
      'END:VALARM',
      'BEGIN:VALARM',
      `TRIGGER:-PT${triggerMins}M`,
      'ACTION:AUDIO',
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');

    icsContent += '\r\n' + event;
  });

  icsContent += '\r\nEND:VCALENDAR';

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Planner_Schedule_${dayName}_${dateStr}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
