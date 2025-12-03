import type { Profile } from "./types";

// Demo profile data - in production this would come from a database
export const DEMO_PROFILES: Record<string, Profile> = {
  ahmedgmurtaza: {
    username: "ahmedgmurtaza",
    displayName: "Ahmed G. Murtaza",
    description:
      "Software Engineer & Open Source Enthusiast. Building products that matter.",
    thumbnailUrl: "/professional-man-headshot.png",
    layout: "split",
    showCategories: false,
    theme: "system",
    links: [
      {
        id: "1",
        title: "Twitter / X",
        url: "https://x.com/ahmedgmurtaza",
        platform: "x",
        category: "social",
      },
      {
        id: "2",
        title: "LinkedIn",
        url: "https://linkedin.com/in/ahmedgmurtaza",
        platform: "linkedin",
        category: "professional",
      },
      {
        id: "3",
        title: "GitHub",
        url: "https://github.com/ahmedgmurtaza",
        platform: "github",
        category: "portfolio",
      },
      {
        id: "4",
        title: "Personal Website",
        url: "https://ahmedgmurtaza.com",
        platform: "website",
        category: "portfolio",
      },
      {
        id: "5",
        title: "Email Me",
        url: "mailto:hello@ahmedgmurtaza.com",
        platform: "email",
        category: "contact",
      },
      {
        id: "6",
        title: "Instagram",
        url: "https://instagram.com/ahmedgmurtaza",
        platform: "instagram",
        category: "social",
      },
      {
        id: "7",
        title: "Download Resume",
        url: "/files/resume.pdf",
        platform: "resume",
        category: "resources",
        isDownloadable: true,
      },
      {
        id: "8",
        title: "YouTube",
        url: "https://youtube.com/@ahmedgmurtaza",
        platform: "youtube",
        category: "video",
      },
    ],
  },
};

export function getProfile(username: string): Profile | null {
  return DEMO_PROFILES[username.toLowerCase()] || null;
}

export function getLinkByPlatform(
  username: string,
  platform: string
): string | null {
  const profile = getProfile(username);
  if (!profile) return null;

  // Normalize platform name using aliases (e.g., "twitter" -> "x")
  const normalizedPlatform =
    PLATFORM_ALIASES[platform.toLowerCase()] || platform.toLowerCase();

  const link = profile.links.find((l) => {
    const linkPlatform =
      PLATFORM_ALIASES[l.platform.toLowerCase()] || l.platform.toLowerCase();
    return linkPlatform === normalizedPlatform;
  });
  return link?.url || null;
}

// Platform aliases - map alternative names to canonical platform names
const PLATFORM_ALIASES: Record<string, string> = {
  twitter: "x",
  x: "x",
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
