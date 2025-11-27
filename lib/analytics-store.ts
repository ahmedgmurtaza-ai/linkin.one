"use client"

import { useState, useCallback } from "react"
import type { ProfileAnalytics } from "./types"

const ANALYTICS_KEY = "linkin_analytics"

function getInitialAnalytics(): ProfileAnalytics {
  if (typeof window === "undefined") {
    return { totalClicks: 0, totalDownloads: 0, linkStats: {} }
  }
  try {
    const stored = localStorage.getItem(ANALYTICS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return { totalClicks: 0, totalDownloads: 0, linkStats: {} }
}

function saveAnalytics(analytics: ProfileAnalytics) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics))
  } catch {}
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<ProfileAnalytics>(getInitialAnalytics)

  const trackClick = useCallback((linkId: string) => {
    setAnalytics((prev) => {
      const linkStats = { ...prev.linkStats }
      if (!linkStats[linkId]) {
        linkStats[linkId] = { clicks: 0, downloads: 0 }
      }
      linkStats[linkId] = { ...linkStats[linkId], clicks: linkStats[linkId].clicks + 1 }
      const updated = {
        ...prev,
        totalClicks: prev.totalClicks + 1,
        linkStats,
      }
      saveAnalytics(updated)
      return updated
    })
  }, [])

  const trackDownload = useCallback((linkId: string) => {
    setAnalytics((prev) => {
      const linkStats = { ...prev.linkStats }
      if (!linkStats[linkId]) {
        linkStats[linkId] = { clicks: 0, downloads: 0 }
      }
      linkStats[linkId] = { ...linkStats[linkId], downloads: linkStats[linkId].downloads + 1 }
      const updated = {
        ...prev,
        totalDownloads: prev.totalDownloads + 1,
        linkStats,
      }
      saveAnalytics(updated)
      return updated
    })
  }, [])

  const resetAnalytics = useCallback(() => {
    const reset = { totalClicks: 0, totalDownloads: 0, linkStats: {} }
    setAnalytics(reset)
    saveAnalytics(reset)
  }, [])

  return { analytics, trackClick, trackDownload, resetAnalytics }
}
