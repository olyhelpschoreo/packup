import type { Item } from "./types";
import { todayKey } from "./days";

const ITEMS_KEY = "packup.items";
const CHECKS_KEY = "packup.checks";

// Packed checkmarks keyed by calendar date, so you can pack ahead and the
// checks survive the day rollover. Past dates are pruned on load.
export type Checks = Record<string, string[]>;

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

// Drop any dates before today (string compare works for YYYY-MM-DD).
export function pruneChecks(map: Checks): Checks {
  const today = todayKey();
  const out: Checks = {};
  for (const k in map) {
    if (k >= today && Array.isArray(map[k])) out[k] = map[k];
  }
  return out;
}

export function loadChecks(): Checks {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CHECKS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? pruneChecks(parsed) : {};
  } catch {
    return {};
  }
}

export function saveChecks(map: Checks): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHECKS_KEY, JSON.stringify(map));
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
