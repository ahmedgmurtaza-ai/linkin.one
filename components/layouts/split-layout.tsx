"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LinkList } from "@/components/link-list";
import { ProfileFooter } from "@/components/profile-footer";
import { ShareButton } from "@/components/share-profile-dialog";
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
  isLoggedIn?: boolean;
}

export function SplitLayout({ profile, compact = false, isLoggedIn = false }: SplitLayoutProps) {
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

  // Get color theme classes
  const getColorClasses = () => {
    const colorTheme = profile.colorTheme || "blue-purple";
    
    const themes = {
      "blue-purple": {
        left: "bg-blue-100 dark:bg-blue-950",
        right: "bg-purple-100 dark:bg-purple-950",
      },
      "green-teal": {
        left: "bg-green-100 dark:bg-green-950",
        right: "bg-teal-100 dark:bg-teal-950",
      },
      "orange-pink": {
        left: "bg-orange-100 dark:bg-orange-950",
        right: "bg-pink-100 dark:bg-pink-950",
      },
    };

    return themes[colorTheme] || themes["blue-purple"];
  };

  const colors = getColorClasses();

  return (
    <div className="min-h-screen">
      <div
        className={`grid grid-cols-1 md:grid-cols-[450px_1fr] gap-0`}
      >
        {/* Left side - Profile info with theme color */}
        <div className={`${colors.left} md:min-h-screen`}>
          <div
            className={`flex flex-col ${
              compact
                ? "items-center text-center px-3 py-6"
                : "md:items-start md:text-left items-center text-center md:sticky md:top-0 md:self-start px-10 py-12"
            } ${compact ? "gap-4" : "gap-6"}`}
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
                className={`${
                  compact ? "text-xs" : "text-xs md:text-sm"
                } font-normal`}
              >
                @{profile.username}
              </Badge>

              {profile.description && (
                <div className="space-y-2">
                  <p
                    className={`text-foreground leading-relaxed ${
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

              {/* Share Button */}
              <div className="flex justify-center md:justify-start pt-2">
                <ShareButton
                  username={profile.username}
                  displayName={profile.displayName}
                  thumbnailUrl={profile.thumbnailUrl}
                  description={profile.description}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            </div>

            {/* Footer on desktop in sidebar */}
            {/* {!compact && (
              <div className="hidden md:block mt-auto pt-8">
                <ProfileFooter compact />
              </div>
            )} */}
          </div>
        </div>

        {/* Right side - Links with theme color and grid layout */}
        <div className={`${colors.right} min-h-screen`}>
          <div className={`${compact ? "px-3 py-6" : "px-6 py-12 max-w-5xl mx-auto"}`}>
            <LinkList
              links={profile.links}
              compact={compact}
              layout={compact ? "classic" : "grid"}
              groupByCategory={profile.showCategories || false}
            />
            {compact && (
              <div className="mt-6">
                <ProfileFooter compact />
              </div>
            )}
            {!compact && (
              <div className="md:hidden mt-8">
                <ProfileFooter compact={false} />
              </div>
            )}
          </div>
        </div>
      </div>

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
            <div className="md:float-left md:mr-6 flex justify-center mb-6 md:mb-0">
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
