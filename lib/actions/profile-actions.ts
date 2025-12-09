"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Create a profile for a user by their email
 */
export async function createProfileForUser(
  email: string,
  username: string,
  displayName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // First, get the user by email to get the user ID
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      console.error("Error finding user by email:", userError);
      return { success: false, error: userError?.message || "User not found" };
    }

    // Check if a profile with this username already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.toLowerCase())
      .single();

    if (existingProfile) {
      return { success: false, error: "Username already taken" };
    }

    // Create the profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        nextauth_user_id: user.id,
        username: username.toLowerCase(),
        display_name: displayName,
        description: "Welcome to my linkin.one profile!",
        layout: "split",
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      return { success: false, error: profileError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Create profile error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}