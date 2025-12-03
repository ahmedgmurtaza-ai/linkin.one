"use client";

import { useState, useCallback, useEffect } from "react";
import type { Profile, ProfileLink, ProfileLayout } from "./types";
import { createClient } from "./supabase/client";
import {
  updateProfile as dbUpdateProfile,
  addLink as dbAddLink,
  updateLink as dbUpdateLink,
  deleteLink as dbDeleteLink,
  reorderLinks as dbReorderLinks,
} from "./database-client";

const DEFAULT_PROFILE: Profile = {
  username: "",
  displayName: "",
  description: "",
  thumbnailUrl: "",
  layout: "classic",
  links: [],
};

// Sanitize username to match LinkedIn rules: lowercase letters, numbers, hyphens, underscores
function sanitizeUsername(username: string): string {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "") // Keep letters, numbers, hyphens, underscores
    .slice(0, 20); // Max length is 20
}

export function useProfileEditor() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const supabase = createClient();

  // Load profile from database
  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Get profile - use limit(1) to avoid "Cannot coerce" error
        const { data: profilesData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .limit(1);

        if (profileError) {
          console.error("Error loading profile:", profileError);
          setLoading(false);
          return;
        }

        let profileData = profilesData?.[0];

        // If profile doesn't exist, create it
        if (!profileData) {
          console.log("Profile not found, creating new profile...");
          const baseUsername = sanitizeUsername(
            user.email?.split("@")[0] || "user"
          );
          const displayName = user.user_metadata?.full_name || baseUsername;
          const avatarUrl = user.user_metadata?.avatar_url || "";

          // Try to create profile, if username exists, append random suffix
          let username = baseUsername;
          let attempts = 0;

          while (attempts < 5) {
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert({
                user_id: user.id,
                username,
                display_name: displayName,
                description: "Welcome to my linkin.one profile!",
                thumbnail_url: avatarUrl,
                layout: "classic",
              })
              .select()
              .limit(1);

            if (!createError && newProfile?.[0]) {
              profileData = newProfile[0];
              break;
            }

            // If username is taken, try with a suffix
            if (createError?.code === "23505") {
              username = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
              attempts++;
            } else {
              console.error("Error creating profile:", createError);
              setLoading(false);
              return;
            }
          }

          if (!profileData) {
            console.error("Failed to create profile after multiple attempts");
            setLoading(false);
            return;
          }
        }

        setProfileId(profileData.id);

        // Get links
        const { data: linksData, error: linksError } = await supabase
          .from("links")
          .select("*")
          .eq("profile_id", profileData.id)
          .order("position", { ascending: true });

        if (linksError) {
          console.error("Error loading links:", linksError);
        }

        setProfile({
          username: profileData.username,
          displayName: profileData.display_name,
          description: profileData.description || "",
          thumbnailUrl: profileData.thumbnail_url || "",
          layout: profileData.layout as ProfileLayout,
          showCategories: profileData.show_categories || false,
          theme: (profileData.theme as any) || "system",
          colorTheme: (profileData.color_theme as any) || "blue-purple",
          links: (linksData || []).map((link) => ({
            id: link.id,
            title: link.title,
            url: link.url,
            platform: link.platform,
            category: link.category as any,
            icon: link.icon || undefined,
            isDownloadable: link.is_downloadable,
            linkType: link.link_type as any,
          })),
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    // Optimistic update
    setProfile((prev) => ({ ...prev, ...updates }));

    // Set saving status
    setSaving(true);

    // Update database
    const result = await dbUpdateProfile(updates);
    if (!result.success) {
      console.error("Error updating profile:", result.error);
      // TODO: Revert optimistic update on error
    }

    // Clear saving status after a short delay to show the saved state
    setTimeout(() => setSaving(false), 500);
  }, []);

  const setLayout = useCallback(
    async (layout: ProfileLayout) => {
      await updateProfile({ layout });
    },
    [updateProfile]
  );

  const setShowCategories = useCallback(
    async (showCategories: boolean) => {
      await updateProfile({ showCategories });
    },
    [updateProfile]
  );

  const addLink = useCallback(async (link: Omit<ProfileLink, "id">) => {
    const result = await dbAddLink(link);
    if (result.success && result.linkId) {
      const newLink: ProfileLink = {
        ...link,
        id: result.linkId,
      };
      setProfile((prev) => ({
        ...prev,
        links: [...prev.links, newLink],
      }));
    } else {
      console.error("Error adding link:", result.error);
    }
  }, []);

  const updateLink = useCallback(
    async (id: string, updates: Partial<ProfileLink>) => {
      // Optimistic update
      setProfile((prev) => ({
        ...prev,
        links: prev.links.map((link) =>
          link.id === id ? { ...link, ...updates } : link
        ),
      }));

      // Update database
      const result = await dbUpdateLink(id, updates);
      if (!result.success) {
        console.error("Error updating link:", result.error);
      }
    },
    []
  );

  const deleteLink = useCallback(async (id: string) => {
    // Optimistic update
    setProfile((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== id),
    }));

    // Update database
    const result = await dbDeleteLink(id);
    if (!result.success) {
      console.error("Error deleting link:", result.error);
    }
  }, []);

  const reorderLinks = useCallback(
    async (fromIndex: number, toIndex: number) => {
      setProfile((prev) => {
        const newLinks = [...prev.links];
        const [removed] = newLinks.splice(fromIndex, 1);
        newLinks.splice(toIndex, 0, removed);

        // Update database with new order
        dbReorderLinks(newLinks.map((link) => link.id));

        return { ...prev, links: newLinks };
      });
    },
    []
  );

  return {
    profile,
    loading,
    saving,
    updateProfile,
    setLayout,
    setShowCategories,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
  };
}
