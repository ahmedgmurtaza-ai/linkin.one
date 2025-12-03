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
    const colorTheme = profile.colorTheme || "#a88bf8";
    
    // Function to convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 168, g: 139, b: 248 };
    };
    
    const rgb = hexToRgb(colorTheme);
    
    // Create lighter version (40% lighter for content)
    const lighterR = Math.min(255, rgb.r + Math.round((255 - rgb.r) * 0.4));
    const lighterG = Math.min(255, rgb.g + Math.round((255 - rgb.g) * 0.4));
    const lighterB = Math.min(255, rgb.b + Math.round((255 - rgb.b) * 0.4));
    
    return {
      header: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      content: `rgba(${lighterR}, ${lighterG}, ${lighterB}, 0.2)`,
    };
  };

  const colors = getColorClasses();

  return (
    <div className="" >
      {/* Header Section with theme color */}
      <div style={{ backgroundColor: colors.header }}>
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
      <div >
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
      {/* <div style={{ backgroundColor: colors.content }}>
        <div className={compact ? "px-4 pb-6" : "max-w-4xl mx-auto px-4 pb-12"}>
          <ProfileFooter compact={compact} />
        </div>
      </div> */}

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
