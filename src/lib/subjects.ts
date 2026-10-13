export type Subject = {
  slug: string;
  name: string;
  /** Short description shown only where there's room (landing page cards). */
  tagline: string;
  icon: string;
  href: string;
  status: "active" | "coming_soon";
};

/**
 * The subject catalog that drives the subject-switcher tabs across the
 * site. Tudástár starts with gyógyszertan as the one real, populated
 * subject — everything else here is a placeholder so visitors can see
 * where the platform is headed. When a new subject gets real content,
 * flip its status to "active" and point href at its own /learn route.
 */
export const SUBJECTS: Subject[] = [
  {
    slug: "gyogyszertan",
    name: "Gyógyszertan",
    tagline: "1089 hatóanyag — mechanizmus, javallat, mellékhatás",
    icon: "💊",
    href: "/learn",
    status: "active",
  },
  {
    slug: "anatomia",
    name: "Anatómia",
    tagline: "Hamarosan",
    icon: "🦴",
    href: "#",
    status: "coming_soon",
  },
  {
    slug: "elettan",
    name: "Élettan",
    tagline: "Hamarosan",
    icon: "🫀",
    href: "#",
    status: "coming_soon",
  },
];
