import { createClient } from "./supabase/server";
import type { Profile, ProfileLink } from "./types";

// Database types
export interface DbProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  description: string | null;
  thumbnail_url: string | null;
  layout: string;
  show_categories: boolean;
  theme: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbLink {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  platform: string;
  category: string;
  icon: string | null;
  is_downloadable: boolean;
  link_type: string;
  position: number;
  created_at: string;
  updated_at: string;
}

// Convert database profile to app profile
function dbProfileToProfile(dbProfile: DbProfile, links: DbLink[]): Profile {
  return {
    username: dbProfile.username,
    displayName: dbProfile.display_name,
    description: dbProfile.description || "",
    thumbnailUrl: dbProfile.thumbnail_url || "",
    layout: dbProfile.layout as any,
    showCategories: dbProfile.show_categories || false,
    theme: (dbProfile.theme as any) || "system",
    links: links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      platform: link.platform,
      category: link.category as any,
      icon: link.icon || undefined,
      isDownloadable: link.is_downloadable,
      linkType: link.link_type as any,
    })),
  };
}

// Get profile by username (public)
export async function getProfileByUsername(
  username: string
): Promise<Profile | null> {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .single();

  if (profileError || !profile) {
    return null;
  }

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profile.id)
    .order("position", { ascending: true });

  if (linksError) {
    return null;
  }

  return dbProfileToProfile(profile, links || []);
}

// Get profile by user ID (authenticated)
export async function getProfileByUserId(
  userId: string
): Promise<Profile | null> {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (profileError || !profile) {
    return null;
  }

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profile.id)
    .order("position", { ascending: true });

  if (linksError) {
    return null;
  }

  return dbProfileToProfile(profile, links || []);
}

// Get current user's profile
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return getProfileByUserId(user.id);
}

// Update profile
export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get profile ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const dbUpdates: any = {};
  if (updates.username !== undefined)
    dbUpdates.username = updates.username.toLowerCase();
  if (updates.displayName !== undefined)
    dbUpdates.display_name = updates.displayName;
  if (updates.description !== undefined)
    dbUpdates.description = updates.description;
  if (updates.thumbnailUrl !== undefined)
    dbUpdates.thumbnail_url = updates.thumbnailUrl;
  if (updates.layout !== undefined) dbUpdates.layout = updates.layout;
  if (updates.showCategories !== undefined)
    dbUpdates.show_categories = updates.showCategories;
  if (updates.theme !== undefined) dbUpdates.theme = updates.theme;

  const { error } = await supabase
    .from("profiles")
    .update(dbUpdates)
    .eq("id", profile.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Add link
export async function addLink(
  userId: string,
  link: Omit<ProfileLink, "id">
): Promise<{ success: boolean; error?: string; linkId?: string }> {
  const supabase = await createClient();

  // Get profile ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Get max position
  const { data: maxPosLink } = await supabase
    .from("links")
    .select("position")
    .eq("profile_id", profile.id)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const position = maxPosLink ? maxPosLink.position + 1 : 0;

  const { data, error } = await supabase
    .from("links")
    .insert({
      profile_id: profile.id,
      title: link.title,
      url: link.url,
      platform: link.platform,
      category: link.category,
      icon: link.icon,
      is_downloadable: link.isDownloadable || false,
      link_type: link.linkType || "url",
      position,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, linkId: data.id };
}

// Update link
export async function updateLink(
  userId: string,
  linkId: string,
  updates: Partial<ProfileLink>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const dbUpdates: any = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.url !== undefined) dbUpdates.url = updates.url;
  if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
  if (updates.isDownloadable !== undefined)
    dbUpdates.is_downloadable = updates.isDownloadable;
  if (updates.linkType !== undefined) dbUpdates.link_type = updates.linkType;

  const { error } = await supabase
    .from("links")
    .update(dbUpdates)
    .eq("id", linkId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Delete link
export async function deleteLink(
  userId: string,
  linkId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("links").delete().eq("id", linkId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Reorder links
export async function reorderLinks(
  userId: string,
  linkIds: string[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Update positions for all links
  const updates = linkIds.map((linkId, index) => ({
    id: linkId,
    position: index,
  }));

  for (const update of updates) {
    const { error } = await supabase
      .from("links")
      .update({ position: update.position })
      .eq("id", update.id);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

// Track link click/download
export async function trackLinkEvent(
  linkId: string,
  eventType: "click" | "download",
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  }
): Promise<void> {
  const supabase = await createClient();

  // Get profile_id from link
  const { data: link } = await supabase
    .from("links")
    .select("profile_id")
    .eq("id", linkId)
    .single();

  if (!link) return;

  await supabase.from("link_analytics").insert({
    link_id: linkId,
    profile_id: link.profile_id,
    event_type: eventType,
    ip_address: metadata?.ipAddress,
    user_agent: metadata?.userAgent,
    referrer: metadata?.referrer,
  });
}

// Get analytics for profile
export async function getProfileAnalytics(userId: string): Promise<{
  totalClicks: number;
  totalDownloads: number;
  linkStats: Record<string, { clicks: number; downloads: number }>;
} | null> {
  const supabase = await createClient();

  // Get profile ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!profile) return null;

  // Get all analytics
  const { data: analytics } = await supabase
    .from("link_analytics")
    .select("link_id, event_type")
    .eq("profile_id", profile.id);

  if (!analytics) {
    return { totalClicks: 0, totalDownloads: 0, linkStats: {} };
  }

  let totalClicks = 0;
  let totalDownloads = 0;
  const linkStats: Record<string, { clicks: number; downloads: number }> = {};

  analytics.forEach((event) => {
    if (!linkStats[event.link_id]) {
      linkStats[event.link_id] = { clicks: 0, downloads: 0 };
    }

    if (event.event_type === "click") {
      totalClicks++;
      linkStats[event.link_id].clicks++;
    } else if (event.event_type === "download") {
      totalDownloads++;
      linkStats[event.link_id].downloads++;
    }
  });

  return { totalClicks, totalDownloads, linkStats };
}
