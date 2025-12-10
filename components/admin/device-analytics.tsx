"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Monitor, Tablet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

interface DeviceAnalyticsProps {
  devices: Record<string, number>;
  browsers: Record<string, number>;
  loading?: boolean;
}

export function DeviceAnalytics({ devices, browsers, loading = false }: DeviceAnalyticsProps) {
  const deviceData = useMemo(() => {
    const total = Object.values(devices).reduce((sum, count) => sum + count, 0);
    return Object.entries(devices).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }, [devices]);

  const browserData = useMemo(() => {
    const total = Object.values(browsers).reduce((sum, count) => sum + count, 0);
    return Object.entries(browsers)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [browsers]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      case "desktop":
      default:
        return Monitor;
    }
  };

  const getDeviceColor = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "mobile":
        return "bg-blue-600";
      case "tablet":
        return "bg-green-600";
      case "desktop":
      default:
        return "bg-purple-600";
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Device Types</CardTitle>
        </CardHeader>
        <CardContent>
          {deviceData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No device data available
            </p>
          ) : (
            <div className="space-y-4">
              {deviceData.map((device) => {
                const Icon = getDeviceIcon(device.name);
                const color = getDeviceColor(device.name);
                return (
                  <div key={device.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium capitalize">
                          {device.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {device.percentage.toFixed(1)}%
                        </span>
                        <span className="text-sm font-medium">
                          {device.count}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} transition-all`}
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Browser Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Browsers</CardTitle>
        </CardHeader>
        <CardContent>
          {browserData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No browser data available
            </p>
          ) : (
            <div className="space-y-4">
              {browserData.slice(0, 5).map((browser, index) => {
                const colors = [
                  "bg-orange-600",
                  "bg-cyan-600",
                  "bg-pink-600",
                  "bg-yellow-600",
                  "bg-indigo-600",
                ];
                return (
                  <div key={browser.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{browser.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {browser.percentage.toFixed(1)}%
                        </span>
                        <span className="text-sm font-medium">
                          {browser.count}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index % colors.length]} transition-all`}
                        style={{ width: `${browser.percentage}%` }}
                      />
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
