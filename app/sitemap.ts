import { MetadataRoute } from 'next'
import { getProfileByUsername } from '@/lib/database'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://linkin.one'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]

  // Fetch all user profiles
  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .order('updated_at', { ascending: false })

  const profilePages: MetadataRoute.Sitemap = []

  if (profiles) {
    for (const profile of profiles) {
      // Add profile page
      profilePages.push({
        url: `${baseUrl}/${profile.username}`,
        lastModified: new Date(profile.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.9,
      })

      // Add platform-specific pages if links exist
      // if (profile.links && Array.isArray(profile.links)) {
      //   for (const link of profile.links) {
      //     if (link.platform) {
      //       profilePages.push({
      //         url: `${baseUrl}/${profile.username}/${link.platform.toLowerCase()}`,
      //         lastModified: new Date(profile.updated_at || new Date()),
      //         changeFrequency: 'weekly',
      //         priority: 0.8,
      //       })
      //     }
      //   }
      // }
    }
  }

  return [...staticPages, ...profilePages]
}

// Revalidate sitemap every hour
export const revalidate = 3600
