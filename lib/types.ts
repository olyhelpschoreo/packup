// 0 = Sunday ... 6 = Saturday (matches JavaScript's Date.getDay()).
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Item = {
  id: string;
  name: string;
  icon: string; // an id from ITEM_ICONS (see components/ItemIcons.tsx)
  days: DayIndex[]; // which weekdays this thing is needed
};
