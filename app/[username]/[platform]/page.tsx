import { redirect, notFound } from "next/navigation"
import { getProfile, getLinkByPlatform } from "@/lib/profile-store"
import { generatePlatformSEO } from "@/lib/seo-config"
import type { Metadata } from "next"

interface PlatformRedirectProps {
  params: Promise<{ username: string; platform: string }>
}

export default async function PlatformRedirectPage({ params }: PlatformRedirectProps) {
  const { username, platform } = await params
  const profile = getProfile(username)

  if (!profile) {
    notFound()
  }

  const targetUrl = getLinkByPlatform(username, platform)

  if (!targetUrl) {
    // Platform not found, redirect to main profile
    redirect(`/${username}`)
  }

  // Redirect to the actual platform URL
  redirect(targetUrl)
}

export async function generateMetadata({ params }: PlatformRedirectProps): Promise<Metadata> {
  const { username, platform } = await params
  const profile = getProfile(username)

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
      images: profile.thumbnailUrl
        ? [
            {
              url: profile.thumbnailUrl,
              width: 1200,
              height: 630,
              alt: `${profile.displayName} on ${platform}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary",
      title: seo.title,
      description: seo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
