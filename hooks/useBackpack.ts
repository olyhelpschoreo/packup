"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DayIndex, Item } from "../lib/types";
import { todayKey } from "../lib/days";
import {
  loadChecked,
  loadItems,
  newId,
  saveChecked,
  saveItems,
} from "../lib/storage";
import { DEFAULT_ITEMS } from "../lib/defaults";

export function useBackpack() {
  const [items, setItems] = useState<Item[]>([]);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const dayRef = useRef<string>(todayKey());

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    const stored = loadItems();
    setItems(stored ?? DEFAULT_ITEMS);
    setCheckedIds(loadChecked().ids);
    setLoaded(true);
  }, []);

  // Persist once we've loaded (so we never clobber storage with [] on mount).
  useEffect(() => {
    if (loaded) saveItems(items);
  }, [items, loaded]);

  useEffect(() => {
    if (loaded) saveChecked({ date: todayKey(), ids: checkedIds });
  }, [checkedIds, loaded]);

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

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setCheckedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  return {
    items,
    checkedIds,
    loaded,
    toggleCheck,
    addItem,
    updateItem,
    removeItem,
  };
}
