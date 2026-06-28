"use client";

import { useMemo, useState } from "react";
import { useBackpack } from "../hooks/useBackpack";
import type { DayIndex, Item } from "../lib/types";
import { DAY_LONG, DAY_SHORT, todayIndex, WEEK_ORDER } from "../lib/days";
import { Header } from "../components/Header";
import { ItemForm } from "../components/ItemForm";
import {
  BackpackIcon,
  CheckIcon,
  PencilIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
} from "../components/Icons";

type Tab = "pack" | "items";
type Editing = { item?: Item } | null;

export default function Page() {
  const bp = useBackpack();
  const [tab, setTab] = useState<Tab>("pack");
  const [viewDay, setViewDay] = useState<DayIndex>(todayIndex());
  const [editing, setEditing] = useState<Editing>(null);

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

  // Avoid a flash of default content before localStorage hydrates.
  if (!bp.loaded) {
    return <main className="min-h-dvh" aria-busy />;
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-4 pb-28 pt-5">
      <Header />

      {tab === "pack" ? (
        <section className="mt-5 space-y-4">
          {/* Day selector */}
          <div className="grid grid-cols-7 gap-1.5">
            {WEEK_ORDER.map((d) => {
              const selected = d === viewDay;
              const isTodayChip = d === today;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setViewDay(d)}
                  className={`flex flex-col items-center rounded-xl py-2 text-xs font-semibold transition-colors ${
                    selected
                      ? "bg-primary text-primary-fg"
                      : "bg-surface text-muted hover:text-text"
                  }`}
                >
                  <span>{DAY_SHORT[d].charAt(0)}</span>
                  <span
                    className={`mt-1 h-1.5 w-1.5 rounded-full ${
                      isTodayChip
                        ? selected
                          ? "bg-primary-fg"
                          : "bg-accent"
                        : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Heading + progress */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isToday ? "Pack for today" : `Packing for ${DAY_LONG[viewDay]}`}
            </h2>
            <p className="text-sm text-muted">
              {isToday ? DAY_LONG[today] : "Get a head start the night before"}
              {dayItems.length > 0 && (
                <>
                  {" · "}
                  {isToday
                    ? `${packedCount} of ${dayItems.length} packed`
                    : `${dayItems.length} ${dayItems.length === 1 ? "thing" : "things"}`}
                </>
              )}
            </p>
            {isToday && dayItems.length > 0 && (
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${(packedCount / dayItems.length) * 100}%` }}
                />
              </div>
            )}
          </div>

          {allPacked && (
            <div className="animate-pop flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
              <span className="text-3xl">🎒</span>
              <div>
                <p className="font-bold text-primary">All packed!</p>
                <p className="text-sm text-muted">You&apos;re ready for school. Go you.</p>
              </div>
            </div>
          )}

          {/* List */}
          {dayItems.length === 0 ? (
            <EmptyDay isToday={isToday} onAdd={() => setEditing({})} />
          ) : (
            <ul className="space-y-2">
              {dayItems.map((it) => {
                const checked = isToday && bp.checkedIds.includes(it.id);
                return (
                  <li key={it.id}>
                    <button
                      type="button"
                      disabled={!isToday}
                      onClick={() => bp.toggleCheck(it.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
                        checked
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-surface"
                      } ${isToday ? "active:scale-[0.99]" : "opacity-90"}`}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-2xl">
                        {it.emoji}
                      </span>
                      <span
                        className={`flex-1 font-medium ${
                          checked ? "text-muted line-through" : ""
                        }`}
                      >
                        {it.name}
                      </span>
                      {isToday && (
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                            checked
                              ? "border-primary bg-primary text-primary-fg"
                              : "border-border text-transparent"
                          }`}
                        >
                          <CheckIcon className="h-4 w-4" />
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
            <h2 className="text-2xl font-bold tracking-tight">Your items</h2>
            <button
              type="button"
              onClick={() => setEditing({})}
              className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-primary-fg shadow-sm"
            >
              <PlusIcon className="h-4 w-4" /> Add
            </button>
          </div>

          {bp.items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
              No items yet. Tap <span className="font-semibold text-text">Add</span> to
              build your packing list.
            </p>
          ) : (
            <ul className="space-y-2">
              {bp.items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-2xl">
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
                    className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-text"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => bp.removeItem(it.id)}
                    aria-label={`Delete ${it.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface/90 backdrop-blur">
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
    <div className="rounded-2xl border border-dashed border-border p-8 text-center">
      <p className="text-4xl">🎉</p>
      <p className="mt-2 font-semibold">
        {isToday ? "Nothing to pack today!" : "Nothing needed this day"}
      </p>
      <p className="mt-1 text-sm text-muted">
        Add items and pick the days you need them.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-fg"
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
  if (
    days.length === 5 &&
    school.every((d) => days.includes(d as DayIndex))
  ) {
    return "Every school day";
  }
  return WEEK_ORDER.filter((d) => days.includes(d))
    .map((d) => DAY_SHORT[d])
    .join(" · ");
}
