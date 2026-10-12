import Link from "next/link";
import { Header } from "@/components/Header";

const sampleDrug = {
  name: "PARACETAMOL",
  category: "NSAID",
  mechanism: "Anilinek (Központi hatású)",
  indication:
    "Enyhe-közepes fájdalom, lázcsillapítás — terheseknek, gyerekeknek és gyomorfekélyeseknek első választandó szer.",
  side_effects:
    "Súlyos hepatotoxicitás túladagoláskor (NAPQI metabolit felhalmozódás, antidótuma: N-acetilcisztein).",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="mx-auto max-w-3xl px-6">
        {/* Hero */}
        <section className="border-b border-rule py-16">
          <p className="font-sans text-sm tracking-wide text-muted">
            SOTE gyógyszertan · 1089 hatóanyag
          </p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl font-semibold leading-tight text-ink">
            Legyél 5-ös gyógyszertanból.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Minden hatóanyag egy helyen: mechanizmus, javallat és mellékhatás —
            kategóriák szerint szűrve, saját haladással.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/signup"
              className="rounded-sm bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent-ink transition-colors"
            >
              Ingyenes regisztráció
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-ink hover:text-accent transition-colors"
            >
              Már van fiókom
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            Az első 20 hatóanyag ingyenes, bejelentkezés után azonnal elérhető.
          </p>
        </section>

        {/* Sample monograph card */}
        <section className="py-16">
          <p className="mb-4 text-sm text-muted">Egy kártya így néz ki</p>
          <article className="rounded-sm border border-rule bg-paper-raised p-8">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                {sampleDrug.name}
              </h2>
              <span className="text-xs text-muted">{sampleDrug.category}</span>
            </div>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-xs font-medium text-accent-ink">
                  Mechanizmus
                </dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-ink">
                  {sampleDrug.mechanism}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-accent-ink">
                  Javallat
                </dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-ink">
                  {sampleDrug.indication}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-accent-ink">
                  Mellékhatás
                </dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-ink">
                  {sampleDrug.side_effects}
                </dd>
              </div>
            </dl>
          </article>
        </section>

        {/* Value props, same field-label language as the card above */}
        <section className="grid grid-cols-1 gap-8 border-t border-rule py-16 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-accent-ink">Hozzáférés</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink">
              20 hatóanyag ingyen, a teljes 1089-hez előfizetés kell.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-accent-ink">Szűrés</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink">
              Kategóriánként gyakorolhatsz — csak azt tanulod, ami aktuális.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-accent-ink">Haladás</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink">
              A fiókodhoz kötve — bármelyik eszközön ott folytatod, ahol abbahagytad.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule py-8">
        <div className="mx-auto max-w-3xl px-6 text-sm text-muted">
          Hatóanyag Mester · SOTE gyógyszertan vizsgakártyák
        </div>
      </footer>
    </div>
  );
}
