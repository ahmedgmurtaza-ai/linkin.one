import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';  // Fetch profile data directly in edge runtime
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

      const profileImage = profile.thumbnailUrl;
      
      // Get the background image
      const backgroundImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://linkin.one'}/og-background.png`;

      // Simple layout with background image and large avatar
      return new ImageResponse(
      (
  <div
    style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}
  >
    {/* Background Image */}
    <img
      src={backgroundImageUrl}
      width={1200}
      height={630}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />

    {/* Large Avatar - Centered */}
    <div style={{ display: 'flex', position: 'relative', zIndex: 10 }}>
      {profileImage ? (
        <img
          src={profileImage}
          width={400}
          height={400}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            border: '8px solid rgba(255,255,255,0.9)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        />
      ) : (
        <div
          style={{
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: '8px solid rgba(255,255,255,0.5)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            display: 'flex',
          }}
        />
      )}
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
