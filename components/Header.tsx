"use client";

import { BackpackIcon, FlameIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

export function Header({
  streak,
  packedToday,
}: {
  streak: number;
  packedToday: boolean;
}) {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 text-white shadow-[var(--shadow)]">
          <BackpackIcon className="h-6 w-6" />
        </span>
        <div className="leading-tight">
          <h1 className="text-xl font-extrabold tracking-tight">Packup</h1>
          <p className="text-xs text-muted">Your daily backpack list</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {streak > 0 && (
          <span
            className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-sm font-bold text-amber-500"
            title={`${streak}-day packing streak`}
          >
            <FlameIcon
              className={`h-4 w-4 ${packedToday ? "animate-flame" : ""}`}
            />
            {streak}
          </span>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
