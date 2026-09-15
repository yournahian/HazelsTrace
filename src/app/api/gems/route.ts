import { NextResponse } from 'next/server';

export async function GET() {
  const gems = [
    {
      name: 'Hazels Studio',
      handle: '0xhazels',
      avatar: '/brand/mark.png',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
      bio: 'Fall seven times, rise the eighth. 七転び八起き // The training hall of the Eighth Rise. Attention Layer & Free Mint Launchpad on studio.hazels.io.',
      followers: 85200,
      following: 8,
      joined: '2024-03-01',
      hazels_score: '100%',
      verified: true,
    },
  ];

  return NextResponse.json({
    ok: true,
    projects: gems,
    gems: gems,
  });
}
