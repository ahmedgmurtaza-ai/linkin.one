import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper to get IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (real) {
    return real;
  }
  return "unknown";
}

// Helper to get location from IP
async function getLocationFromIP(ip: string) {
  try {
    // Using ipapi.co for geolocation (free tier: 1000 requests/day)
    // You can also use ip-api.com, ipgeolocation.io, or other services
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || "Unknown",
        countryCode: data.country_code || null,
        city: data.city || "Unknown",
        region: data.region || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      };
    }
  } catch (error) {
    console.error("Error fetching location:", error);
  }
  
  return {
    country: "Unknown",
    countryCode: null,
    city: "Unknown",
    region: null,
    latitude: null,
    longitude: null,
  };
}

// Helper to parse user agent
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Detect device type
  let deviceType = "desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    deviceType = "tablet";
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    deviceType = "mobile";
  }
  
  // Detect browser
  let browser = "Unknown";
  if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("chrome") && !ua.includes("edge")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("opera") || ua.includes("opr")) browser = "Opera";
  
  // Detect OS
  let os = "Unknown";
  if (ua.includes("win")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) os = "iOS";
  
  return { deviceType, browser, os };
}

// Track session (page view)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      profileId, 
      sessionId, 
      pagePath, 
      referrer, 
      eventType = "pageview",
      linkId,
      timeOnPage 
    } = body;

    if (!profileId || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const ip = getClientIP(request);
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const { deviceType, browser, os } = parseUserAgent(userAgent);

    // Check if session exists
    const { data: existingSession } = await supabase
      .from("visitor_sessions")
      .select("id, entry_time")
      .eq("session_id", sessionId)
      .single();

    if (!existingSession) {
      // Create new session with location data
      const location = await getLocationFromIP(ip);
      
      const { data: newSession, error: sessionError } = await supabase
        .from("visitor_sessions")
        .insert({
          profile_id: profileId,
          session_id: sessionId,
          ip_address: ip,
          country: location.country,
          city: location.city,
          region: location.region,
          latitude: location.latitude,
          longitude: location.longitude,
          user_agent: userAgent,
          browser,
          os,
          device_type: deviceType,
          referrer: referrer || null,
          landing_page: pagePath,
          entry_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) {
        console.error("Error creating session:", sessionError);
        return NextResponse.json(
          { error: "Failed to create session" },
          { status: 500 }
        );
      }

      // Update location analytics
      if (location.country !== "Unknown") {
        const { error: locationError } = await supabase.rpc("upsert_location_analytics", {
          p_profile_id: profileId,
          p_country: location.country,
          p_country_code: location.countryCode,
          p_city: location.city,
        });
        
        if (locationError) {
          console.error("Location analytics error:", locationError);
        }
      }

      // Track page view
      await supabase
        .from("page_views")
        .insert({
          session_id: newSession.id,
          profile_id: profileId,
          page_path: pagePath,
          referrer: referrer || null,
        });

    } else {
      // Update existing session
      await supabase
        .from("visitor_sessions")
        .update({
          exit_page: pagePath,
          exit_time: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSession.id);

      // Track page view
      await supabase
        .from("page_views")
        .insert({
          session_id: existingSession.id,
          profile_id: profileId,
          page_path: pagePath,
          referrer: referrer || null,
          time_on_page: timeOnPage || null,
        });
    }

    // Track link click if provided
    if (eventType === "click" && linkId) {
      const location = await getLocationFromIP(ip);
      
      await supabase
        .from("link_analytics")
        .insert({
          link_id: linkId,
          profile_id: profileId,
          session_id: existingSession?.id || null,
          event_type: "click",
          ip_address: ip,
          user_agent: userAgent,
          referrer: referrer || null,
          country: location.country,
          city: location.city,
          device_type: deviceType,
          browser,
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!profileId) {
      return NextResponse.json(
        { error: "Missing profileId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Build date filter
    let dateFilter = "";
    if (startDate && endDate) {
      dateFilter = `entry_time.gte.${startDate},entry_time.lte.${endDate}`;
    }

    // Get session data
    const { data: sessions, error } = await supabase
      .from("visitor_sessions")
      .select("*")
      .eq("profile_id", profileId)
      .order("entry_time", { ascending: false })
      .limit(1000);

    if (error) {
      throw error;
    }

    // Calculate metrics
    const totalVisits = sessions?.length || 0;
    const uniqueVisitors = new Set(sessions?.map(s => s.ip_address)).size;
    const bounceRate = sessions?.length 
      ? (sessions.filter(s => s.is_bounce).length / sessions.length) * 100 
      : 0;
    
    const avgDuration = sessions?.length
      ? sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length
      : 0;

    // Get location data
    const locationData = sessions?.reduce((acc: any, session) => {
      if (session.country && session.country !== "Unknown") {
        const key = `${session.country}-${session.city}`;
        if (!acc[key]) {
          acc[key] = {
            country: session.country,
            city: session.city,
            visits: 0,
            latitude: session.latitude,
            longitude: session.longitude,
          };
        }
        acc[key].visits++;
      }
      return acc;
    }, {});

    // Get device breakdown
    const deviceData = sessions?.reduce((acc: any, session) => {
      if (!acc[session.device_type]) {
        acc[session.device_type] = 0;
      }
      acc[session.device_type]++;
      return acc;
    }, {});

    // Get browser breakdown
    const browserData = sessions?.reduce((acc: any, session) => {
      if (!acc[session.browser]) {
        acc[session.browser] = 0;
      }
      acc[session.browser]++;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        totalVisits,
        uniqueVisitors,
        bounceRate: Math.round(bounceRate * 100) / 100,
        avgDuration: Math.round(avgDuration),
        locations: Object.values(locationData || {}),
        devices: deviceData || {},
        browsers: browserData || {},
        recentSessions: sessions?.slice(0, 10) || [],
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
