"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DayIndex, Item } from "../lib/types";
import { SCHOOL_DAYS, todayIndex, todayKey } from "../lib/days";
import {
  loadChecks,
  loadItems,
  newId,
  pruneChecks,
  saveChecks,
  saveItems,
  type Checks,
} from "../lib/storage";
import { DEFAULT_ITEMS } from "../lib/defaults";
import {
  bumpStreak,
  effectiveStreak,
  loadStreak,
  saveStreak,
  type Streak,
} from "../lib/streak";

export function useBackpack() {
  const [items, setItems] = useState<Item[]>([]);
  const [checks, setChecks] = useState<Checks>({});
  const [streak, setStreak] = useState<Streak>({ count: 0, lastDate: "" });
  const [loaded, setLoaded] = useState(false);
  const [dayKey, setDayKey] = useState(todayKey());

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    const stored = loadItems();
    setItems(stored ?? DEFAULT_ITEMS);
    setChecks(loadChecks());
    setStreak(loadStreak());
    setLoaded(true);
  }, []);

  // Persist once loaded (so we never clobber storage with empty state on mount).
  useEffect(() => {
    if (loaded) saveItems(items);
  }, [items, loaded]);

  useEffect(() => {
    if (loaded) saveChecks(checks);
  }, [checks, loaded]);

  useEffect(() => {
    if (loaded) saveStreak(streak);
  }, [streak, loaded]);

  // Notice the date rolling over (app left open past midnight) and re-render.
  useEffect(() => {
    const check = () => {
      const k = todayKey();
      if (k !== dayKey) {
        setDayKey(k);
        setChecks((c) => pruneChecks(c));
      }
    };
    document.addEventListener("visibilitychange", check);
    const t = setInterval(check, 60_000);
    return () => {
      document.removeEventListener("visibilitychange", check);
      clearInterval(t);
    };
  }, [dayKey]);

  const checksFor = useCallback(
    (dateKey: string): string[] => checks[dateKey] ?? [],
    [checks]
  );

  const toggle = useCallback((dateKey: string, id: string) => {
    setChecks((prev) => {
      const current = prev[dateKey] ?? [];
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      return { ...prev, [dateKey]: next };
    });
  }, []);

  // Is TODAY's full list packed? (Only school days count toward the streak.)
  const todayAllPacked = useMemo(() => {
    if (!loaded) return false;
    const ti = todayIndex();
    if (!SCHOOL_DAYS.includes(ti)) return false;
    const todays = items.filter((it) => it.days.includes(ti));
    const packed = checks[dayKey] ?? [];
    return todays.length > 0 && todays.every((it) => packed.includes(it.id));
  }, [items, checks, dayKey, loaded]);

  // Award the streak the moment today's list is finished.
  useEffect(() => {
    if (todayAllPacked) setStreak((s) => bumpStreak(s));
  }, [todayAllPacked]);

  const addItem = useCallback((name: string, icon: string, days: DayIndex[]) => {
    setItems((prev) => [...prev, { id: newId(), name, icon, days }]);
  }, []);

  const updateItem = useCallback(
    (id: string, patch: Partial<Omit<Item, "id">>) => {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
      );
    },
    []
  );

  // The caller captures the item/index for Undo before calling this.
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setChecks((prev) => {
      const next: Checks = {};
      for (const k in prev) next[k] = prev[k].filter((x) => x !== id);
      return next;
    });
  }, []);

  const insertItem = useCallback((item: Item, index: number) => {
    setItems((prev) => {
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, item);
      return next;
    });
  }, []);

  return {
    items,
    loaded,
    streak: effectiveStreak(streak),
    packedToday: streak.lastDate === dayKey,
    todayAllPacked,
    checksFor,
    toggle,
    addItem,
    updateItem,
    removeItem,
    insertItem,
  };
}
