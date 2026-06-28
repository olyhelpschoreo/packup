"use client";

import { useState } from "react";
import type { DayIndex, Item } from "../lib/types";
import { EMOJI_CHOICES } from "../lib/defaults";
import { SCHOOL_DAYS } from "../lib/days";
import { DayPicker } from "./DayPicker";
import { CloseIcon } from "./Icons";

type Props = {
  initial?: Item;
  preset?: { name?: string; emoji?: string };
  onSave: (name: string, emoji: string, days: DayIndex[]) => void;
  onCancel: () => void;
};

export function ItemForm({ initial, preset, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? preset?.name ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? preset?.emoji ?? "🎒");
  const [days, setDays] = useState<DayIndex[]>(initial?.days ?? [...SCHOOL_DAYS]);

  const canSave = name.trim().length > 0 && days.length > 0;

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="animate-pop w-full max-w-md rounded-t-3xl border border-border bg-surface p-5 shadow-xl sm:rounded-3xl">
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
            if (canSave) onSave(name.trim(), emoji, days);
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-surface-2 text-3xl">
              {emoji}
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
            <div className="grid max-h-28 grid-cols-8 gap-1 overflow-y-auto rounded-xl bg-surface-2 p-2">
              {EMOJI_CHOICES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`grid aspect-square place-items-center rounded-lg text-xl transition-transform hover:scale-110 ${
                    emoji === e ? "bg-primary/20 ring-2 ring-primary" : ""
                  }`}
                >
                  {e}
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
