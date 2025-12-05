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
import { ProfileTopBar } from "../profile-top-bar";
import { Logo } from "../logo";
import { Button } from "../ui/button";
import Link from "next/link";

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

  // Get color theme classes
  const getColorClasses = () => {
    const colorTheme = profile.colorTheme || "#a88bf8";
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 168, g: 139, b: 248 };
    };
    const rgb = hexToRgb(colorTheme);
    const primaryColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    const lighterR = Math.min(255, rgb.r + Math.round((255 - rgb.r) * 0.3));
    const lighterG = Math.min(255, rgb.g + Math.round((255 - rgb.g) * 0.3));
    const lighterB = Math.min(255, rgb.b + Math.round((255 - rgb.b) * 0.3));

    return {
      left: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      right: `rgba(${lighterR}, ${lighterG}, ${lighterB}, 0.2)`,
      leftDark: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
      rightDark: `rgba(${lighterR}, ${lighterG}, ${lighterB}, 0.15)`,
    };
  };

  const colors = getColorClasses();

  return (
    <div className="min-h-screen">
      <ProfileTopBar
        username={profile.username}
        isLoggedIn={isLoggedIn}
        colorTheme={profile.colorTheme}
      />

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[500px_1fr] gap-0">
        {/* LEFT SIDE */}
        <div
          className="md:min-h-screen md:sticky md:top-0 md:self-start md:h-screen md:overflow-y-auto"
          style={{ backgroundColor: colors.left }}
        >
          <div
            className={`flex flex-col h-screen justify-between ${
              compact
                ? "items-center text-center px-3 py-6"
                : "md:items-start md:text-left items-center text-center px-10 py-12"
            } ${compact ? "gap-4" : "gap-6"}`}
          >
            {/* TOP BLOCK */}
            <div className="flex flex-col gap-6 w-full items-center md:items-start">
              <ProfileAvatar profile={profile} compact={compact} />

              <div className={`space-y-3 ${compact ? "max-w-xs" : "max-w-sm"}`}>
                <h1
                  className={`font-bold text-foreground tracking-tight ${
                    compact ? "text-xl" : "md:text-3xl text-2xl"
                  }`}
                >
                  {profile.displayName}
                </h1>

                <Badge
                  variant="secondary"
                  className={`${compact ? "text-xs" : "text-xs md:text-sm"} font-normal`}
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
                      {profile.description}
                    </p>
                  </div>
                )}

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
            </div>

            {/* BOTTOM BLOCK */}
            <div className="w-full md:flex justify-between items-center hidden">
              <Logo />
              <Link href={isLoggedIn ? "/admin" : "/signup"}>
                <Button variant={"outline"}>Start your page</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="min-h-screen"
          style={{ backgroundColor: colors.right }}
        >
          <div className={`${compact ? "px-3 py-6" : "px-6 py-12 max-w-5xl mx-auto"}`}>
            <LinkList
              links={profile.links}
              compact={compact}
              layout="grid"
              groupByCategory={profile.showCategories || false}
            />
          </div>
        </div>
      </div>

      {/* DESCRIPTION MODAL */}
      <Dialog
        open={isDescriptionModalOpen}
        onOpenChange={setIsDescriptionModalOpen}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>About {profile.displayName}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
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

            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
              {profile.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
