import Link from "next/link";
import { SUBJECTS } from "@/lib/subjects";

/**
 * Subject switcher — shown on the landing page and above each subject's
 * learning view. Only one subject is active today (hatástan); the
 * rest render as disabled "Hamarosan" tabs so visitors see the roadmap.
 */
export function SubjectTabs({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav aria-label="Tantárgyak" className="flex flex-wrap gap-2">
      {SUBJECTS.map((subject) => {
        const isActive = subject.slug === activeSlug;
        const isDisabled = subject.status === "coming_soon";

        const baseClasses =
          "flex items-center gap-2 rounded-sm border px-4 py-2 text-sm transition-colors";

        if (isDisabled) {
          return (
            <span
              key={subject.slug}
              aria-disabled="true"
              className={`${baseClasses} cursor-default border-rule bg-paper text-muted opacity-60`}
            >
              <span aria-hidden="true">{subject.icon}</span>
              {subject.name}
              <span className="text-xs text-muted">· hamarosan</span>
            </span>
          );
        }

        return (
          <Link
            key={subject.slug}
            href={subject.href}
            className={`${baseClasses} ${
              isActive
                ? "border-accent bg-accent-soft font-medium text-accent-ink"
                : "border-rule bg-paper-raised text-ink hover:border-accent"
            }`}
          >
            <span aria-hidden="true">{subject.icon}</span>
            {subject.name}
          </Link>
        );
      })}
    </nav>
  );
}
