import { createClient } from "./supabase/client";
import type { Profile, ProfileLink } from "./types";

// Client-side database operations
const supabase = createClient();

// Sanitize username to match LinkedIn rules: lowercase letters, numbers, hyphens, underscores
function sanitizeUsername(username: string): string {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "") // Keep letters, numbers, hyphens, underscores
    .slice(0, 20); // Max length is 20
}

// Update profile
export async function updateProfile(
  updates: Partial<Profile>
): Promise<{ success: boolean; error?: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get profile ID
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  const profile = profiles?.[0];
  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const dbUpdates: any = {};
  if (updates.username !== undefined)
    dbUpdates.username = sanitizeUsername(updates.username);
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
  if (updates.colorTheme !== undefined) dbUpdates.color_theme = updates.colorTheme;

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
  link: Omit<ProfileLink, "id">
): Promise<{ success: boolean; error?: string; linkId?: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get profile ID
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  const profile = profiles?.[0];
  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Get max position
  const { data: maxPosLinks } = await supabase
    .from("links")
    .select("position")
    .eq("profile_id", profile.id)
    .order("position", { ascending: false })
    .limit(1);

  const maxPosLink = maxPosLinks?.[0];
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
    .limit(1);

  if (error || !data?.[0]) {
    return { success: false, error: error?.message || "Failed to create link" };
  }

  return { success: true, linkId: data[0].id };
}

// Update link
export async function updateLink(
  linkId: string,
  updates: Partial<ProfileLink>
): Promise<{ success: boolean; error?: string }> {
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
  linkId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("links").delete().eq("id", linkId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Reorder links
export async function reorderLinks(
  linkIds: string[]
): Promise<{ success: boolean; error?: string }> {
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
  eventType: "click" | "download"
): Promise<void> {
  // Get profile_id from link
  const { data: links } = await supabase
    .from("links")
    .select("profile_id")
    .eq("id", linkId)
    .limit(1);

  const link = links?.[0];
  if (!link) return;

  await supabase.from("link_analytics").insert({
    link_id: linkId,
    profile_id: link.profile_id,
    event_type: eventType,
    user_agent: navigator.userAgent,
    referrer: document.referrer || null,
  });
}
