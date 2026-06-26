export const HERO_BANNER_IDS = ["sale", "delivery", "halal", "spice"] as const;

export type HeroBannerId = (typeof HERO_BANNER_IDS)[number];

export interface HeroBannerConfig {
  id: HeroBannerId;
  href: string;
  gradient: string;
  pattern: string;
}

export const HERO_BANNERS: HeroBannerConfig[] = [
  {
    id: "sale",
    href: "/?category=meat",
    gradient: "from-emerald-700 via-emerald-600 to-teal-500",
    pattern: "bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25),transparent_50%)]",
  },
  {
    id: "delivery",
    href: "/?category=grocery",
    gradient: "from-amber-600 via-orange-500 to-orange-400",
    pattern: "bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.2),transparent_45%)]",
  },
  {
    id: "halal",
    href: "/",
    gradient: "from-blue-700 via-indigo-600 to-violet-600",
    pattern: "bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.18),transparent_50%)]",
  },
  {
    id: "spice",
    href: "/?category=spice",
    gradient: "from-rose-600 via-red-500 to-orange-500",
    pattern: "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.22),transparent_45%)]",
  },
];
