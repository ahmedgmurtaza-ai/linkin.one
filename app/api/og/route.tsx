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
    const linkCount = profile.links?.length || 0;

    // Generate the image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Main container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '60px 80px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              width: '1000px',
              height: '500px',
            }}
          >
            {/* Profile Image */}
            {profileImage && (
              <div
                style={{
                  display: 'flex',
                  width: '150px',
                  height: '150px',
                  borderRadius: '75px',
                  overflow: 'hidden',
                  border: '6px solid #667eea',
                  marginBottom: '30px',
                }}
              >
                <img
                  src={profileImage}
                  alt={displayName}
                  width="150"
                  height="150"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {/* Display Name */}
            <div
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#1a1a1a',
                marginBottom: '16px',
                textAlign: 'center',
                lineHeight: 1.2,
                maxWidth: '800px',
              }}
            >
              {displayName}
            </div>

            {/* Username */}
            <div
              style={{
                fontSize: '32px',
                color: '#667eea',
                marginBottom: '24px',
                fontWeight: 600,
              }}
            >
              @{username}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: '24px',
                  color: '#666',
                  textAlign: 'center',
                  maxWidth: '700px',
                  marginBottom: '30px',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {description}
              </div>
            )}

            {/* Links count and branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  color: '#888',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '24px' }}>🔗</span>
                {linkCount} {linkCount === 1 ? 'link' : 'links'}
              </div>
              
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                linkin.one
              </div>
            </div>
          </div>

          {/* Bottom watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            linkin.one/{username}
          </div>
        </div>
      ),
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
