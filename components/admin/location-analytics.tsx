"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useMemo, useEffect } from "react";
import "leaflet/dist/leaflet.css";

// Dynamically import map component to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface LocationData {
  country: string;
  city: string;
  visits: number;
  latitude?: number;
  longitude?: number;
}

interface LocationAnalyticsProps {
  locations: LocationData[];
  loading?: boolean;
}

export function LocationAnalytics({ locations, loading = false }: LocationAnalyticsProps) {
  const sortedLocations = useMemo(() => {
    return [...locations].sort((a, b) => b.visits - a.visits);
  }, [locations]);

  const topLocations = sortedLocations.slice(0, 10);
  const maxVisits = sortedLocations[0]?.visits || 1;

  const validMapLocations = useMemo(() => {
    return locations.filter(
      (loc) => loc.latitude && loc.longitude && !isNaN(loc.latitude) && !isNaN(loc.longitude)
    );
  }, [locations]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Visitor Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (locations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Visitor Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No location data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map View */}
      {validMapLocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Visitor Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {validMapLocations.map((location, index) => (
                  <CircleMarker
                    key={`${location.country}-${location.city}-${index}`}
                    center={[location.latitude!, location.longitude!]}
                    radius={Math.max(5, (location.visits / maxVisits) * 20)}
                    fillOpacity={0.6}
                    color="#3b82f6"
                    fillColor="#3b82f6"
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{location.city}, {location.country}</p>
                        <p className="text-muted-foreground">{location.visits} visits</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Locations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Top Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topLocations.map((location, index) => {
              const percentage = (location.visits / maxVisits) * 100;
              return (
                <div key={`${location.country}-${location.city}-${index}`} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {location.city}, {location.country}
                    </span>
                    <span className="text-muted-foreground">{location.visits} visits</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
