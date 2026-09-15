import { NextRequest, NextResponse } from 'next/server';

interface TwitterUserResponse {
  data?: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
    verified?: boolean;
    description?: string;
    public_metrics?: {
      followers_count: number;
      following_count: number;
      tweet_count: number;
      listed_count: number;
    };
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('handle') || searchParams.get('username');
  if (!username) {
    return NextResponse.json({ ok: false, error: 'Username or handle parameter required' }, { status: 400 });
  }
  return handleImpressions(username);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUsername = body.username?.trim() || body.handle?.trim();

    if (!rawUsername) {
      return NextResponse.json({ ok: false, error: 'Username is required' }, { status: 400 });
    }

    return handleImpressions(rawUsername);
  } catch (error) {
    console.error('Impressions API route error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to calculate impressions' }, { status: 500 });
  }
}

async function handleImpressions(rawUsername: string) {
  try {
    const cleanUsername = rawUsername.replace(/^@/, '').trim();

    // 1. Try live Xerper data for 0xhazels or hazels project
    try {
      const xerperRes = await fetch('https://xerper.com/api/impressions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: JSON.stringify({
          username: cleanUsername,
          project: '0xhazels',
        }),
        next: { revalidate: 60 },
      });

      if (xerperRes.ok) {
        const xerperData = await xerperRes.json();
        if (xerperData.ok && typeof xerperData.total_impressions === 'number' && xerperData.total_impressions > 0) {
          return NextResponse.json({
            ok: true,
            username: xerperData.username || cleanUsername,
            project: '0xhazels',
            profile: {
              name: xerperData.profile?.name || cleanUsername,
              screen_name: xerperData.profile?.screen_name || cleanUsername,
              avatar:
                xerperData.profile?.avatar?.replace('_normal', '_400x400') ||
                `https://unavatar.io/x/${cleanUsername}`,
              banner: xerperData.profile?.banner || null,
              bio: xerperData.profile?.bio || '',
              followers: xerperData.profile?.followers || 0,
              following: xerperData.profile?.following || 0,
              verified: Boolean(xerperData.profile?.verified),
              joined: xerperData.profile?.joined || '',
            },
            project_profile: {
              name: 'Hazels Studio',
              handle: '0xhazels',
              avatar: 'https://studio.hazels.io/brand/mark.png',
            },
            total_impressions: xerperData.total_impressions,
            post_count: xerperData.post_count || 0,
            series: xerperData.series || [],
            posts: xerperData.posts || [],
          });
        }
      }
    } catch (err) {
      console.warn('Xerper request failed or no live data:', err);
    }

    // 2. Fetch real Twitter profile info if bearer token exists
    const bearerToken = process.env.X_API_BEARER_TOKEN;
    let profile = {
      name: cleanUsername,
      screen_name: cleanUsername,
      avatar: `https://unavatar.io/x/${cleanUsername}`,
      banner: null as string | null,
      bio: '',
      followers: 0,
      following: 0,
      verified: false,
      joined: '',
    };

    if (bearerToken) {
      try {
        const xRes = await fetch(
          `https://api.twitter.com/2/users/by/username/${cleanUsername}?user.fields=name,username,profile_image_url,verified,public_metrics,description,created_at`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
            next: { revalidate: 120 },
          }
        );

        if (xRes.ok) {
          const xData: TwitterUserResponse = await xRes.json();
          if (xData.data) {
            profile = {
              name: xData.data.name,
              screen_name: xData.data.username,
              avatar: xData.data.profile_image_url
                ? xData.data.profile_image_url.replace('_normal', '_400x400')
                : `https://unavatar.io/x/${cleanUsername}`,
              banner: null,
              bio: xData.data.description || '',
              followers: xData.data.public_metrics?.followers_count || 0,
              following: xData.data.public_metrics?.following_count || 0,
              verified: Boolean(xData.data.verified),
              joined: (xData.data as any).created_at || '',
            };
          }
        }
      } catch (err) {
        console.warn('X API request error:', err);
      }
    }

    // 3. No live impressions found for this handle under 0xhazels.
    // Return honest 0 metrics - NO FAKE NUMBERS!
    return NextResponse.json({
      ok: true,
      username: cleanUsername,
      project: '0xhazels',
      profile,
      project_profile: {
        name: 'Hazels Studio',
        handle: '0xhazels',
        avatar: 'https://studio.hazels.io/brand/mark.png',
      },
      total_impressions: 0,
      post_count: 0,
      series: [],
      posts: [],
    });
  } catch (error) {
    console.error('Impressions API route error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to calculate impressions' }, { status: 500 });
  }
}
