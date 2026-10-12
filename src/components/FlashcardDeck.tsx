"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DrugWithProgress } from "@/lib/types";

const FIELD_LABELS = {
  mechanism: "Mechanizmus",
  indication: "Javallat",
  side_effects: "Mellékhatás",
} as const;

export function FlashcardDeck({
  drugs,
  categories,
  activeCategory,
  userId,
}: {
  drugs: DrugWithProgress[];
  categories: string[];
  activeCategory: string | null;
  userId: string | null;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learnedById, setLearnedById] = useState<Record<string, boolean>>(
    () => Object.fromEntries(drugs.map((d) => [d.id, d.learned]))
  );
  const [saving, setSaving] = useState(false);

  const current = drugs[index];
  const learnedCount = Object.values(learnedById).filter(Boolean).length;

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => Math.min(Math.max(i + delta, 0), drugs.length - 1));
  }

  function selectCategory(category: string) {
    const params = new URLSearchParams(window.location.search);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    window.location.search = params.toString();
  }

  async function toggleLearned() {
    if (!userId || !current) return;
    const next = !learnedById[current.id];
    setLearnedById((prev) => ({ ...prev, [current.id]: next }));
    setSaving(true);
    await supabase
      .from("user_progress")
      .upsert(
        { user_id: userId, drug_id: current.id, learned: next },
        { onConflict: "user_id,drug_id" }
      );
    setSaving(false);
  }

  if (drugs.length === 0) {
    return (
      <p className="text-[15px] text-muted">
        Ebben a kategóriában nincs elérhető kártya a jelenlegi hozzáférési
        szinteden.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <select
          value={activeCategory ?? ""}
          onChange={(e) => selectCategory(e.target.value)}
          className="rounded-sm border border-rule bg-paper-raised px-3 py-2 text-sm text-ink"
        >
          <option value="">Összes kategória</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <p className="text-sm text-muted">
          {index + 1}. / {drugs.length} kártya
          {userId && <> · {learnedCount} megtanulva</>}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="mt-6 block w-full rounded-sm border border-rule bg-paper-raised p-8 text-left"
      >
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            {current.name}
          </h2>
          <span className="text-xs text-muted">{current.category}</span>
        </div>

        {!flipped ? (
          <p className="mt-8 text-sm text-muted">
            Koppints a kártyára a válasz megjelenítéséhez.
          </p>
        ) : (
          <dl className="mt-6 space-y-5">
            {(["mechanism", "indication", "side_effects"] as const).map(
              (field) =>
                current[field] ? (
                  <div key={field}>
                    <dt className="text-xs font-medium text-accent-ink">
                      {FIELD_LABELS[field]}
                    </dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-ink">
                      {current[field]}
                    </dd>
                  </div>
                ) : null
            )}
          </dl>
        )}
      </button>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            className="rounded-sm border border-rule px-4 py-2 text-sm text-ink hover:border-accent disabled:opacity-40"
          >
            Előző
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === drugs.length - 1}
            className="rounded-sm border border-rule px-4 py-2 text-sm text-ink hover:border-accent disabled:opacity-40"
          >
            Következő
          </button>
        </div>

        {userId && (
          <button
            type="button"
            onClick={toggleLearned}
            disabled={saving}
            className={
              learnedById[current.id]
                ? "rounded-sm bg-accent-soft px-4 py-2 text-sm font-medium text-accent-ink"
                : "rounded-sm border border-rule px-4 py-2 text-sm text-ink hover:border-accent"
            }
          >
            {learnedById[current.id] ? "Megtanulva ✓" : "Megjelölöm tanultnak"}
          </button>
        )}
      </div>
    </div>
  );
}
