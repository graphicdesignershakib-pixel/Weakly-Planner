import { DayInfo } from '../types/planner';

/**
 * Format a Date object to YYYY-MM-DD using local calendar year, month, and date
 * to prevent timezone drift.
 */
export function formatToYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse a YYYY-MM-DD string into a local Date object (year, monthIndex, date).
 */
export function parseYYYYMMDD(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // midday avoids any DST edge issues
}

/**
 * Return the YYYY-MM-DD date string of the Monday of the week containing the given date.
 */
export function getMondayOfWeek(inputDate: Date | string = new Date()): string {
  const date = typeof inputDate === 'string' ? parseYYYYMMDD(inputDate) : new Date(inputDate);
  const day = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  // Distance to Monday: if day is 0 (Sunday), distance back is 6. If 1, distance is 0, etc.
  const diffToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  return formatToYYYYMMDD(monday);
}

/**
 * Shift a weekStart date (YYYY-MM-DD) by a given number of weeks (+1, -1, etc.).
 */
export function shiftWeekStart(weekStartStr: string, weekDelta: number): string {
  const monday = parseYYYYMMDD(weekStartStr);
  monday.setDate(monday.getDate() + weekDelta * 7);
  return formatToYYYYMMDD(monday);
}

const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const DAY_ABBRS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Generate metadata for all 7 days of the week starting from weekStartStr (Monday).
 */
export function getWeekDaysInfo(weekStartStr: string): DayInfo[] {
  const monday = parseYYYYMMDD(weekStartStr);
  const todayStr = formatToYYYYMMDD(new Date());

  return Array.from({ length: 7 }, (_, i) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    const dateStr = formatToYYYYMMDD(current);

    const dayName = DAY_NAMES[i];
    const dayAbbr = DAY_ABBRS[i];
    const singleLetter = DAY_LETTERS[i];
    const dayOfMonth = current.getDate();
    const monthIndex = current.getMonth();
    const formattedDate = `${dayOfMonth} ${MONTH_SHORT[monthIndex]}`;
    const fullFormatted = `${dayOfMonth} ${MONTH_NAMES[monthIndex]} ${current.getFullYear()}`;

    return {
      dateStr,
      dayIndex: i,
      dayName,
      dayAbbr,
      singleLetter,
      formattedDate,
      fullFormatted,
      isToday: dateStr === todayStr,
    };
  });
}

/**
 * Format week label, e.g. "28 Sep - 4 Oct 2026"
 */
export function formatWeekRangeLabel(weekStartStr: string): string {
  const days = getWeekDaysInfo(weekStartStr);
  const startDay = days[0];
  const endDay = days[6];
  
  const startD = parseYYYYMMDD(startDay.dateStr);
  const endD = parseYYYYMMDD(endDay.dateStr);

  const startMonth = MONTH_SHORT[startD.getMonth()];
  const endMonth = MONTH_SHORT[endD.getMonth()];
  const startYear = startD.getFullYear();
  const endYear = endD.getFullYear();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${startD.getDate()} - ${endD.getDate()} ${startMonth} ${startYear}`;
    }
    return `${startD.getDate()} ${startMonth} - ${endD.getDate()} ${endMonth} ${startYear}`;
  }
  return `${startD.getDate()} ${startMonth} ${startYear} - ${endD.getDate()} ${endMonth} ${endYear}`;
}
