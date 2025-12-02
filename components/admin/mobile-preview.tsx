"use client";

import { ProfileLayoutRenderer } from "@/components/profile-layout";
import type { Profile } from "@/lib/types";

interface MobilePreviewProps {
  profile: Profile;
}

export function MobilePreview({ profile }: MobilePreviewProps) {
  return (
    <div className="flex flex-col items-center h-full w-full py-4">
      <div className="relative w-full max-w-[420px] flex justify-center flex-1 max-h-[calc(100vh-12rem)] min-h-[600px]">
        {/* Phone frame */}
        <div className="w-full min-w-[320px] max-w-[420px] h-full bg-linear-to-br from-primary/15 via-accent/20 to-primary/25 rounded-[48px] p-1 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-background rounded-[40px] overflow-hidden flex flex-col shadow-inner">
            {/* Content - Use ProfileLayoutRenderer for dynamic layouts */}
            <div className="flex-1 overflow-y-auto">
              <ProfileLayoutRenderer profile={profile} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
