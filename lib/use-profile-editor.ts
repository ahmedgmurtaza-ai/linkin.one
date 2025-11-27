"use client"

import { useState, useCallback } from "react"
import type { Profile, ProfileLink, ProfileLayout } from "./types"
import { generateId, DEMO_PROFILES } from "./profile-store"

const DEFAULT_PROFILE: Profile = {
  username: "ahmedgmurtaza",
  displayName: "Ahmed G. Murtaza",
  description: "Software Engineer & Open Source Enthusiast. Building products that matter.",
  thumbnailUrl: "/professional-man-headshot.png",
  layout: "classic",
  links: [],
}

export function useProfileEditor(initialUsername?: string) {
  const [profile, setProfile] = useState<Profile>(() => {
    if (initialUsername && DEMO_PROFILES[initialUsername]) {
      return { ...DEMO_PROFILES[initialUsername] }
    }
    return { ...DEFAULT_PROFILE, links: [...(DEMO_PROFILES.ahmedgmurtaza?.links || [])] }
  })

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }, [])

  const setLayout = useCallback((layout: ProfileLayout) => {
    setProfile((prev) => ({ ...prev, layout }))
  }, [])

  const addLink = useCallback((link: Omit<ProfileLink, "id">) => {
    const newLink: ProfileLink = {
      ...link,
      id: generateId(),
    }
    setProfile((prev) => ({
      ...prev,
      links: [...prev.links, newLink],
    }))
  }, [])

  const updateLink = useCallback((id: string, updates: Partial<ProfileLink>) => {
    setProfile((prev) => ({
      ...prev,
      links: prev.links.map((link) => (link.id === id ? { ...link, ...updates } : link)),
    }))
  }, [])

  const deleteLink = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== id),
    }))
  }, [])

  const reorderLinks = useCallback((fromIndex: number, toIndex: number) => {
    setProfile((prev) => {
      const newLinks = [...prev.links]
      const [removed] = newLinks.splice(fromIndex, 1)
      newLinks.splice(toIndex, 0, removed)
      return { ...prev, links: newLinks }
    })
  }, [])

  return {
    profile,
    updateProfile,
    setLayout,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
  }
}
