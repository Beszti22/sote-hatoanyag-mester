import Link from "next/link";
import { Header } from "@/components/Header";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="mx-auto max-w-sm px-6 py-20 text-center">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          A link már nem érvényes
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          A megerősítő link lejárt, vagy már felhasználtad. Kérj egy újat, vagy
          jelentkezz be, ha a fiókod már aktív.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/signup"
            className="rounded-sm bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent-ink transition-colors"
          >
            Új regisztráció
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-ink hover:text-accent transition-colors"
          >
            Bejelentkezés
          </Link>
        </div>
      </div>
    </div>
  );
}
