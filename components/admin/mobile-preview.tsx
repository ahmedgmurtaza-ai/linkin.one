"use client"

import { ProfileLayoutRenderer } from "@/components/profile-layout"
import type { Profile } from "@/lib/types"

interface MobilePreviewProps {
  profile: Profile
}

export function MobilePreview({ profile }: MobilePreviewProps) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-muted-foreground mb-4">Live Preview</p>
      <div className="relative">
        {/* Phone frame */}
        <div className="w-[280px] h-[580px] bg-card rounded-[40px] border-4 border-border p-2 shadow-xl">
          {/* Screen */}
          <div className="w-full h-full bg-background rounded-[32px] overflow-hidden flex flex-col">
            {/* Status bar */}
            <div className="h-6 bg-background flex items-center justify-center">
              <div className="w-20 h-5 bg-card rounded-full" />
            </div>
            {/* Content - Use ProfileLayoutRenderer for dynamic layouts */}
            <div className="flex-1 overflow-y-auto">
              <ProfileLayoutRenderer profile={profile} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
