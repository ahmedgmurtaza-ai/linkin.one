  import { ImageResponse } from 'next/og';
  import { NextRequest } from 'next/server';

  export const runtime = 'edge';

  // Fetch profile data directly in edge runtime
  async function getProfile(username: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey });
      throw new Error('Supabase credentials not found');
    }

    console.log('Fetching profile for username:', username);

    // Fetch profile
    const profileResponse = await fetch(
      `${supabaseUrl}/rest/v1/profiles?username=eq.${username.toLowerCase()}&select=*`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', profileResponse.status, profileResponse.statusText);
      return null;
    }

    const profiles = await profileResponse.json();
    if (!profiles || profiles.length === 0) {
      return null;
    }

    const profile = profiles[0];

    // Fetch links
    const linksResponse = await fetch(
      `${supabaseUrl}/rest/v1/links?profile_id=eq.${profile.id}&select=*&order=position.asc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    const links = linksResponse.ok ? await linksResponse.json() : [];

    return {
      username: profile.username,
      displayName: profile.display_name,
      description: profile.description,
      thumbnailUrl: profile.thumbnail_url,
      links,
    };
  }

  export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const username = searchParams.get('username');

      if (!username) {
        return new Response('Username is required', { status: 400 });
      }

      // Get profile data
      const profile = await getProfile(username);

      if (!profile) {
        return new Response('Profile not found', { status: 404 });
      }

      // Check if we're in development and log the data
      if (process.env.NODE_ENV === 'development') {
        console.log('OG Image - Profile data:', { username, profile });
      }

      const displayName = profile.displayName || username;
      const description = profile.description || `Connect with ${displayName} on all platforms`;
      const profileImage = profile.thumbnailUrl;

      // SVG-inspired template design with gradient background
      return new ImageResponse(
      (
  <div
    style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
      position: 'relative',
      padding: '32px',
      fontFamily: 'Inter',
    }}
  >
    {/* Soft glow overlay */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 60%)',
      }}
    />

    {/* Card wrapper */}
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '28px',
        padding: '40px',
        display: 'flex',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      {/* LEFT */}
      <div
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        {/* Avatar */}
        {profileImage ? (
          <img
            src={profileImage}
            width={260}
            height={260}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              border: '6px solid rgba(255,255,255,0.6)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
            }}
          />
        ) : (
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '4px solid rgba(255,255,255,0.25)',
            }}
          />
        )}

        {/* User info */}
        <div
          style={{
            textAlign: 'center',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 900 }}>{displayName}</div>
          <div style={{ fontSize: 32, opacity: 0.85 }}>@{username}</div>

          <div
            style={{
              fontSize: 26,
              opacity: 0.9,
              padding: '6px 18px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.12)',
              display: 'inline-flex',
              margin: '0 auto',
              fontWeight: 600,
            }}
          >
            linkin.one/{username}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          width: '50%',
          paddingLeft: '48px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#fff',
            marginBottom: '26px',
          }}
        >
          Connect with me
        </div>

        {/* Social icons grid (clean + aligned) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '22px',
            marginTop: '10px',
          }}
        >
          {[
            'facebook',
            'youtube',
            'github',
            'whatsapp',
            'tiktok',
            'linkedin',
            'cv',
            'website',
          ].map((name) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: '#fff',
                  borderRadius: '8px',
                }}
              ></div>
              <span style={{ color: '#fff', fontSize: 24, fontWeight: 600 }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </span>
            </div>
          ))}
        </div>

        {/* Branding footer */}
        <div
          style={{
            marginTop: 'auto',
            fontSize: 22,
            color: '#fff',
            opacity: 0.85,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '20px',
          }}
        >
          🔗 Powered by <span style={{ fontWeight: 800 }}>linkin.one</span>
        </div>
      </div>
    </div>
  </div>
)
,
        {
          width: 1200,
          height: 630,
        }
      );
    } catch (error) {
      console.error('Error generating OG image:', error);
      
      // Return more detailed error in development
      if (process.env.NODE_ENV === 'development') {
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate image', 
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return new Response('Failed to generate image', { status: 500 });
    }
  }
