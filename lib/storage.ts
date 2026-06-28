import type { CheckedState, Item } from "./types";
import { todayKey } from "./days";

const ITEMS_KEY = "packup.items";
const CHECKED_KEY = "packup.checked";

export function loadItems(): Item[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Item[]) : null;
  } catch {
    return null;
  }
}

export function saveItems(items: Item[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

// Returns today's checked ids, discarding any from a previous day.
export function loadChecked(): CheckedState {
  const fresh: CheckedState = { date: todayKey(), ids: [] };
  if (typeof window === "undefined") return fresh;
  try {
    const raw = localStorage.getItem(CHECKED_KEY);
    if (!raw) return fresh;
    const parsed = JSON.parse(raw) as CheckedState;
    if (parsed.date !== todayKey()) return fresh;
    return { date: parsed.date, ids: Array.isArray(parsed.ids) ? parsed.ids : [] };
  } catch {
    return fresh;
  }
}

export function saveChecked(state: CheckedState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHECKED_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }
}
