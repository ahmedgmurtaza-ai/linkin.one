"use client";

import { useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

interface TrackingOptions {
  profileId: string;
  enabled?: boolean;
}

const SESSION_KEY = "linkin_session_id";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    const timestamp = sessionStorage.getItem(`${SESSION_KEY}_timestamp`);

    // Check if session is still valid
    if (stored && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < SESSION_TIMEOUT) {
        // Update timestamp
        sessionStorage.setItem(`${SESSION_KEY}_timestamp`, Date.now().toString());
        return stored;
      }
    }

    // Create new session
    const sessionId = uuidv4();
    sessionStorage.setItem(SESSION_KEY, sessionId);
    sessionStorage.setItem(`${SESSION_KEY}_timestamp`, Date.now().toString());
    return sessionId;
  } catch {
    return uuidv4();
  }
}

export function useVisitorTracking({ profileId, enabled = true }: TrackingOptions) {
  const sessionId = useRef<string>("");
  const currentPage = useRef<string>("");
  const pageStartTime = useRef<number>(0);
  const isTracking = useRef(false);

  // Track page view
  const trackPageView = useCallback(
    async (pagePath?: string) => {
      if (!enabled || !profileId || isTracking.current) return;

      try {
        isTracking.current = true;
        const path = pagePath || window.location.pathname;
        const referrer = document.referrer;
        const timeOnPreviousPage = pageStartTime.current
          ? Math.round((Date.now() - pageStartTime.current) / 1000)
          : null;

        // Update tracking refs
        currentPage.current = path;
        pageStartTime.current = Date.now();

        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId,
            sessionId: sessionId.current,
            pagePath: path,
            referrer,
            eventType: "pageview",
            timeOnPage: timeOnPreviousPage,
          }),
          keepalive: true,
        });
      } catch (error) {
        console.error("Error tracking page view:", error);
      } finally {
        isTracking.current = false;
      }
    },
    [profileId, enabled]
  );

  // Track link click
  const trackLinkClick = useCallback(
    async (linkId: string, linkUrl: string) => {
      if (!enabled || !profileId) return;

      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId,
            sessionId: sessionId.current,
            pagePath: window.location.pathname,
            referrer: document.referrer,
            eventType: "click",
            linkId,
          }),
          keepalive: true,
        });
      } catch (error) {
        console.error("Error tracking link click:", error);
      }
    },
    [profileId, enabled]
  );

  // Track session end
  const trackSessionEnd = useCallback(() => {
    if (!enabled || !profileId || !currentPage.current) return;

    const timeOnPage = pageStartTime.current
      ? Math.round((Date.now() - pageStartTime.current) / 1000)
      : null;

    // Use sendBeacon for reliable tracking on page unload
    const data = JSON.stringify({
      profileId,
      sessionId: sessionId.current,
      pagePath: currentPage.current,
      eventType: "pageview",
      timeOnPage,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/track", data);
    }
  }, [profileId, enabled]);

  // Initialize tracking
  useEffect(() => {
    if (!enabled || !profileId) return;

    sessionId.current = getOrCreateSessionId();
    trackPageView();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        trackSessionEnd();
      } else if (document.visibilityState === "visible") {
        trackPageView();
      }
    };

    // Track before unload
    const handleBeforeUnload = () => {
      trackSessionEnd();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Update session timestamp periodically
    const intervalId = setInterval(() => {
      getOrCreateSessionId(); // This updates the timestamp
    }, 60000); // Every minute

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(intervalId);
      trackSessionEnd();
    };
  }, [profileId, enabled, trackPageView, trackSessionEnd]);

  return {
    trackPageView,
    trackLinkClick,
    sessionId: sessionId.current,
  };
}
