"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, Timer, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsMetricsProps {
  totalVisits: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgDuration: number;
  loading?: boolean;
}

export function AnalyticsMetrics({
  totalVisits,
  uniqueVisitors,
  bounceRate,
  avgDuration,
  loading = false,
}: AnalyticsMetricsProps) {
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const metrics = [
    {
      title: "Total Visits",
      value: totalVisits.toLocaleString(),
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Unique Visitors",
      value: uniqueVisitors.toLocaleString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "Bounce Rate",
      value: `${bounceRate.toFixed(1)}%`,
      icon: TrendingDown,
      color: bounceRate > 50 ? "text-red-600" : "text-yellow-600",
      bgColor: bounceRate > 50 ? "bg-red-100 dark:bg-red-950" : "bg-yellow-100 dark:bg-yellow-950",
    },
    {
      title: "Avg. Duration",
      value: formatDuration(avgDuration),
      icon: Timer,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
