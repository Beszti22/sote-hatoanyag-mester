# Hatóanyag Mester — SOTE gyógyszertan vizsgakártyák

Előfizetéses gyógyszertan-kártya alkalmazás SOTE orvostanhallgatóknak. Next.js (App Router) + Supabase (auth, Postgres, RLS). Az első 20 hatóanyag mindenki számára ingyenes, a teljes 1089-es adatbázis előfizetéssel érhető el.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4)
- **Supabase** — email/jelszavas auth, Postgres, Row Level Security a hozzáférés-vezérléshez
- **Vercel** — hosting / CI
- *(2. fázis)* **Stripe** — előfizetések (havi / féléves / éves)

## Hozzáférés-vezérlés (fontos)

A hatóanyagok adatai **nem** a kliens kódjában vannak (ellentétben az eredeti statikus HTML-lel) — a `drugs` tábla Row Level Security policy-i döntik el szerver oldalon, ki mit láthat:

- bárki (bejelentkezés nélkül is) olvashatja az `is_free = true` sorokat,
- bejelentkezett, aktív előfizetéssel rendelkező felhasználó az összes sort olvashatja.

Lásd: `supabase/migrations/0001_init.sql`.

## Fejlesztői indítás

```bash
npm install
cp .env.local.example .env.local   # töltsd ki a Supabase projekt adataival
npm run dev
```

## Supabase beállítás

1. Hozz létre egy Supabase projektet.
2. Futtasd le a `supabase/migrations/` alatti SQL fájlokat (SQL editor vagy `supabase db push`), sorrendben: séma, majd a seed adatok.
3. Másold a Project Settings → API alatti URL-t és anon kulcsot a `.env.local`-ba.

A seed adat forrása: `scripts/extract-drugs.mjs` + `scripts/build-seed.mjs` dolgozza fel az eredeti tanulókártya-exportot `supabase/seed/drugs-seed.json`-ná, amiből a `scripts/generate-seed-sql.mjs` generálja az insert migrációt.

## Fázisok

1. ✅ Next.js váz, auth, ingyenes 20 kártya éles oldalon.
2. ⏳ Stripe előfizetés (havi / féléves / éves), webhook → `subscriptions` tábla szinkron.
