export type LinkCategory = "social" | "business" | "personal"

export type ProfileLayout = "classic" | "split" | "grid"

export type LinkType = "url" | "file"

export interface ProfileLink {
  id: string
  title: string
  url: string
  platform: string
  category: LinkCategory
  icon?: string
  isDownloadable?: boolean
  linkType?: LinkType
  clicks?: number
  downloads?: number
}

export interface ProfileAnalytics {
  totalClicks: number
  totalDownloads: number
  linkStats: Record<string, { clicks: number; downloads: number }>
}

export interface Profile {
  username: string
  displayName: string
  description: string
  thumbnailUrl: string
  links: ProfileLink[]
  layout: ProfileLayout
  analytics?: ProfileAnalytics
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
}

export const CATEGORY_LABELS: Record<LinkCategory, string> = {
  social: "Social Media",
  business: "Business",
  personal: "Personal",
}

export const LAYOUT_OPTIONS: { value: ProfileLayout; label: string; description: string }[] = [
  { value: "classic", label: "Classic", description: "Vertical list with categories" },
  { value: "split", label: "Split", description: "Profile left, links right" },
  { value: "grid", label: "Grid", description: "Links in 2-column grid" },
]
