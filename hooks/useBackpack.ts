"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DayIndex, Item } from "../lib/types";
import { SCHOOL_DAYS, todayIndex, todayKey } from "../lib/days";
import {
  loadChecked,
  loadItems,
  newId,
  saveChecked,
  saveItems,
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
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [streak, setStreak] = useState<Streak>({ count: 0, lastDate: "" });
  const [loaded, setLoaded] = useState(false);
  const dayRef = useRef<string>(todayKey());

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    const stored = loadItems();
    setItems(stored ?? DEFAULT_ITEMS);
    setCheckedIds(loadChecked().ids);
    setStreak(loadStreak());
    setLoaded(true);
  }, []);

  // Persist once loaded (so we never clobber storage with empty state on mount).
  useEffect(() => {
    if (loaded) saveItems(items);
  }, [items, loaded]);

  useEffect(() => {
    if (loaded) saveChecked({ date: todayKey(), ids: checkedIds });
  }, [checkedIds, loaded]);

  useEffect(() => {
    if (loaded) saveStreak(streak);
  }, [streak, loaded]);

  // If the app sat open past midnight, clear yesterday's checkmarks.
  useEffect(() => {
    const check = () => {
      const key = todayKey();
      if (key !== dayRef.current) {
        dayRef.current = key;
        setCheckedIds([]);
      }
    };
    document.addEventListener("visibilitychange", check);
    const t = setInterval(check, 60_000);
    return () => {
      document.removeEventListener("visibilitychange", check);
      clearInterval(t);
    };
  }, []);

  // Is today's full list packed? (Only school days count toward the streak.)
  const todayAllPacked = useMemo(() => {
    if (!loaded) return false;
    const ti = todayIndex();
    if (!SCHOOL_DAYS.includes(ti)) return false;
    const todays = items.filter((it) => it.days.includes(ti));
    return todays.length > 0 && todays.every((it) => checkedIds.includes(it.id));
  }, [items, checkedIds, loaded]);

  // Award the streak the moment today's list is finished.
  useEffect(() => {
    if (todayAllPacked) setStreak((s) => bumpStreak(s));
  }, [todayAllPacked]);

  const toggleCheck = useCallback((id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const addItem = useCallback((name: string, emoji: string, days: DayIndex[]) => {
    setItems((prev) => [...prev, { id: newId(), name, emoji, days }]);
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
    setCheckedIds((prev) => prev.filter((x) => x !== id));
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
    checkedIds,
    loaded,
    streak: effectiveStreak(streak),
    packedToday: streak.lastDate === todayKey(),
    todayAllPacked,
    toggleCheck,
    addItem,
    updateItem,
    removeItem,
    insertItem,
  };
}
