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

interface GridLayoutProps {
  profile: Profile;
  compact?: boolean;
  isLoggedIn?: boolean;
}

export function GridLayout({ profile, compact = false, isLoggedIn = false }: GridLayoutProps) {
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
        header: "bg-blue-100 dark:bg-blue-950",
        content: "bg-purple-50 dark:bg-purple-950/50",
      },
      "green-teal": {
        header: "bg-green-100 dark:bg-green-950",
        content: "bg-teal-50 dark:bg-teal-950/50",
      },
      "orange-pink": {
        header: "bg-orange-100 dark:bg-orange-950",
        content: "bg-pink-50 dark:bg-pink-950/50",
      },
    };

    return themes[colorTheme] || themes["blue-purple"];
  };

  const colors = getColorClasses();

  return (
    <div className="min-h-screen">
      {/* Header Section with theme color */}
      <div className={colors.header}>
        <div className={compact ? "px-4 py-6" : "max-w-4xl mx-auto px-4 py-12"}>
          <div className="flex flex-col items-center text-center space-y-6">
            <ProfileAvatar profile={profile} compact={compact} />
            <div className={`space-y-3 ${compact ? "max-w-xs" : "max-w-2xl"}`}>
              <h1
                className={`font-bold text-foreground tracking-tight ${
                  compact ? "text-xl" : "md:text-3xl text-2xl"
                }`}
              >
                {profile.displayName}
              </h1>

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
        </div>
      </div>

      {/* Links Section with theme color */}
      <div className={colors.content}>
        <div className={compact ? "px-4 py-6" : "max-w-4xl mx-auto px-4 py-12"}>
          <LinkList
            links={profile.links}
            compact={compact}
            layout="grid"
            groupByCategory={profile.showCategories || false}
          />
        </div>
      </div>

      {/* Footer */}
      <div className={colors.content}>
        <div className={compact ? "px-4 pb-6" : "max-w-4xl mx-auto px-4 pb-12"}>
          <ProfileFooter compact={compact} />
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
            <div className="md:float-left md:mr-6 md:mb-4 flex justify-center mb-6">
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
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
              {profile.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
