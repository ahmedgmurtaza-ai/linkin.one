export type LinkCategory =
  | "social"
  | "professional"
  | "portfolio"
  | "content"
  | "shop"
  | "music"
  | "video"
  | "contact"
  | "resources"
  | "others";

export type ProfileLayout = "classic" | "split" | "grid";

export type ProfileTheme = "light" | "dark" | "system";

export type LinkType = "url" | "file";

export interface ProfileLink {
  id: string;
  title: string;
  url: string;
  platform: string;
  category: LinkCategory;
  icon?: string;
  isDownloadable?: boolean;
  linkType?: LinkType;
  clicks?: number;
  downloads?: number;
}

export interface ProfileAnalytics {
  totalClicks: number;
  totalDownloads: number;
  linkStats: Record<string, { clicks: number; downloads: number }>;
}

export interface Profile {
  username: string;
  displayName: string;
  description: string;
  thumbnailUrl: string;
  links: ProfileLink[];
  layout: ProfileLayout;
  showCategories?: boolean;
  theme?: ProfileTheme;
  analytics?: ProfileAnalytics;
}

export const PLATFORM_ICONS: Record<string, string> = {
  twitter: "X",
  x: "X",
  linkedin: "in",
  github: "GH",
  instagram: "IG",
  youtube: "YT",
  tiktok: "TT",
  facebook: "FB",
  website: "WEB",
  email: "@",
  dribbble: "DR",
  behance: "BE",
  medium: "M",
  substack: "SS",
  discord: "DC",
  telegram: "TG",
  whatsapp: "WA",
  spotify: "SP",
  resume: "CV",
  pdf: "PDF",
  file: "FL",
  default: "LK",
};

export const CATEGORY_LABELS: Record<LinkCategory, string> = {
  social: "Social Media",
  professional: "Professional",
  portfolio: "Portfolio & Work",
  content: "Content & Blog",
  shop: "Shop & Products",
  music: "Music & Audio",
  video: "Video & Streaming",
  contact: "Contact & Booking",
  resources: "Resources & Downloads",
  others: "Other Links",
};

export const LAYOUT_OPTIONS: {
  value: ProfileLayout;
  label: string;
  description: string;
}[] = [
  {
    value: "classic",
    label: "Classic",
    description: "Vertical list with categories",
  },
  { value: "split", label: "Split", description: "Profile left, links right" },
  { value: "grid", label: "Grid", description: "Links in 2-column grid" },
];

// Platform to category mapping - auto-assign categories based on platform
export const PLATFORM_CATEGORY_MAP: Record<string, LinkCategory> = {
  // Social Media
  x: "social",
  twitter: "social",
  instagram: "social",
  facebook: "social",
  tiktok: "social",
  snapchat: "social",
  discord: "social",
  telegram: "social",

  // Professional
  linkedin: "professional",

  // Portfolio & Work
  github: "portfolio",
  dribbble: "portfolio",
  behance: "portfolio",

  // Content & Blog
  medium: "content",
  substack: "content",
  devto: "content",
  hashnode: "content",

  // Music & Audio
  spotify: "music",
  soundcloud: "music",
  applemusic: "music",

  // Video & Streaming
  youtube: "video",
  twitch: "video",
  vimeo: "video",

  // Contact & Booking
  email: "contact",
  whatsapp: "contact",
  calendly: "contact",

  // Resources & Downloads
  resume: "resources",
  pdf: "resources",
  file: "resources",

  // Others (default)
  website: "others",
};
