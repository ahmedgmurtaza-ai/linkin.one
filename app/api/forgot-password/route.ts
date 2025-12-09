import { NextRequest } from "next/server";
import { createPasswordResetToken } from "@/lib/nextauth-db";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return Response.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    // Check if user exists
    const supabase = await createClient();
    const { data: user } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return Response.json({ message: 'Password reset link sent successfully' });
    }

    // Create a password reset token
    await createPasswordResetToken(email);

    // In a real application, you would send an email with the reset link here
    // For now, we're just returning success, and the actual email sending would
    // be handled by an email service like Resend, SendGrid, etc.

    // The reset link would be: `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
    console.log(`Password reset link would be sent to: ${email}`);

    return Response.json({ message: 'Password reset link sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return Response.json({ message: 'An error occurred while processing your request' }, { status: 500 });
  }
}