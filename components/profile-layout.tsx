"use client"

import { ClassicLayout } from "@/components/layouts/classic-layout"
import { SplitLayout } from "@/components/layouts/split-layout"
import { GridLayout } from "@/components/layouts/grid-layout"
import type { Profile } from "@/lib/types"

interface ProfileLayoutProps {
  profile: Profile
  compact?: boolean
}

export function ProfileLayoutRenderer({ profile, compact = false }: ProfileLayoutProps) {
  const layout = profile.layout || "classic"

  switch (layout) {
    case "split":
      return <SplitLayout profile={profile} compact={compact} />
    case "grid":
      return <GridLayout profile={profile} compact={compact} />
    case "classic":
    default:
      return <ClassicLayout profile={profile} compact={compact} />
  }
}
