"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/lib/analytics-store"
import type { ProfileLink } from "@/lib/types"
import { PLATFORM_ICONS } from "@/lib/types"
import { BarChart3, MousePointerClick, Download, RotateCcw, TrendingUp } from "lucide-react"

interface AnalyticsPanelProps {
  links: ProfileLink[]
}

export function AnalyticsPanel({ links }: AnalyticsPanelProps) {
  const { analytics, resetAnalytics } = useAnalytics()

  const linkAnalytics = links
    .map((link) => ({
      ...link,
      clicks: analytics.linkStats[link.id]?.clicks || 0,
      downloads: analytics.linkStats[link.id]?.downloads || 0,
    }))
    .sort((a, b) => b.clicks + b.downloads - (a.clicks + a.downloads))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics
        </h2>
        <Button variant="ghost" size="sm" onClick={resetAnalytics} className="text-muted-foreground">
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <MousePointerClick className="h-4 w-4" />
              Total Clicks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{analytics.totalClicks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Download className="h-4 w-4" />
              Total Downloads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{analytics.totalDownloads}</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Link Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Link Performance
          </CardTitle>
          <CardDescription>Click and download counts per link</CardDescription>
        </CardHeader>
        <CardContent>
          {linkAnalytics.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No links to track yet</p>
          ) : (
            <div className="space-y-3">
              {linkAnalytics.map((link) => {
                const iconLabel = PLATFORM_ICONS[link.platform.toLowerCase()] || PLATFORM_ICONS.default
                return (
                  <div key={link.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-center h-8 w-8 bg-card text-primary font-semibold text-xs rounded-md shrink-0">
                      {iconLabel}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="h-3.5 w-3.5" />
                        {link.clicks}
                      </span>
                      {link.isDownloadable && (
                        <span className="flex items-center gap-1">
                          <Download className="h-3.5 w-3.5" />
                          {link.downloads}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
