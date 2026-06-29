import type { Item } from "./types";

// A friendly starter set so the app isn't blank on first open. Everything is
// editable — these are just examples that show off "every day" vs day-specific.
export const DEFAULT_ITEMS: Item[] = [
  { id: "seed-pencilcase", name: "Pencil case", icon: "pencil", days: [1, 2, 3, 4, 5] },
  { id: "seed-water", name: "Water bottle", icon: "water", days: [1, 2, 3, 4, 5] },
  { id: "seed-folder", name: "Homework folder", icon: "folder", days: [1, 2, 3, 4, 5] },
  { id: "seed-laptop", name: "Charged laptop", icon: "laptop", days: [1, 2, 3, 4, 5] },
  { id: "seed-gym", name: "Gym clothes", icon: "shoe", days: [2, 4] },
  { id: "seed-library", name: "Library book", icon: "books", days: [3] },
];

// One-tap common items shown in the Items tab to speed up setup.
export const SUGGESTIONS: { name: string; icon: string }[] = [
  { name: "Calculator", icon: "calculator" },
  { name: "Lunch", icon: "sandwich" },
  { name: "Headphones", icon: "headphones" },
  { name: "Charger", icon: "battery" },
  { name: "Gym clothes", icon: "shoe" },
  { name: "Library book", icon: "books" },
  { name: "Water bottle", icon: "water" },
  { name: "Ruler", icon: "ruler" },
  { name: "Glasses", icon: "glasses" },
  { name: "Bus pass", icon: "idcard" },
  { name: "Instrument", icon: "music" },
  { name: "Permission slip", icon: "document" },
];
