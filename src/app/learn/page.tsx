import Link from "next/link";
import { Header } from "@/components/Header";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionStatus } from "@/lib/access";
import type { Drug, DrugWithProgress } from "@/lib/types";

const TOTAL_DRUG_COUNT = 1089;
const FREE_DRUG_COUNT = 20;

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const subscriptionStatus = await getSubscriptionStatus(user?.id ?? null);
  const isSubscribed = subscriptionStatus === "active";

  let query = supabase
    .from("drugs")
    .select("id, category, name, mechanism, side_effects, indication, is_free, sort_order")
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: drugRows } = await query;
  const drugs = (drugRows ?? []) as Drug[];

  const { data: categoryRows } = await supabase
    .from("drugs")
    .select("category")
    .order("category", { ascending: true });
  const categories = Array.from(
    new Set((categoryRows ?? []).map((r) => r.category as string))
  ).sort((a, b) => a.localeCompare(b, "hu"));

  let learnedIds = new Set<string>();
  if (user) {
    const { data: progressRows } = await supabase
      .from("user_progress")
      .select("drug_id, learned")
      .eq("user_id", user.id)
      .eq("learned", true);
    learnedIds = new Set((progressRows ?? []).map((r) => r.drug_id as string));
  }

  const drugsWithProgress: DrugWithProgress[] = drugs.map((d) => ({
    ...d,
    learned: learnedIds.has(d.id),
  }));

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-serif text-3xl font-semibold text-ink">Tanulás</h1>

        {!isSubscribed && (
          <div className="mt-4 rounded-sm border border-rule bg-accent-soft px-5 py-4">
            <p className="text-[15px] text-accent-ink">
              {user
                ? `Jelenleg ${FREE_DRUG_COUNT} ingyenes hatóanyaghoz férsz hozzá a teljes ${TOTAL_DRUG_COUNT}-ből.`
                : `Az első ${FREE_DRUG_COUNT} hatóanyag regisztráció nélkül is elérhető. Jelentkezz be a haladásod mentéséhez.`}{" "}
              <Link href="/signup" className="font-medium underline">
                Előfizetek a teljes anyagra
              </Link>
            </p>
          </div>
        )}

        <div className="mt-8">
          <FlashcardDeck
            drugs={drugsWithProgress}
            categories={categories}
            activeCategory={category ?? null}
            userId={user?.id ?? null}
          />
        </div>
      </main>
    </div>
  );
}
