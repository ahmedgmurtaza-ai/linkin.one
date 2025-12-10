"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProfileLink } from "@/lib/types";
import { PLATFORM_ICONS } from "@/lib/types";
import {
  BarChart3,
  MousePointerClick,
  Download,
  RotateCcw,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAnalyticsService } from "@/hooks/use-analytics-service";
import { AnalyticsMetrics } from "./analytics-metrics";
import { LocationAnalytics } from "./location-analytics";
import { DeviceAnalytics } from "./device-analytics";
import { RecentActivity } from "./recent-activity";

interface AnalyticsPanelProps {
  links: ProfileLink[];
}

interface Analytics {
  totalClicks: number;
  totalDownloads: number;
  linkStats: Record<string, { clicks: number; downloads: number }>;
}

export function AnalyticsPanel({ links }: AnalyticsPanelProps) {
  const [profileId, setProfileId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Get profile ID
  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setProfileId(profile.id);
      }
      setLoading(false);
    };

    getProfile();
  }, [supabase]);

  // Use the analytics service with auto-refresh every 2 minutes
  const {
    data: analyticsData,
    loading: analyticsLoading,
    error,
    refresh,
  } = useAnalyticsService({
    profileId,
    refreshInterval: 120000, // 2 minutes
  });

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

    // Delete all analytics data
    await Promise.all([
      supabase.from("link_analytics").delete().eq("profile_id", profile.id),
      supabase.from("visitor_sessions").delete().eq("profile_id", profile.id),
      supabase.from("page_views").delete().eq("profile_id", profile.id),
    ]);

    refresh();
  };

  const linkAnalytics = links
    .map((link) => ({
      ...link,
      clicks: analyticsData?.linkStats[link.id]?.clicks || 0,
      downloads: analyticsData?.linkStats[link.id]?.downloads || 0,
    }))
    .sort((a, b) => b.clicks + b.downloads - (a.clicks + a.downloads));

  const totalClicks = Object.values(analyticsData?.linkStats || {}).reduce(
    (sum, stat) => sum + stat.clicks,
    0
  );
  const totalDownloads = Object.values(analyticsData?.linkStats || {}).reduce(
    (sum, stat) => sum + stat.downloads,
    0
  );

  if (loading || analyticsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-sm text-red-600 text-center">
            Error loading analytics: {error}
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
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
              Comprehensive insights into visitor behavior and engagement
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              className="text-muted-foreground"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
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
      </div>

      {/* Metrics Overview */}
      <AnalyticsMetrics
        totalVisits={analyticsData?.totalVisits || 0}
        uniqueVisitors={analyticsData?.uniqueVisitors || 0}
        bounceRate={analyticsData?.bounceRate || 0}
        avgDuration={analyticsData?.avgDuration || 0}
      />

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Link Performance Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1.5">
                  <MousePointerClick className="h-4 w-4" />
                  Total Link Clicks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">
                  {totalClicks}
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
                  {totalDownloads}
                </p>
              </CardContent>
            </Card>
          </div>

          <RecentActivity
            sessions={analyticsData?.recentSessions || []}
            loading={false}
          />
        </TabsContent>

        <TabsContent value="visitors" className="space-y-4">
          <LocationAnalytics
            locations={analyticsData?.locations || []}
            loading={false}
          />
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
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
                    const totalInteractions = link.clicks + link.downloads;
                    const maxInteractions = Math.max(
                      ...linkAnalytics.map((l) => l.clicks + l.downloads)
                    );
                    const percentage =
                      maxInteractions > 0
                        ? (totalInteractions / maxInteractions) * 100
                        : 0;

                    return (
                      <div
                        key={link.id}
                        className="space-y-2 p-3 bg-secondary/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
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
                        {totalInteractions > 0 && (
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <DeviceAnalytics
            devices={analyticsData?.devices || {}}
            browsers={analyticsData?.browsers || {}}
            loading={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
