"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useBackpack } from "../hooks/useBackpack";
import type { DayIndex, Item } from "../lib/types";
import { DAY_LONG, DAY_SHORT, todayIndex, WEEK_ORDER } from "../lib/days";
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
type Editing = { item?: Item } | null;
type Undo = { item: Item; index: number } | null;

export default function Page() {
  const bp = useBackpack();
  const [tab, setTab] = useState<Tab>("pack");
  const [viewDay, setViewDay] = useState<DayIndex>(todayIndex());
  const [editing, setEditing] = useState<Editing>(null);
  const [undo, setUndo] = useState<Undo>(null);
  const [confetti, setConfetti] = useState(0);
  const wasPacked = useRef(false);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const today = todayIndex();
  const isToday = viewDay === today;

  const dayItems = useMemo(
    () => bp.items.filter((it) => it.days.includes(viewDay)),
    [bp.items, viewDay]
  );

  const packedCount = isToday
    ? dayItems.filter((it) => bp.checkedIds.includes(it.id)).length
    : 0;
  const allPacked = isToday && dayItems.length > 0 && packedCount === dayItems.length;

  // Fire confetti + a buzz the moment today's list becomes complete.
  useEffect(() => {
    if (allPacked && !wasPacked.current) {
      setConfetti((c) => c + 1);
      navigator.vibrate?.([12, 40, 18]);
    }
    wasPacked.current = allPacked;
  }, [allPacked]);

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
    bp.toggleCheck(id);
  };

  // Avoid a flash of default content before localStorage hydrates.
  if (!bp.loaded) {
    return <main className="min-h-dvh" aria-busy />;
  }

  const ringPct = dayItems.length ? packedCount / dayItems.length : 0;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-4 pb-28 pt-5">
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
                {isToday ? "Pack for today" : DAY_LONG[viewDay]}
              </h2>
              <p className="text-sm text-muted">
                {isToday ? DAY_LONG[today] : "Pack the night before"}
                {dayItems.length > 0 && (
                  <>
                    {" · "}
                    {isToday
                      ? `${packedCount}/${dayItems.length} packed`
                      : `${dayItems.length} ${dayItems.length === 1 ? "thing" : "things"}`}
                  </>
                )}
              </p>
            </div>
            {isToday && dayItems.length > 0 && (
              <div className="relative h-14 w-14 shrink-0">
                <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
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
                <p className="font-bold text-primary">All packed!</p>
                <p className="text-sm text-muted">
                  {bp.streak > 1
                    ? `${bp.streak}-day streak — you're on fire. 🔥`
                    : "You're ready for school. Go you."}
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
                const checked = isToday && bp.checkedIds.includes(it.id);
                return (
                  <li
                    key={it.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${Math.min(i * 45, 300)}ms` }}
                  >
                    <button
                      type="button"
                      disabled={!isToday}
                      onClick={() => check(it.id)}
                      className={`flex w-full items-center gap-3 rounded-3xl border p-3.5 text-left shadow-[var(--shadow)] transition-all ${
                        checked
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-surface"
                      } ${isToday ? "active:scale-[0.98]" : "opacity-90"}`}
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-2 text-2xl">
                        {it.emoji}
                      </span>
                      <span
                        className={`flex-1 font-medium transition-colors ${
                          checked ? "text-muted line-through" : ""
                        }`}
                      >
                        {it.name}
                      </span>
                      {isToday && (
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                            checked
                              ? "border-primary bg-primary text-primary-fg"
                              : "border-border text-transparent"
                          }`}
                        >
                          {checked && <CheckIcon className="h-4 w-4 animate-check" />}
                        </span>
                      )}
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

          {bp.items.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border p-8 text-center text-muted">
              No items yet. Tap <span className="font-semibold text-text">Add</span> to
              build your packing list.
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
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-md">
          <TabButton
            label="Pack"
            active={tab === "pack"}
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
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors ${
        active ? "text-primary" : "text-muted"
      }`}
    >
      {icon}
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
