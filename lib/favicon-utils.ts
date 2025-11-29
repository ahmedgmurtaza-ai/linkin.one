export function getFaviconUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Use Google's favicon service as fallback
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}

export function isWebsiteLink(platform: string): boolean {
  const websitePlatforms = ["website", "default", "other", "link"];
  return websitePlatforms.includes(platform.toLowerCase());
}
