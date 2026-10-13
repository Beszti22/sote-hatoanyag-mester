"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

type Rule = {
  label: string;
  test: (password: string) => boolean;
};

const PASSWORD_RULES: Rule[] = [
  { label: "Legalább 8 karakter", test: (p) => p.length >= 8 },
  { label: "Legalább egy nagybetű (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Legalább egy kisbetű (a–z)", test: (p) => /[a-z]/.test(p) },
  { label: "Legalább egy szám (0–9)", test: (p) => /[0-9]/.test(p) },
  {
    label: "Legalább egy speciális karakter (pl. ! ? # %)",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

function CheckIcon({ ok }: { ok: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
        ok ? "bg-accent text-white" : "border border-rule text-transparent"
      }`}
    >
      ✓
    </span>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const failedRules = useMemo(
    () => PASSWORD_RULES.filter((rule) => !rule.test(password)),
    [password]
  );
  const passwordValid = failedRules.length === 0;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (mode === "signup") {
      if (name.trim().length === 0) {
        setError("Add meg a neved.");
        return;
      }
      if (!passwordValid) {
        setError("A jelszó nem felel meg minden feltételnek.");
        return;
      }
      if (!passwordsMatch) {
        setError("A két jelszó nem egyezik.");
        return;
      }

      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() },
        },
      });
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

    setLoading(true);
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
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="text-xs font-medium text-accent-ink">
              Név
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-sm border border-rule bg-paper-raised px-3 py-2 text-[15px] text-ink outline-none focus-visible:border-accent"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="text-xs font-medium text-accent-ink">
            E-mail cím
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-sm border border-rule bg-paper-raised px-3 py-2 text-[15px] text-ink outline-none focus-visible:border-accent"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs font-medium text-accent-ink">
            Jelszó
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={mode === "signup" ? 8 : 6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            aria-describedby={mode === "signup" ? "password-rules" : undefined}
            className="mt-1 w-full rounded-sm border border-rule bg-paper-raised px-3 py-2 text-[15px] text-ink outline-none focus-visible:border-accent"
          />

          {mode === "signup" && (passwordTouched || password.length > 0) && (
            <ul id="password-rules" className="mt-3 space-y-1.5">
              {PASSWORD_RULES.map((rule) => {
                const ok = rule.test(password);
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-[13px] ${
                      ok ? "text-ink" : "text-muted"
                    }`}
                  >
                    <CheckIcon ok={ok} />
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {mode === "signup" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="text-xs font-medium text-accent-ink"
            >
              Jelszó megerősítése
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setConfirmTouched(true)}
              className="mt-1 w-full rounded-sm border border-rule bg-paper-raised px-3 py-2 text-[15px] text-ink outline-none focus-visible:border-accent"
            />
            {confirmTouched && confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-1.5 text-[13px] text-danger">
                A két jelszó nem egyezik.
              </p>
            )}
          </div>
        )}

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
