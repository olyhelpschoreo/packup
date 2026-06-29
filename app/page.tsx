"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useBackpack } from "../hooks/useBackpack";
import type { DayIndex, Item } from "../lib/types";
import {
  DAY_LONG,
  DAY_SHORT,
  dateKeyForWeekday,
  relativeDayLabel,
  todayIndex,
  WEEK_ORDER,
} from "../lib/days";
import { SUGGESTIONS } from "../lib/defaults";
import { Header } from "../components/Header";
import { ItemForm } from "../components/ItemForm";
import { Confetti } from "../components/Confetti";
import {
  BackpackIcon,
  CheckIcon,
  PencilIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  UndoIcon,
} from "../components/Icons";

type Tab = "pack" | "items";
type Editing = { item?: Item; preset?: { name: string; emoji: string } } | null;
type Undo = { item: Item; index: number } | null;

export default function Page() {
  const bp = useBackpack();
  const [tab, setTab] = useState<Tab>("pack");
  const [viewDay, setViewDay] = useState<DayIndex>(todayIndex());
  const [editing, setEditing] = useState<Editing>(null);
  const [undo, setUndo] = useState<Undo>(null);
  const [confetti, setConfetti] = useState(0);
  const packRef = useRef<{ key: string; packed: boolean }>({ key: "", packed: false });
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const today = todayIndex();
  const isToday = viewDay === today;
  const selectedKey = dateKeyForWeekday(viewDay);
  const selectedChecks = bp.checksFor(selectedKey);

  const dayItems = useMemo(
    () => bp.items.filter((it) => it.days.includes(viewDay)),
    [bp.items, viewDay]
  );

  const packedCount = dayItems.filter((it) => selectedChecks.includes(it.id)).length;
  const allPacked = dayItems.length > 0 && packedCount === dayItems.length;
  const ringPct = dayItems.length ? packedCount / dayItems.length : 0;

  // How many things are still unpacked for *today* (for the tab badge).
  const remainingToday = useMemo(() => {
    const todays = bp.items.filter((it) => it.days.includes(today));
    const packed = bp.checksFor(dateKeyForWeekday(today));
    return todays.filter((it) => !packed.includes(it.id)).length;
  }, [bp.items, bp.checksFor, today]);

  // Fire confetti + a buzz the moment a day's list becomes complete.
  useEffect(() => {
    const prev = packRef.current;
    if (allPacked && prev.key === selectedKey && !prev.packed) {
      setConfetti((c) => c + 1);
      navigator.vibrate?.([12, 40, 18]);
    }
    packRef.current = { key: selectedKey, packed: allPacked };
  }, [allPacked, selectedKey]);

  const doDelete = (item: Item) => {
    const index = bp.items.findIndex((x) => x.id === item.id);
    bp.removeItem(item.id);
    setUndo({ item, index: index === -1 ? bp.items.length : index });
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndo(null), 4500);
  };

  const doUndo = () => {
    if (undo) bp.insertItem(undo.item, undo.index);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndo(null);
  };

  const check = (id: string) => {
    navigator.vibrate?.(8);
    bp.toggle(selectedKey, id);
  };

  // Suggestions not already on the list (case-insensitive).
  const freshSuggestions = useMemo(() => {
    const have = new Set(bp.items.map((it) => it.name.trim().toLowerCase()));
    return SUGGESTIONS.filter((s) => !have.has(s.name.toLowerCase()));
  }, [bp.items]);

  // Avoid a flash of default content before localStorage hydrates.
  if (!bp.loaded) {
    return <main className="min-h-dvh" aria-busy />;
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-4 pb-28 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <Confetti trigger={confetti} />
      <Header streak={bp.streak} packedToday={bp.packedToday} />

      {tab === "pack" ? (
        <section className="mt-5 space-y-4">
          {/* Day selector */}
          <div className="grid grid-cols-7 gap-1.5">
            {WEEK_ORDER.map((d) => {
              const selected = d === viewDay;
              const isTodayChip = d === today;
              const hasItems = bp.items.some((it) => it.days.includes(d));
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setViewDay(d)}
                  aria-pressed={selected}
                  aria-label={`${DAY_LONG[d]}${isTodayChip ? " (today)" : ""}`}
                  className={`flex flex-col items-center rounded-2xl py-2 text-xs font-semibold shadow-[var(--shadow)] transition-all active:scale-95 ${
                    selected
                      ? "bg-gradient-to-br from-teal-500 to-emerald-400 text-white"
                      : "bg-surface text-muted hover:text-text"
                  }`}
                >
                  <span>{DAY_SHORT[d].charAt(0)}</span>
                  <span
                    className={`mt-1 h-1.5 w-1.5 rounded-full ${
                      isTodayChip
                        ? selected
                          ? "bg-white"
                          : "bg-accent"
                        : hasItems
                          ? selected
                            ? "bg-white/60"
                            : "bg-muted/40"
                          : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Heading + progress ring */}
          <div className="flex items-center justify-between gap-3 rounded-3xl border border-border bg-surface p-4 shadow-[var(--shadow)]">
            <div className="min-w-0">
              <h2 className="text-2xl font-extrabold tracking-tight">
                {isToday
                  ? "Pack for today"
                  : relativeDayLabel(viewDay) === "Tomorrow"
                    ? "Pack for tomorrow"
                    : DAY_LONG[viewDay]}
              </h2>
              <p className="text-sm text-muted">
                {isToday ? DAY_LONG[today] : relativeDayLabel(viewDay)}
                {dayItems.length > 0 && ` · ${packedCount}/${dayItems.length} packed`}
              </p>
            </div>
            {dayItems.length > 0 && (
              <div
                className="relative h-14 w-14 shrink-0"
                role="img"
                aria-label={`${packedCount} of ${dayItems.length} packed`}
              >
                <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90" aria-hidden>
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="var(--surface-2)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - ringPct)}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-sm font-bold">
                  {allPacked ? "🎒" : `${Math.round(ringPct * 100)}%`}
                </span>
              </div>
            )}
          </div>

          {allPacked && (
            <div className="animate-pop flex items-center gap-3 rounded-3xl border border-primary/30 bg-gradient-to-br from-teal-500/10 to-emerald-400/10 p-4">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-bold text-primary">
                  {isToday ? "All packed!" : `${DAY_LONG[viewDay]} is ready!`}
                </p>
                <p className="text-sm text-muted">
                  {isToday
                    ? bp.streak > 1
                      ? `${bp.streak}-day streak — you're on fire. 🔥`
                      : "You're ready for school. Go you."
                    : "Packed ahead — nice work."}
                </p>
              </div>
            </div>
          )}

          {/* List */}
          {dayItems.length === 0 ? (
            <EmptyDay isToday={isToday} onAdd={() => setEditing({})} />
          ) : (
            <ul className="space-y-2.5">
              {dayItems.map((it, i) => {
                const checked = selectedChecks.includes(it.id);
                return (
                  <li
                    key={it.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${Math.min(i * 45, 300)}ms` }}
                  >
                    <button
                      type="button"
                      onClick={() => check(it.id)}
                      aria-pressed={checked}
                      aria-label={`${it.name}, ${checked ? "packed" : "not packed"}`}
                      className={`flex w-full items-center gap-3 rounded-3xl border p-3.5 text-left shadow-[var(--shadow)] transition-all active:scale-[0.98] ${
                        checked
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-surface"
                      }`}
                    >
                      <span
                        aria-hidden
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-2 text-2xl"
                      >
                        {it.emoji}
                      </span>
                      <span
                        className={`flex-1 font-medium transition-colors ${
                          checked ? "text-muted line-through" : ""
                        }`}
                      >
                        {it.name}
                      </span>
                      <span
                        aria-hidden
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                          checked
                            ? "border-primary bg-primary text-primary-fg"
                            : "border-border text-transparent"
                        }`}
                      >
                        {checked && <CheckIcon className="h-4 w-4 animate-check" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ) : (
        <section className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight">Your items</h2>
            <button
              type="button"
              onClick={() => setEditing({})}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow)] active:scale-95"
            >
              <PlusIcon className="h-4 w-4" /> Add
            </button>
          </div>

          {/* Quick add */}
          {freshSuggestions.length > 0 && (
            <div className="rounded-3xl border border-border bg-surface p-3.5 shadow-[var(--shadow)]">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Quick add
              </p>
              <div className="flex flex-wrap gap-2">
                {freshSuggestions.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setEditing({ preset: s })}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium active:scale-95"
                  >
                    <span>{s.emoji}</span>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {bp.items.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border p-8 text-center text-muted">
              No items yet. Tap a <span className="font-semibold text-text">Quick add</span>{" "}
              above or <span className="font-semibold text-text">Add</span> your own.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {bp.items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-3 shadow-[var(--shadow)]"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-2 text-2xl">
                    {it.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{it.name}</p>
                    <p className="text-xs text-muted">{daysLabel(it.days)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing({ item: it })}
                    aria-label={`Edit ${it.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-text"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => doDelete(it)}
                    aria-label={`Delete ${it.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Undo snackbar */}
      {undo && (
        <div className="fixed inset-x-0 bottom-20 z-20 flex justify-center px-4">
          <div className="animate-pop flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2.5 shadow-[var(--shadow-lg)]">
            <span className="text-sm">
              Deleted <span className="font-semibold">{undo.item.name}</span>
            </span>
            <button
              type="button"
              onClick={doUndo}
              className="flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-sm font-bold text-primary active:scale-95"
            >
              <UndoIcon className="h-4 w-4" /> Undo
            </button>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg">
        <div className="mx-auto flex max-w-md">
          <TabButton
            label="Pack"
            active={tab === "pack"}
            badge={remainingToday}
            onClick={() => {
              setViewDay(todayIndex());
              setTab("pack");
            }}
            icon={<BackpackIcon className="h-5 w-5" />}
          />
          <TabButton
            label="Items"
            active={tab === "items"}
            onClick={() => setTab("items")}
            icon={<SettingsIcon className="h-5 w-5" />}
          />
        </div>
      </nav>

      {editing && (
        <ItemForm
          initial={editing.item}
          preset={editing.preset}
          onSave={(name, emoji, days) => {
            if (editing.item) bp.updateItem(editing.item.id, { name, emoji, days });
            else bp.addItem(name, emoji, days);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </main>
  );
}

function TabButton({
  label,
  active,
  onClick,
  icon,
  badge = 0,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors ${
        active ? "text-primary" : "text-muted"
      }`}
    >
      <span className="relative">
        {icon}
        {badge > 0 && (
          <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </span>
      {label}
    </button>
  );
}

function EmptyDay({ isToday, onAdd }: { isToday: boolean; onAdd: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-8 text-center">
      <p className="text-4xl">{isToday ? "🎉" : "😌"}</p>
      <p className="mt-2 font-semibold">
        {isToday ? "Nothing to pack today!" : "Nothing needed this day"}
      </p>
      <p className="mt-1 text-sm text-muted">
        Add items and pick the days you need them.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow)] active:scale-95"
      >
        <PlusIcon className="h-4 w-4" /> Add an item
      </button>
    </div>
  );
}

function daysLabel(days: DayIndex[]): string {
  if (days.length === 0) return "No days set";
  if (days.length === 7) return "Every day";
  const school = [1, 2, 3, 4, 5];
  if (days.length === 5 && school.every((d) => days.includes(d as DayIndex))) {
    return "Every school day";
  }
  return WEEK_ORDER.filter((d) => days.includes(d))
    .map((d) => DAY_SHORT[d])
    .join(" · ");
}
