"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

interface Session {
  id: string;
  country: string;
  city: string;
  browser: string;
  device_type: string;
  entry_time: string;
  duration_seconds: number;
  page_views: number;
  is_bounce: boolean;
}

interface RecentActivityProps {
  sessions: Session[];
  loading?: boolean;
}

export function RecentActivity({ sessions, loading = false }: RecentActivityProps) {
  const formattedSessions = useMemo(() => {
    return sessions.map((session) => {
      const date = new Date(session.entry_time);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeAgo = "";
      if (diffDays > 0) {
        timeAgo = `${diffDays}d ago`;
      } else if (diffHours > 0) {
        timeAgo = `${diffHours}h ago`;
      } else if (diffMins > 0) {
        timeAgo = `${diffMins}m ago`;
      } else {
        timeAgo = "Just now";
      }

      const duration = session.duration_seconds
        ? session.duration_seconds < 60
          ? `${session.duration_seconds}s`
          : `${Math.floor(session.duration_seconds / 60)}m ${session.duration_seconds % 60}s`
        : "Active";

      return {
        ...session,
        timeAgo,
        duration,
      };
    });
  }, [sessions]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity
          </p>
        </CardContent>
      </Card>
    );
  }

  const getDeviceEmoji = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "mobile":
        return "📱";
      case "tablet":
        return "📱";
      case "desktop":
      default:
        return "💻";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {formattedSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-shrink-0 text-2xl">
                {getDeviceEmoji(session.device_type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">
                      {session.city}, {session.country}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.browser} • {session.device_type}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {session.timeAgo}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">{session.page_views}</span> pages
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">{session.duration}</span>
                  </span>
                  {session.is_bounce && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300">
                      Bounce
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
