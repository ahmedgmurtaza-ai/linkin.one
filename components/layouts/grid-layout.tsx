"use client";

import { ProfileHeader } from "@/components/profile-header";
import { LinkList } from "@/components/link-list";
import { ProfileFooter } from "@/components/profile-footer";
import type { Profile } from "@/lib/types";

interface GridLayoutProps {
  profile: Profile;
  compact?: boolean;
  isLoggedIn?: boolean;
}

export function GridLayout({ profile, compact = false, isLoggedIn = false }: GridLayoutProps) {
  return (
    <div className={compact ? "px-3 py-3" : "max-w-2xl mx-auto px-4 py-8"}>
      <ProfileHeader profile={profile} compact={compact} isLoggedIn={isLoggedIn} />
      <div className={compact ? "mt-4" : "mt-8"}>
        <LinkList
          links={profile.links}
          compact={compact}
          layout="grid"
          groupByCategory={profile.showCategories || false}
        />
      </div>
      <ProfileFooter compact={compact} />
    </div>
  );
}
