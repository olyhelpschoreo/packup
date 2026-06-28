// 0 = Sunday ... 6 = Saturday (matches JavaScript's Date.getDay()).
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Item = {
  id: string;
  name: string;
  emoji: string;
  days: DayIndex[]; // which weekdays this thing is needed
};

// The packed checkmarks belong to a single calendar day; when the date
// rolls over we start fresh.
export type CheckedState = {
  date: string; // YYYY-MM-DD (local)
  ids: string[]; // ids packed today
};
