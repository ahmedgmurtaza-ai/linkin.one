"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/types";
import { Verified } from "lucide-react";
import { ProfileAvatar } from "./profile-avatar";
import { ShareButton } from "@/components/share-profile-dialog";

interface ProfileHeaderProps {
  profile: Profile;
  compact?: boolean;
  isLoggedIn?: boolean;
}

export function ProfileHeader({
  profile,
  compact = false,
  isLoggedIn = false,
}: ProfileHeaderProps) {
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`*:flex flex-col items-center text-center ${
        compact ? "gap-4" : "gap-6"
      }`}
    >
      <ProfileAvatar profile={profile} compact={compact} />

      {/* Name and description */}
      <div className={`space-y-2 ${compact ? "max-w-xs" : "max-w-md"}`}>
        <div className="flex items-center justify-center gap-2">
          <h1
            className={`font-bold text-foreground tracking-tight ${
              compact ? "text-xl" : "text-2xl"
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

        {/* Share Button */}
        <div className="flex justify-center pt-2">
          <ShareButton
            username={profile.username}
            displayName={profile.displayName}
            thumbnailUrl={profile.thumbnailUrl}
            description={profile.description}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
      
    </div>
  );
}
