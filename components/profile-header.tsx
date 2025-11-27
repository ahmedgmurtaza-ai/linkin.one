"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Profile } from "@/lib/types"

interface ProfileHeaderProps {
  profile: Profile
  compact?: boolean
}

export function ProfileHeader({ profile, compact = false }: ProfileHeaderProps) {
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={`flex flex-col items-center text-center ${compact ? "gap-3" : "gap-4"}`}>
      <Avatar className={compact ? "h-16 w-16" : "h-24 w-24"}>
        <AvatarImage src={profile.thumbnailUrl || "/placeholder.svg"} alt={profile.displayName} />
        <AvatarFallback className="bg-secondary text-foreground text-lg font-medium">{initials}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h1 className={`font-semibold text-foreground ${compact ? "text-lg" : "text-2xl"}`}>{profile.displayName}</h1>
        <p className={`text-muted-foreground ${compact ? "text-xs" : "text-sm"} max-w-xs`}>{profile.description}</p>
      </div>
    </div>
  )
}
