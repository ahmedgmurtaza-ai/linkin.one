"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LinkList } from "@/components/link-list";
import { ProfileFooter } from "@/components/profile-footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Profile } from "@/lib/types";
import { ProfileAvatar } from "../profile-avatar";

interface SplitLayoutProps {
  profile: Profile;
  compact?: boolean;
}

export function SplitLayout({ profile, compact = false }: SplitLayoutProps) {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const shouldTruncate =
    profile.description && profile.description.length > 100;
  const truncatedDescription = shouldTruncate
    ? profile.description.slice(0, 100) + "..."
    : profile.description;

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
          <ProfileAvatar profile={profile} compact={compact} />
          <div className={`space-y-3 ${compact ? "max-w-xs" : "max-w-sm"}`}>
            <h1
              className={`font-bold text-foreground tracking-tight ${
                compact ? "text-xl" : "md:text-3xl text-2xl"
              }`}
            >
              {profile.displayName}
            </h1>

            {/* Username badge */}
            <Badge
              variant="secondary"
              className={`${compact ? "text-xs" : "text-sm"} font-normal`}
            >
              @{profile.username}
            </Badge>

            {profile.description && (
              <div className="space-y-2">
                <p
                  className={`text-muted-foreground leading-relaxed ${
                    compact ? "text-sm" : "md:text-lg text-sm"
                  }`}
                >
                  {truncatedDescription}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => setIsDescriptionModalOpen(true)}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Read more
                  </button>
                )}
              </div>
            )}
          </div>

          {!compact && <ProfileFooter />}
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
      {compact && <ProfileFooter compact />}

      {/* Description Modal */}
      <Dialog
        open={isDescriptionModalOpen}
        onOpenChange={setIsDescriptionModalOpen}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>About {profile.displayName}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {/* Avatar floated to the left on desktop, centered on mobile */}
            <div className="md:float-left md:mr-6 md:mb-4 flex justify-center mb-6 md:mb-0">
              <Avatar className="h-40 w-40 ring-4 ring-border/30 shadow-lg">
                <AvatarImage
                  src={profile.thumbnailUrl || "/placeholder.svg"}
                  alt={profile.displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Description text wraps around the avatar */}
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
              {profile.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
