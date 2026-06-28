"use client";

import type { DayIndex } from "../lib/types";
import { DAY_SHORT, SCHOOL_DAYS, WEEK_ORDER } from "../lib/days";

type Props = {
  selected: DayIndex[];
  onChange: (days: DayIndex[]) => void;
};

// Multi-select weekday toggles used in the add/edit form.
export function DayPicker({ selected, onChange }: Props) {
  const toggle = (d: DayIndex) => {
    onChange(
      selected.includes(d)
        ? selected.filter((x) => x !== d)
        : [...selected, d].sort((a, b) => a - b)
    );
  };

  const sameAsSchool =
    selected.length === SCHOOL_DAYS.length &&
    SCHOOL_DAYS.every((d) => selected.includes(d));

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1.5">
        {WEEK_ORDER.map((d) => {
          const on = selected.includes(d);
          return (
            <button
              key={d}
              type="button"
              onClick={() => toggle(d)}
              aria-pressed={on}
              className={`rounded-xl py-2 text-xs font-semibold transition-colors ${
                on
                  ? "bg-primary text-primary-fg"
                  : "bg-surface-2 text-muted hover:text-text"
              }`}
            >
              {DAY_SHORT[d].charAt(0)}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange([...SCHOOL_DAYS])}
          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
            sameAsSchool
              ? "bg-primary/15 text-primary"
              : "text-muted hover:text-text"
          }`}
        >
          Every school day
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:text-text"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
