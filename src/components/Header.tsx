import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-serif text-lg font-semibold text-ink">
          Hatóanyag Mester
        </Link>
        <nav className="flex items-center gap-5">
          <Link href="/learn" className="text-sm text-muted hover:text-ink transition-colors">
            Tanulás
          </Link>
          {user ? (
            <>
              <span className="text-sm text-muted">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-muted hover:text-ink transition-colors">
                Bejelentkezés
              </Link>
              <Link
                href="/signup"
                className="rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-ink transition-colors"
              >
                Regisztráció
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
