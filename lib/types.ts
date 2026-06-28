// 0 = Sunday ... 6 = Saturday (matches JavaScript's Date.getDay()).
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Item = {
  id: string;
  name: string;
  emoji: string;
  days: DayIndex[]; // which weekdays this thing is needed
};
