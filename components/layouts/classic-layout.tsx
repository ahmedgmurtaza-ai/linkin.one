"use client";

import { ProfileHeader } from "@/components/profile-header";
import { LinkList } from "@/components/link-list";
import { ProfileFooter } from "@/components/profile-footer";
import type { Profile } from "@/lib/types";

interface ClassicLayoutProps {
  profile: Profile;
  compact?: boolean;
  isLoggedIn?: boolean;
}

export function ClassicLayout({
  profile,
  compact = false,
  isLoggedIn = false,
}: ClassicLayoutProps) {
  return (
    <div
      className={compact ? "px-4 py-4" : "max-w-md mx-auto px-4 md:py-12 py-8"}
    >
      <ProfileHeader profile={profile} compact={compact} isLoggedIn={isLoggedIn} />
      <div className={compact ? "mt-4" : "mt-8"}>
        <LinkList
          links={profile.links}
          compact={compact}
          layout="classic"
          groupByCategory={profile.showCategories || false}
        />
      </div>
      <ProfileFooter compact={compact} />
    </div>
  );
}
