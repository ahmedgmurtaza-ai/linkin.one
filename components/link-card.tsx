"use client"

import { PLATFORM_ICONS, type ProfileLink } from "@/lib/types"
import { ExternalLink, Download } from "lucide-react"
import { useAnalytics } from "@/lib/analytics-store"

interface LinkCardProps {
  link: ProfileLink
  compact?: boolean
}

export function LinkCard({ link, compact = false }: LinkCardProps) {
  const iconLabel = PLATFORM_ICONS[link.platform.toLowerCase()] || PLATFORM_ICONS.default
  const isDownloadable = link.isDownloadable || link.platform === "resume" || link.platform === "pdf"
  const { trackClick, trackDownload } = useAnalytics()

  const handleClick = () => {
    if (isDownloadable) {
      trackDownload(link.id)
      const a = document.createElement("a")
      a.href = link.url
      a.download = link.title.replace(/\s+/g, "_") + ".pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      trackClick(link.id)
      window.open(link.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 bg-card hover:bg-secondary border border-border rounded-xl transition-all duration-200 hover:scale-[1.02] hover:border-primary/50 group ${
        compact ? "px-3 py-2.5" : "px-4 py-3.5"
      }`}
    >
      <div
        className={`flex items-center justify-center bg-secondary text-primary font-semibold rounded-lg ${
          compact ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
        }`}
      >
        {iconLabel}
      </div>
      <span className={`flex-1 text-left font-medium text-foreground ${compact ? "text-sm" : "text-base"}`}>
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
  )
}
