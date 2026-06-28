import type { DayIndex } from "./types";

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const DAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

// Display the week starting on Monday, but keep Sunday=0 indices for storage.
export const WEEK_ORDER: DayIndex[] = [1, 2, 3, 4, 5, 6, 0];
export const SCHOOL_DAYS: DayIndex[] = [1, 2, 3, 4, 5];

export function todayIndex(): DayIndex {
  return new Date().getDay() as DayIndex;
}

// Local YYYY-MM-DD (not UTC — avoids the date flipping at the wrong hour).
export function keyFromDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayKey(): string {
  return keyFromDate(new Date());
}

// How many days from today until the next occurrence of weekday `d` (0 = today).
export function daysUntilWeekday(d: DayIndex): number {
  return (d - new Date().getDay() + 7) % 7;
}

// The actual calendar date key for the upcoming occurrence of weekday `d`.
export function dateKeyForWeekday(d: DayIndex): string {
  const t = new Date();
  const x = new Date(t.getFullYear(), t.getMonth(), t.getDate() + daysUntilWeekday(d));
  return keyFromDate(x);
}

export function relativeDayLabel(d: DayIndex): string {
  const n = daysUntilWeekday(d);
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  return `In ${n} days`;
}
