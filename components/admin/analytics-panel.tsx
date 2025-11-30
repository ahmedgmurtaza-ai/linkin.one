"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProfileLink } from "@/lib/types";
import { PLATFORM_ICONS } from "@/lib/types";
import {
  BarChart3,
  MousePointerClick,
  Download,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AnalyticsPanelProps {
  links: ProfileLink[];
}

interface Analytics {
  totalClicks: number;
  totalDownloads: number;
  linkStats: Record<string, { clicks: number; downloads: number }>;
}

export function AnalyticsPanel({ links }: AnalyticsPanelProps) {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalClicks: 0,
    totalDownloads: 0,
    linkStats: {},
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadAnalytics = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get profile ID
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) return;

      // Get all analytics
      const { data: analyticsData } = await supabase
        .from("link_analytics")
        .select("link_id, event_type")
        .eq("profile_id", profile.id);

      if (!analyticsData) {
        setAnalytics({ totalClicks: 0, totalDownloads: 0, linkStats: {} });
        return;
      }

      let totalClicks = 0;
      let totalDownloads = 0;
      const linkStats: Record<string, { clicks: number; downloads: number }> =
        {};

      analyticsData.forEach((event) => {
        if (!linkStats[event.link_id]) {
          linkStats[event.link_id] = { clicks: 0, downloads: 0 };
        }

        if (event.event_type === "click") {
          totalClicks++;
          linkStats[event.link_id].clicks++;
        } else if (event.event_type === "download") {
          totalDownloads++;
          linkStats[event.link_id].downloads++;
        }
      });

      setAnalytics({ totalClicks, totalDownloads, linkStats });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [supabase]);

  const resetAnalytics = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!profile) return;

    await supabase.from("link_analytics").delete().eq("profile_id", profile.id);
    setAnalytics({ totalClicks: 0, totalDownloads: 0, linkStats: {} });
  };

  const linkAnalytics = links
    .map((link) => ({
      ...link,
      clicks: analytics.linkStats[link.id]?.clicks || 0,
      downloads: analytics.linkStats[link.id]?.downloads || 0,
    }))
    .sort((a, b) => b.clicks + b.downloads - (a.clicks + a.downloads));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Track how visitors interact with your links
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAnalytics}
            className="text-muted-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
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
            <p className="text-3xl font-bold text-foreground">
              {analytics.totalClicks}
            </p>
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
            <p className="text-3xl font-bold text-foreground">
              {analytics.totalDownloads}
            </p>
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
            <p className="text-sm text-muted-foreground text-center py-4">
              No links to track yet
            </p>
          ) : (
            <div className="space-y-3">
              {linkAnalytics.map((link) => {
                const iconLabel =
                  PLATFORM_ICONS[link.platform.toLowerCase()] ||
                  PLATFORM_ICONS.default;
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center justify-center h-8 w-8 bg-card text-primary font-semibold text-xs rounded-md shrink-0">
                      {iconLabel}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {link.title}
                      </p>
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
