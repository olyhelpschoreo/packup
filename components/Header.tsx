"use client";

import { BackpackIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-fg shadow-sm">
          <BackpackIcon className="h-6 w-6" />
        </span>
        <div className="leading-tight">
          <h1 className="text-xl font-bold tracking-tight">Packup</h1>
          <p className="text-xs text-muted">Your daily backpack list</p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
