"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LinkList } from "@/components/link-list";
import { ProfileFooter } from "@/components/profile-footer";
import type { Profile } from "@/lib/types";

interface SplitLayoutProps {
  profile: Profile;
  compact?: boolean;
}

export function SplitLayout({ profile, compact = false }: SplitLayoutProps) {
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={compact ? "px-3 py-3" : "max-w-4xl mx-auto px-4 py-12"}>
      <div
        className={`grid ${
          compact ? "grid-cols-1 gap-4" : "md:grid-cols-2 gap-8"
        }`}
      >
        {/* Left side - Profile info */}
        <div
          className={`flex flex-col ${
            compact
              ? "items-center text-center"
              : "md:items-start md:text-left items-center text-center"
          } ${compact ? "gap-4 pt-4" : "gap-6 pt-8"}`}
        >
          {/* Avatar with enhanced styling */}
          <div className="relative group">
            <div
              className={`absolute bg-linear-to-r from-primary/50 via-primary to-primary/50 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity ${
                compact ? "scale-110" : "scale-125"
              }`}
            />
            <Avatar
              className={`relative ${
                compact
                  ? "h-20 w-20 ring-2 ring-border/30 ring-offset-2"
                  : "h-30 w-30 ring-4 ring-border/30 ring-offset-4"
              } border-background shadow-2xl ring-4 ring-primary/20 transition-transform group-hover:scale-105`}
            >
              <AvatarImage
                src={profile.thumbnailUrl || "/placeholder.svg"}
                alt={profile.displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className={`space-y-3 ${compact ? "max-w-xs" : "max-w-sm"}`}>
            <h1
              className={`font-bold text-foreground tracking-tight ${
                compact ? "text-xl" : "text-2xl md:text-2xl"
              }`}
            >
              {profile.displayName}
            </h1>

            {/* Username badge */}
            <Badge
              variant="secondary"
              className={`${compact ? "text-xs" : "text-xs md:text-sm"} font-normal`}
            >
              @{profile.username}
            </Badge>

            {profile.description && (
              <p
                className={`text-muted-foreground leading-relaxed ${
                  compact ? "text-sm" : "text-sm md:text-lg"
                }`}
              >
                {profile.description}
              </p>
            )}
          </div>

          {/* {!compact && <ProfileFooter />} */}
        </div>

        {/* Right side - Links */}
        <div className={`flex flex-col ${compact ? "gap-1.5" : "gap-3"}`}>
          <LinkList
            links={profile.links}
            compact={compact}
            layout="classic"
            groupByCategory={profile.showCategories || false}
          />
        </div>
      </div>
    </div>
  );
}
