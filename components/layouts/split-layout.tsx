"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkCard } from "@/components/link-card"
import { ProfileFooter } from "@/components/profile-footer"
import type { Profile } from "@/lib/types"

interface SplitLayoutProps {
  profile: Profile
  compact?: boolean
}

export function SplitLayout({ profile, compact = false }: SplitLayoutProps) {
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={compact ? "px-3 py-3" : "max-w-4xl mx-auto px-4 py-8"}>
      <div className={`grid ${compact ? "grid-cols-1 gap-4" : "md:grid-cols-2 gap-8"}`}>
        {/* Left side - Profile info */}
        <div
          className={`flex flex-col ${compact ? "items-center text-center" : "md:items-start md:text-left items-center text-center"} ${compact ? "gap-3" : "gap-6"}`}
        >
          <Avatar className={compact ? "h-16 w-16" : "h-32 w-32"}>
            <AvatarImage src={profile.thumbnailUrl || "/placeholder.svg"} alt={profile.displayName} />
            <AvatarFallback className="bg-secondary text-foreground text-2xl font-medium">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className={`font-bold text-foreground ${compact ? "text-lg" : "text-3xl"}`}>{profile.displayName}</h1>
            <p className={`text-muted-foreground ${compact ? "text-xs" : "text-base"} max-w-sm`}>
              {profile.description}
            </p>
          </div>
          {!compact && <ProfileFooter />}
        </div>

        {/* Right side - Links */}
        <div className={`flex flex-col ${compact ? "gap-1.5" : "gap-3"}`}>
          {profile.links.map((link) => (
            <LinkCard key={link.id} link={link} compact={compact} />
          ))}
        </div>
      </div>
      {compact && <ProfileFooter compact />}
    </div>
  )
}
