-- Enhanced analytics tables for comprehensive visitor tracking

-- Create visitor sessions table
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  user_agent TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  referrer TEXT,
  landing_page TEXT,
  exit_page TEXT,
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  exit_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  page_views INTEGER DEFAULT 1,
  is_bounce BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create page views table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES visitor_sessions(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  referrer TEXT,
  view_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  time_on_page INTEGER, -- seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enhanced link analytics table (keep existing but add more fields)
ALTER TABLE link_analytics ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES visitor_sessions(id) ON DELETE SET NULL;
ALTER TABLE link_analytics ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE link_analytics ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE link_analytics ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE link_analytics ADD COLUMN IF NOT EXISTS browser TEXT;

-- Create analytics summary table for faster queries (materialized view alternative)
CREATE TABLE IF NOT EXISTS analytics_daily_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  total_page_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5, 2) DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0, -- seconds
  top_country TEXT,
  top_referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(profile_id, date)
);

-- Create location analytics table
CREATE TABLE IF NOT EXISTS location_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  country_code TEXT,
  city TEXT,
  visits INTEGER DEFAULT 1,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(profile_id, country, city, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_profile_id ON visitor_sessions(profile_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON visitor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_entry_time ON visitor_sessions(entry_time);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_country ON visitor_sessions(country);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_profile_id ON page_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_page_views_view_time ON page_views(view_time);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_summary_profile_id ON analytics_daily_summary(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_summary_date ON analytics_daily_summary(date);
CREATE INDEX IF NOT EXISTS idx_location_analytics_profile_id ON location_analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_location_analytics_date ON location_analytics(date);

-- Function to update session duration and bounce status
CREATE OR REPLACE FUNCTION update_session_metrics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE visitor_sessions
  SET 
    page_views = (SELECT COUNT(*) FROM page_views WHERE session_id = NEW.session_id),
    is_bounce = (SELECT COUNT(*) FROM page_views WHERE session_id = NEW.session_id) <= 1,
    updated_at = NOW()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update session metrics when page view is added
CREATE TRIGGER update_session_on_page_view
  AFTER INSERT ON page_views
  FOR EACH ROW
  EXECUTE FUNCTION update_session_metrics();

-- Function to calculate session duration
CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.exit_time IS NOT NULL THEN
    NEW.duration_seconds := EXTRACT(EPOCH FROM (NEW.exit_time - NEW.entry_time))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate duration on session update
CREATE TRIGGER calculate_duration_on_exit
  BEFORE UPDATE ON visitor_sessions
  FOR EACH ROW
  WHEN (NEW.exit_time IS NOT NULL AND OLD.exit_time IS NULL)
  EXECUTE FUNCTION calculate_session_duration();

-- Function to update daily summary
CREATE OR REPLACE FUNCTION update_daily_summary(p_profile_id UUID, p_date DATE)
RETURNS VOID AS $$
DECLARE
  v_total_visits INTEGER;
  v_unique_visitors INTEGER;
  v_total_page_views INTEGER;
  v_bounce_rate DECIMAL(5, 2);
  v_avg_duration INTEGER;
BEGIN
  -- Calculate metrics
  SELECT 
    COUNT(*),
    COUNT(DISTINCT session_id),
    SUM(page_views),
    ROUND(AVG(CASE WHEN is_bounce THEN 100 ELSE 0 END), 2),
    ROUND(AVG(NULLIF(duration_seconds, 0)))::INTEGER
  INTO 
    v_total_visits,
    v_unique_visitors,
    v_total_page_views,
    v_bounce_rate,
    v_avg_duration
  FROM visitor_sessions
  WHERE profile_id = p_profile_id
    AND DATE(entry_time) = p_date;

  -- Insert or update summary
  INSERT INTO analytics_daily_summary (
    profile_id, date, total_visits, unique_visitors, total_page_views,
    bounce_rate, avg_session_duration
  ) VALUES (
    p_profile_id, p_date, v_total_visits, v_unique_visitors, v_total_page_views,
    v_bounce_rate, v_avg_duration
  )
  ON CONFLICT (profile_id, date) 
  DO UPDATE SET
    total_visits = v_total_visits,
    unique_visitors = v_unique_visitors,
    total_page_views = v_total_page_views,
    bounce_rate = v_bounce_rate,
    avg_session_duration = v_avg_duration,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to upsert location analytics
CREATE OR REPLACE FUNCTION upsert_location_analytics(
  p_profile_id UUID,
  p_country TEXT,
  p_country_code TEXT,
  p_city TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO location_analytics (profile_id, country, country_code, city, visits, date)
  VALUES (p_profile_id, p_country, p_country_code, p_city, 1, CURRENT_DATE)
  ON CONFLICT (profile_id, country, city, date)
  DO UPDATE SET
    visits = location_analytics.visits + 1;
END;
$$ LANGUAGE plpgsql;
