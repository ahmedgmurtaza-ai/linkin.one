"use server";

import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

/**
 * Create a new user in the database
 */
export async function createUser(
  email: string, 
  password: string, 
  name?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Validate inputs
    const emailSchema = z.string().email();
    const passwordSchema = z.string().min(6);
    
    emailSchema.parse(email);
    passwordSchema.parse(password);
    
    if (name) {
      const nameSchema = z.string().min(1).max(100);
      nameSchema.parse(name);
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    
    if (existingUser) {
      return { success: false, error: "User already exists" };
    }
    
    // Create the user
    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        name: name || email.split("@")[0], // Use email prefix as name if not provided
      })
      .select()
      .single();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data" };
    }
    console.error("Create user error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(email: string, newPassword: string) {
  try {
    const supabase = await createClient();
    
    // Validate inputs
    const emailSchema = z.string().email();
    const passwordSchema = z.string().min(6);
    
    emailSchema.parse(email);
    passwordSchema.parse(newPassword);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const { error } = await supabase
      .from("users")
      .update({ 
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq("email", email);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data" };
    }
    console.error("Update password error:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}

/**
 * Create a password reset token
 */
export async function createPasswordResetToken(email: string) {
  try {
    const supabase = await createClient();
    
    // Validate email input
    const emailSchema = z.string().email();
    emailSchema.parse(email);
    
    // Check if user exists
    const { data: user } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();
    
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return { success: true };
    }
    
    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    // Set expiration time (2 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);
    
    // Store the token in the database
    const { error } = await supabase
      .from("password_reset_tokens")
      .insert({
        email,
        token,
        expires_at: expiresAt.toISOString()
      });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // In a real application, send the password reset email here
    
    return { success: true, token };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid email" };
    }
    console.error("Create password reset token error:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}

/**
 * Verify a password reset token
 */
export async function verifyPasswordResetToken(token: string) {
  try {
    const supabase = await createClient();
    
    // Validate token input
    const tokenSchema = z.string().min(10);
    tokenSchema.parse(token);
    
    const { data, error } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .single();
    
    if (error || !data) {
      throw new Error("Invalid token");
    }
    
    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    if (now > expiresAt) {
      // Delete expired token
      await supabase
        .from("password_reset_tokens")
        .delete()
        .eq("token", token);
      
      throw new Error("Token expired");
    }
    
    // Delete used token
    await supabase
      .from("password_reset_tokens")
      .delete()
      .eq("token", token);
    
    return { success: true, email: data.email };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid token" };
    }
    console.error("Verify password reset token error:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}