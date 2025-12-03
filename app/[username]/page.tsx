import { notFound } from "next/navigation";
import { getProfileByUsername } from "@/lib/database";
import { ProfileTopBar } from "@/components/profile-top-bar";
import { ProfileLayoutRenderer } from "@/components/profile-layout";
import { ProfileThemeProvider } from "@/components/profile-theme-provider";
import { BuiltWithLinkin } from "@/components/built-with-linkin";
import { createClient } from "@/lib/supabase/server";
import { generateProfileSEO, generateProfileStructuredData } from "@/lib/seo-config";
import type { Metadata } from "next";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const structuredData = generateProfileStructuredData(profile);

  // Check if user is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  // Get background color from profile theme
  const colorTheme = profile.colorTheme || "#a88bf8";
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 168, g: 139, b: 248 };
  };
  const rgb = hexToRgb(colorTheme);
  const backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`;

  return (
    <ProfileThemeProvider theme={profile.theme}>
      {/* Structured Data for Profile */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.profilePageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.breadcrumbSchema),
        }}
      />
      
      <div className="min-h-screen" style={{ backgroundColor }}>
        {/* <ProfileTopBar 
          username={profile.username} 
          isLoggedIn={isLoggedIn} 
        /> */}
        <main className="pb-24">
          <ProfileLayoutRenderer profile={profile} isLoggedIn={isLoggedIn} />
        </main>
        <BuiltWithLinkin username={profile.username} colorTheme={profile.colorTheme} />
      </div>
    </ProfileThemeProvider>
  );
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return {
      title: "Profile Not Found | linkin.one",
      description: "The profile you are looking for does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const seo = generateProfileSEO(profile);
  
  // Generate dynamic OG image URL - use full absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://linkin.one';
  const ogImageUrl = `${baseUrl}/api/og?username=${username}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      type: "profile",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${profile.displayName} (@${profile.username})`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
