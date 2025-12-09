import { NextRequest } from "next/server";
import { createUser } from "@/lib/actions/auth-actions";
import { createProfileForUser } from "@/lib/actions/profile-actions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name, username } = body;

  // First create the user
  const userResult = await createUser(email, password, name);

  if (!userResult.success) {
    return Response.json(userResult, {
      status: 400
    });
  }

  // If username was provided, create a profile with that username
  if (username) {
    // We need to get the user ID to create the profile
    // This will be done in the profile-actions file
    const profileResult = await createProfileForUser(email, username, name || email.split("@")[0]);

    if (!profileResult.success) {
      // Return the profile creation error but with a 200 status
      // since the user was created successfully
      console.error("Profile creation error:", profileResult.error);
      return Response.json({
        success: true,
        message: "User created successfully, but there was an issue creating your profile."
      }, {
        status: 200
      });
    }
  }

  return Response.json({ success: true }, {
    status: 200
  });
}