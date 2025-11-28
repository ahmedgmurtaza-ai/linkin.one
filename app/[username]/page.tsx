import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profile-store";
import { ProfileTopBar } from "@/components/profile-top-bar";
import { ProfileLayoutRenderer } from "@/components/profile-layout";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = getProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <ProfileTopBar username={profile.username} /> */}
      <main className="pt-16">
        <ProfileLayoutRenderer profile={profile} />
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = getProfile(username);

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
