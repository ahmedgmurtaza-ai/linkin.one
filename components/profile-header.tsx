"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/types";
import { Verified } from "lucide-react";

interface ProfileHeaderProps {
  profile: Profile;
  compact?: boolean;
}

export function ProfileHeader({
  profile,
  compact = false,
}: ProfileHeaderProps) {
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex flex-col items-center text-center ${
        compact ? "gap-4" : "gap-6"
      }`}
    >
      {/* Avatar with ring effect */}
      <div className="relative group">
        <div
          className={`absolute inset-0 bg-linear-to-r from-primary/50 via-primary to-primary/50 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity ${
            compact ? "scale-110" : "scale-125"
          }`}
        />
        <Avatar
          className={`relative ${
            compact ? "h-20 w-20 ring-2 ring-border/30" : "h-32 w-32"
          } border-background shadow-xl ring-2 ring-primary/20 transition-transform group-hover:scale-105`}
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

      {/* Name and description */}
      <div className={`space-y-2 ${compact ? "max-w-xs" : "max-w-md"}`}>
        <div className="flex items-center justify-center gap-2">
          <h1
            className={`font-bold text-foreground tracking-tight ${
              compact ? "text-xl" : "text-3xl"
            }`}
          >
            {profile.displayName}
          </h1>
          {/* Optional verified badge */}
          {/* <Verified className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-primary fill-primary`} /> */}
        </div>

        {/* Username badge */}
        <Badge
          variant="secondary"
          className={`${compact ? "text-xs" : "text-sm"} font-normal`}
        >
          @{profile.username}
        </Badge>

        {/* Description */}
        {profile.description && (
          <p
            className={`text-muted-foreground leading-relaxed ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {profile.description}
          </p>
        )}
      </div>
    </div>
  );
}
