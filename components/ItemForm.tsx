"use client";

import { useEffect, useState } from "react";
import type { DayIndex, Item } from "../lib/types";
import { SCHOOL_DAYS } from "../lib/days";
import { DayPicker } from "./DayPicker";
import { CloseIcon } from "./Icons";
import { ItemIcon, ITEM_ICONS } from "./ItemIcons";

type Props = {
  initial?: Item;
  preset?: { name?: string; icon?: string };
  onSave: (name: string, icon: string, days: DayIndex[]) => void;
  onCancel: () => void;
};

export function ItemForm({ initial, preset, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? preset?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? preset?.icon ?? "backpack");
  const [days, setDays] = useState<DayIndex[]>(initial?.days ?? [...SCHOOL_DAYS]);

  const canSave = name.trim().length > 0 && days.length > 0;

  // Close on Escape, like every native sheet.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label={initial ? "Edit item" : "Add an item"}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-pop max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-3xl sm:pb-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {initial ? "Edit item" : "Add to your list"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-text"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSave) onSave(name.trim(), icon, days);
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-surface-2 text-primary">
              <ItemIcon id={icon} className="h-8 w-8" />
            </span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gym clothes"
              className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              Icon
            </p>
            <div className="grid max-h-32 grid-cols-6 gap-1.5 overflow-y-auto rounded-xl bg-surface-2 p-2">
              {ITEM_ICONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIcon(opt.id)}
                  aria-label={opt.label}
                  aria-pressed={icon === opt.id}
                  className={`grid aspect-square place-items-center rounded-lg transition-transform hover:scale-110 ${
                    icon === opt.id
                      ? "bg-primary/15 text-primary ring-2 ring-primary"
                      : "text-muted"
                  }`}
                >
                  <opt.Icon className="h-6 w-6" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              Which days do you need it?
            </p>
            <DayPicker selected={days} onChange={setDays} />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-border py-2.5 font-semibold text-muted hover:text-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="flex-1 rounded-xl bg-primary py-2.5 font-semibold text-primary-fg shadow-sm transition-opacity disabled:opacity-40"
            >
              {initial ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
