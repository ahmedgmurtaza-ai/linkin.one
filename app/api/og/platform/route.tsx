import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getProfile } from '@/lib/profile-store';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const platform = searchParams.get('platform');

    if (!username || !platform) {
      return new Response('Username and platform are required', { status: 400 });
    }

    // Get profile data
    const profile = getProfile(username);

    if (!profile) {
      return new Response('Profile not found', { status: 404 });
    }

    const displayName = profile.displayName || username;
    const profileImage = profile.thumbnailUrl;
    const platformFormatted = platform.charAt(0).toUpperCase() + platform.slice(1);

    // Find the specific link for this platform
    const link = profile.links?.find(
      (l) => l.platform.toLowerCase() === platform.toLowerCase()
    );

    // Platform icons/emojis
    const platformEmoji: Record<string, string> = {
      linkedin: '💼',
      github: '💻',
      twitter: '🐦',
      x: '✖️',
      instagram: '📸',
      youtube: '📺',
      facebook: '👤',
      tiktok: '🎵',
      website: '🌐',
      email: '✉️',
      medium: '📝',
      dribbble: '🎨',
      behance: '🎨',
      discord: '💬',
      telegram: '📱',
      whatsapp: '💚',
      spotify: '🎵',
    };

    const emoji = platformEmoji[platform.toLowerCase()] || '🔗';

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
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '60px 80px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              width: '1000px',
              height: '500px',
              gap: '60px',
            }}
          >
            {/* Left side - Profile info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              {/* Profile Image */}
              {profileImage && (
                <div
                  style={{
                    display: 'flex',
                    width: '120px',
                    height: '120px',
                    borderRadius: '60px',
                    overflow: 'hidden',
                    border: '5px solid #667eea',
                    marginBottom: '30px',
                  }}
                >
                  <img
                    src={profileImage}
                    alt={displayName}
                    width="120"
                    height="120"
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}

              {/* Display Name */}
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                  marginBottom: '12px',
                  lineHeight: 1.2,
                }}
              >
                {displayName}
              </div>

              {/* Username */}
              <div
                style={{
                  fontSize: '28px',
                  color: '#667eea',
                  marginBottom: '30px',
                  fontWeight: 600,
                }}
              >
                @{username}
              </div>

              {/* Link title if available */}
              {link?.title && (
                <div
                  style={{
                    fontSize: '22px',
                    color: '#666',
                    lineHeight: 1.4,
                  }}
                >
                  {link.title}
                </div>
              )}
            </div>

            {/* Right side - Platform badge */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#667eea',
                borderRadius: '20px',
                padding: '60px',
                width: '300px',
                height: '300px',
              }}
            >
              {/* Platform emoji */}
              <div
                style={{
                  fontSize: '120px',
                  marginBottom: '20px',
                }}
              >
                {emoji}
              </div>

              {/* Platform name */}
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                {platformFormatted}
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '0',
              right: '0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 40px',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              linkin.one
            </div>
            <div
              style={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              linkin.one/{username}/{platform}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating platform OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
