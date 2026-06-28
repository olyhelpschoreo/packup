import type { DayIndex } from "./types";
import { keyFromDate, SCHOOL_DAYS, todayKey } from "./days";

export type Streak = { count: number; lastDate: string };

const KEY = "packup.streak";
const EMPTY: Streak = { count: 0, lastDate: "" };

export function loadStreak(): Streak {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw);
    return { count: Number(p.count) || 0, lastDate: String(p.lastDate || "") };
  } catch {
    return EMPTY;
  }
}

export function saveStreak(s: Streak): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

// The most recent school day strictly before `d`.
export function prevSchoolDayKey(d: Date): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  do {
    x.setDate(x.getDate() - 1);
  } while (!SCHOOL_DAYS.includes(x.getDay() as DayIndex));
  return keyFromDate(x);
}

// What to actually show right now: 0 if a school day has passed unpacked.
export function effectiveStreak(s: Streak): number {
  if (!s.count) return 0;
  if (s.lastDate === todayKey()) return s.count;
  if (s.lastDate === prevSchoolDayKey(new Date())) return s.count;
  return 0;
}

// New streak after fully packing today (idempotent for the same day).
export function bumpStreak(s: Streak): Streak {
  const t = todayKey();
  if (s.lastDate === t) return s;
  const prev = prevSchoolDayKey(new Date());
  const count = s.lastDate === prev ? s.count + 1 : 1;
  return { count, lastDate: t };
}
