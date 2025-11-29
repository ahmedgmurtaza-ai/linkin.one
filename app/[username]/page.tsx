import { notFound } from "next/navigation";
import { getProfileByUsername } from "@/lib/database";
import { ProfileTopBar } from "@/components/profile-top-bar";
import { ProfileLayoutRenderer } from "@/components/profile-layout";
import { createClient } from "@/lib/supabase/server";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  // Check if user is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-background">
      <ProfileTopBar username={profile.username} isLoggedIn={isLoggedIn} />
      <main className="pt-16">
        <ProfileLayoutRenderer profile={profile} />
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return {
      title: "Profile Not Found | linkin.one",
    };
  }

  return {
    title: `${profile.displayName} | linkin.one`,
    description: profile.description,
  };
}
