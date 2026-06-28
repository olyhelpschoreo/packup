import type { Item } from "./types";

// A friendly starter set so the app isn't blank on first open. Everything is
// editable — these are just examples that show off "every day" vs day-specific.
export const DEFAULT_ITEMS: Item[] = [
  { id: "seed-pencilcase", name: "Pencil case", emoji: "✏️", days: [1, 2, 3, 4, 5] },
  { id: "seed-water", name: "Water bottle", emoji: "💧", days: [1, 2, 3, 4, 5] },
  { id: "seed-folder", name: "Homework folder", emoji: "📁", days: [1, 2, 3, 4, 5] },
  { id: "seed-laptop", name: "Charged laptop", emoji: "💻", days: [1, 2, 3, 4, 5] },
  { id: "seed-gym", name: "Gym clothes", emoji: "👟", days: [2, 4] },
  { id: "seed-library", name: "Library book", emoji: "📚", days: [3] },
];

// One-tap common items shown in the Items tab to speed up setup.
export const SUGGESTIONS: { name: string; emoji: string }[] = [
  { name: "Calculator", emoji: "🧮" },
  { name: "Lunch", emoji: "🥪" },
  { name: "Headphones", emoji: "🎧" },
  { name: "Charger", emoji: "🔋" },
  { name: "Gym clothes", emoji: "👟" },
  { name: "Library book", emoji: "📚" },
  { name: "Water bottle", emoji: "💧" },
  { name: "Ruler", emoji: "📏" },
  { name: "Glasses", emoji: "👓" },
  { name: "Bus pass", emoji: "🪪" },
  { name: "Instrument", emoji: "🎻" },
  { name: "Permission slip", emoji: "📝" },
];

// Curated emoji for the picker — school stuff first.
export const EMOJI_CHOICES = [
  "✏️", "🖊️", "🖍️", "📒", "📓", "📁", "🗂️", "📚", "📖", "📐",
  "🧮", "💻", "🔋", "🎧", "🎒", "💧", "🍎", "🥪", "🍱", "👟",
  "🩳", "👕", "🧥", "🧢", "🏀", "⚽", "🎺", "🎻", "🎨", "🔬",
  "🧪", "✂️", "📏", "📎", "🔑", "🪪", "😷", "🧴", "☂️", "⌚",
  "👓", "📝",
] as const;
