"use client";

import { type ProfileLink } from "@/lib/types";
import { ExternalLink, Download } from "lucide-react";
import { trackLinkEvent } from "@/lib/database-client";
import { PlatformIcon, getPlatformColors } from "@/components/platform-icon";

interface LinkCardProps {
  link: ProfileLink;
  compact?: boolean;
}

export function LinkCard({ link, compact = false }: LinkCardProps) {
  const isDownloadable =
    link.isDownloadable ||
    link.platform === "resume" ||
    link.platform === "pdf";
  const colors = getPlatformColors(link.platform);

  const handleClick = () => {
    if (isDownloadable) {
      trackLinkEvent(link.id, "download");
      const a = document.createElement("a");
      a.href = link.url;
      a.download = link.title.replace(/\s+/g, "_") + ".pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      trackLinkEvent(link.id, "click");
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`border border-[#eaeaea] cursor w-full flex items-center gap-3 bg-white/90 hover:bg-white  rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-sm group ${
        compact ? "px-3 py-2.5" : "px-4 py-3.5"
      }`}
    >
      <div
        className={`flex items-center justify-center ${colors.bg} ${
          colors.text
        } rounded-lg ${compact ? "h-8 w-8" : "h-10 w-10"}`}
      >
        <PlatformIcon
          platform={link.platform}
          url={link.url}
          className={compact ? "h-4 w-4" : "h-5 w-5"}
        />
      </div>
      <span
        className={`flex-1 text-left font-medium text-foreground ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        {link.title}
      </span>
      {isDownloadable ? (
        <Download
          className={`text-muted-foreground group-hover:text-primary transition-colors ${
            compact ? "h-3.5 w-3.5" : "h-4 w-4"
          }`}
        />
      ) : (
        <ExternalLink
          className={`text-muted-foreground group-hover:text-primary transition-colors ${
            compact ? "h-3.5 w-3.5" : "h-4 w-4"
          }`}
        />
      )}
    </button>
  );
}
