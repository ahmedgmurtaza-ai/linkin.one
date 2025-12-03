"use client";

import { Loader2 } from "lucide-react";
import type { Profile } from "@/lib/types";

interface MobilePreviewProps {
  profile: Profile;
  saving?: boolean;
}

export function MobilePreview({ profile, saving = false }: MobilePreviewProps) {
  const layout = profile.layout || "split";
  
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
    
    if (layout === "grid") {
      // Grid layout uses 40% lighter for content
      const lighterR = Math.min(255, rgb.r + Math.round((255 - rgb.r) * 0.4));
      const lighterG = Math.min(255, rgb.g + Math.round((255 - rgb.g) * 0.4));
      const lighterB = Math.min(255, rgb.b + Math.round((255 - rgb.b) * 0.4));
      
      return {
        header: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        content: `rgba(${lighterR}, ${lighterG}, ${lighterB}, 0.2)`,
      };
    } else {
      // Split layout uses 30% lighter
      const lighterR = Math.min(255, rgb.r + Math.round((255 - rgb.r) * 0.3));
      const lighterG = Math.min(255, rgb.g + Math.round((255 - rgb.g) * 0.3));
      const lighterB = Math.min(255, rgb.b + Math.round((255 - rgb.b) * 0.3));
      
      return {
        left: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        right: `rgba(${lighterR}, ${lighterG}, ${lighterB}, 0.2)`,
      };
    }
  };

  const colors = getColorClasses();

  // For grid layout, use vertical gradient
  // const frameGradient = layout === "grid" 
  //   ? `linear-gradient(to bottom, ${(colors as any).header}, ${(colors as any).content})`
  //   : `linear-gradient(to right, ${(colors as any).left}, ${(colors as any).right})`;

  return (
    <div className="flex flex-col items-center h-full w-full py-4 relative">
      <div className="relative w-full max-w-[420px] flex justify-center flex-1 max-h-[calc(100vh-12rem)] min-h-[600px]">
        {/* Phone frame */}
        <div 
          className="w-full min-w-[320px] max-w-[420px] h-full rounded-[48px] p-1 shadow-2xl border-2 "
          // style={{ background: frameGradient }}
        >
          {/* Screen */}
          <div className="w-full h-full bg-background rounded-[40px] overflow-hidden flex flex-col shadow-inner">
            {/* Content - iframe for live preview */}
            <iframe
              src={`/${profile.username}`}
              className="flex-1 w-full h-full border-0"
              title="Profile Preview"
            />
          </div>
        </div>

        {/* Loading overlay */}
        {saving && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-[48px] flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Updating...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
