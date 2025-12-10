"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgDuration: number;
  locations: LocationData[];
  devices: Record<string, number>;
  browsers: Record<string, number>;
  recentSessions: SessionData[];
  linkStats: Record<string, { clicks: number; downloads: number }>;
}

export interface LocationData {
  country: string;
  city: string;
  visits: number;
  latitude?: number;
  longitude?: number;
}

export interface SessionData {
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

interface UseAnalyticsServiceOptions {
  profileId?: string;
  startDate?: string;
  endDate?: string;
  refreshInterval?: number; // in milliseconds, 0 to disable
}

const CACHE_KEY = "analytics_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  data: AnalyticsData;
  timestamp: number;
  profileId: string;
}

function getCache(profileId: string): AnalyticsData | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(`${CACHE_KEY}_${profileId}`);
    if (cached) {
      const parsed: CachedData = JSON.parse(cached);
      const age = Date.now() - parsed.timestamp;
      if (age < CACHE_DURATION && parsed.profileId === profileId) {
        return parsed.data;
      }
    }
  } catch {
    // Ignore cache errors
  }
  return null;
}

function setCache(profileId: string, data: AnalyticsData) {
  if (typeof window === "undefined") return;

  try {
    const cached: CachedData = {
      data,
      timestamp: Date.now(),
      profileId,
    };
    localStorage.setItem(`${CACHE_KEY}_${profileId}`, JSON.stringify(cached));
  } catch {
    // Ignore cache errors
  }
}

export function useAnalyticsService({
  profileId,
  startDate,
  endDate,
  refreshInterval = 0,
}: UseAnalyticsServiceOptions = {}) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const supabase = createClient();

  const fetchAnalytics = useCallback(async () => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    // Check cache first
    const cached = getCache(profileId);
    if (cached && !startDate && !endDate) {
      setData(cached);
      setLoading(false);
      return;
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setError(null);

      // Fetch sessions with optimized query
      let query = supabase
        .from("visitor_sessions")
        .select("*")
        .eq("profile_id", profileId)
        .order("entry_time", { ascending: false })
        .limit(100); // Limit for performance

      if (startDate) {
        query = query.gte("entry_time", startDate);
      }
      if (endDate) {
        query = query.lte("entry_time", endDate);
      }

      const { data: sessions, error: sessionsError } = await query;

      if (sessionsError) throw sessionsError;

      // Fetch link analytics
      let linkQuery = supabase
        .from("link_analytics")
        .select("link_id, event_type")
        .eq("profile_id", profileId);

      if (startDate) {
        linkQuery = linkQuery.gte("created_at", startDate);
      }
      if (endDate) {
        linkQuery = linkQuery.lte("created_at", endDate);
      }

      const { data: linkAnalytics } = await linkQuery;

      // Process data efficiently
      const totalVisits = sessions?.length || 0;
      const uniqueVisitors = new Set(sessions?.map((s) => s.ip_address)).size;
      const bounceRate =
        sessions?.length
          ? (sessions.filter((s) => s.is_bounce).length / sessions.length) * 100
          : 0;

      const avgDuration =
        sessions?.length
          ? Math.round(
              sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) /
                sessions.length
            )
          : 0;

      // Process locations
      const locationMap = new Map<string, LocationData>();
      sessions?.forEach((session) => {
        if (session.country && session.country !== "Unknown") {
          const key = `${session.country}-${session.city}`;
          const existing = locationMap.get(key);
          if (existing) {
            existing.visits++;
          } else {
            locationMap.set(key, {
              country: session.country,
              city: session.city,
              visits: 1,
              latitude: session.latitude,
              longitude: session.longitude,
            });
          }
        }
      });

      const locations = Array.from(locationMap.values()).sort(
        (a, b) => b.visits - a.visits
      );

      // Process devices
      const devices: Record<string, number> = {};
      sessions?.forEach((session) => {
        devices[session.device_type] = (devices[session.device_type] || 0) + 1;
      });

      // Process browsers
      const browsers: Record<string, number> = {};
      sessions?.forEach((session) => {
        browsers[session.browser] = (browsers[session.browser] || 0) + 1;
      });

      // Process link stats
      const linkStats: Record<string, { clicks: number; downloads: number }> = {};
      linkAnalytics?.forEach((event) => {
        if (!linkStats[event.link_id]) {
          linkStats[event.link_id] = { clicks: 0, downloads: 0 };
        }
        if (event.event_type === "click") {
          linkStats[event.link_id].clicks++;
        } else if (event.event_type === "download") {
          linkStats[event.link_id].downloads++;
        }
      });

      const analyticsData: AnalyticsData = {
        totalVisits,
        uniqueVisitors,
        bounceRate,
        avgDuration,
        locations,
        devices,
        browsers,
        recentSessions: (sessions?.slice(0, 10) || []) as SessionData[],
        linkStats,
      };

      setData(analyticsData);

      // Cache the result
      if (!startDate && !endDate) {
        setCache(profileId, analyticsData);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Error fetching analytics:", err);
        setError(err.message || "Failed to fetch analytics");
      }
    } finally {
      setLoading(false);
    }
  }, [profileId, startDate, endDate, supabase]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    fetchAnalytics();

    // Set up auto-refresh if interval is specified
    let intervalId: NodeJS.Timeout | null = null;
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchAnalytics, refreshInterval);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchAnalytics, refreshInterval]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
