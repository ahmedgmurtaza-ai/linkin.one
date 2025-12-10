import { redirect, notFound } from "next/navigation"
import { getProfileByUsername } from "@/lib/database"
import { generatePlatformSEO } from "@/lib/seo-config"
import type { Metadata } from "next"

interface PlatformRedirectProps {
  params: Promise<{ username: string; platform: string }>
}

export default async function PlatformRedirectPage({ params }: PlatformRedirectProps) {
  const { username, platform } = await params
  const profile = await getProfileByUsername(username)

  if (!profile) {
    notFound()
  }

  // Find the link for this platform
  const link = profile.links?.find(
    (l) => l.platform.toLowerCase() === platform.toLowerCase()
  )

  if (!link) {
    // Platform not found, redirect to main profile
    redirect(`/${username}`)
  }

  // Redirect to the actual platform URL
  redirect(link.url)
}

export async function generateMetadata({ params }: PlatformRedirectProps): Promise<Metadata> {
  const { username, platform } = await params
  const profile = await getProfileByUsername(username)

  if (!profile) {
    return {
      title: "Profile Not Found | linkin.one",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  // Find the specific link for this platform
  const link = profile.links?.find(
    (l) => l.platform.toLowerCase() === platform.toLowerCase()
  )

  const seo = generatePlatformSEO(
    username,
    platform,
    profile.displayName,
    link?.title
  )

  const ogImageUrl = 'https://linkin.one/og-background.png';

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
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${profile.displayName} on ${platform}`,
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
  }
}
