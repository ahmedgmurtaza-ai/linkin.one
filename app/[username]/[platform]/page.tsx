import { redirect, notFound } from "next/navigation"
import { getProfile, getLinkByPlatform } from "@/lib/profile-store"

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

export async function generateMetadata({ params }: PlatformRedirectProps) {
  const { username, platform } = await params
  const profile = getProfile(username)

  return {
    title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} - ${profile?.displayName || username} | linkin.one`,
  }
}
