import platformsData from "./platforms-config.json";

export interface Category {
  id: string;
  title: string;
  description: string;
}

export interface Platform {
  id: string;
  title: string;
  category: string;
  color: string;
  gradient?: string;
  textColor: string;
  icon: string;
  urlPattern?: string;
  placeholder: string;
}

export interface PlatformsConfig {
  categories: Category[];
  platforms: Platform[];
}

// Type-safe config
export const platformsConfig: PlatformsConfig = platformsData as PlatformsConfig;

// Helper functions
export function getAllCategories(): Category[] {
  return platformsConfig.categories;
}

export function getAllPlatforms(): Platform[] {
  return platformsConfig.platforms;
}

export function getPlatformById(id: string): Platform | undefined {
  return platformsConfig.platforms.find(
    (p) => p.id.toLowerCase() === id.toLowerCase()
  );
}

export function getPlatformsByCategory(categoryId: string): Platform[] {
  return platformsConfig.platforms.filter((p) => p.category === categoryId);
}

export function getCategoryById(id: string): Category | undefined {
  return platformsConfig.categories.find((c) => c.id === id);
}

export function getPlatformColor(platformId: string): {
  color: string;
  textColor: string;
  gradient?: string;
} {
  const platform = getPlatformById(platformId);
  if (!platform) {
    return { color: "#6B7280", textColor: "#FFFFFF" };
  }
  return {
    color: platform.color,
    textColor: platform.textColor,
    gradient: platform.gradient,
  };
}

export function getPlatformTailwindClasses(platformId: string): {
  bg: string;
  text: string;
} {
  const platform = getPlatformById(platformId);
  if (!platform) {
    return { bg: "bg-gray-500", text: "text-white" };
  }

  // Handle gradient
  if (platform.gradient) {
    return {
      bg: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
      text: "text-white",
    };
  }

  // Handle solid colors
  return {
    bg: `bg-[${platform.color}]`,
    text: platform.textColor === "#FFFFFF" ? "text-white" : "text-black",
  };
}

// Get platform by URL pattern matching
export function detectPlatformFromUrl(url: string): Platform | undefined {
  const lowerUrl = url.toLowerCase();
  return platformsConfig.platforms.find(
    (p) => p.urlPattern && lowerUrl.includes(p.urlPattern.toLowerCase())
  );
}

// Export for backwards compatibility
export const PLATFORM_COLORS = platformsConfig.platforms.reduce(
  (acc, platform) => {
    acc[platform.id.toLowerCase()] = {
      bg: platform.gradient
        ? "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]"
        : `bg-[${platform.color}]`,
      text: platform.textColor === "#FFFFFF" ? "text-white" : "text-black",
    };
    return acc;
  },
  {} as Record<string, { bg: string; text: string }>
);
