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

// Curated emoji for the picker — school stuff first.
export const EMOJI_CHOICES = [
  "✏️", "🖊️", "🖍️", "📒", "📓", "📁", "🗂️", "📚", "📖", "📐",
  "🧮", "💻", "🔋", "🎧", "🎒", "💧", "🍎", "🥪", "🍱", "👟",
  "🩳", "👕", "🧥", "🧢", "🏀", "⚽", "🎺", "🎻", "🎨", "🔬",
  "🧪", "✂️", "📏", "📎", "🔑", "🪪", "😷", "🧴", "☂️", "⌚",
] as const;
