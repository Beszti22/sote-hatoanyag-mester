"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setNotice(
        "Sikeres regisztráció. Ha szükséges, erősítsd meg az e-mail-címed a kiküldött levélben, majd jelentkezz be."
      );
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/learn");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-serif text-3xl font-semibold text-ink">
        {mode === "login" ? "Bejelentkezés" : "Regisztráció"}
      </h1>
      <p className="mt-2 text-[15px] text-muted">
        {mode === "login"
          ? "Folytasd a tanulást ott, ahol abbahagytad."
          : "Hozz létre egy fiókot — az első 20 hatóanyag ingyen elérhető."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="text-xs font-medium text-accent-ink">
            E-mail cím
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-sm border border-rule bg-paper-raised px-3 py-2 text-[15px] text-ink outline-none focus-visible:border-accent"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-xs font-medium text-accent-ink"
          >
            Jelszó
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-sm border border-rule bg-paper-raised px-3 py-2 text-[15px] text-ink outline-none focus-visible:border-accent"
          />
        </div>

        {error && (
          <p className="rounded-sm bg-danger-soft px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-sm bg-accent-soft px-3 py-2 text-sm text-accent-ink">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-ink disabled:opacity-60"
        >
          {loading
            ? "Folyamatban…"
            : mode === "login"
            ? "Bejelentkezés"
            : "Fiók létrehozása"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {mode === "login" ? (
          <>
            Nincs még fiókod?{" "}
            <Link href="/signup" className="text-accent-ink hover:underline">
              Regisztrálj
            </Link>
          </>
        ) : (
          <>
            Már van fiókod?{" "}
            <Link href="/login" className="text-accent-ink hover:underline">
              Jelentkezz be
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
