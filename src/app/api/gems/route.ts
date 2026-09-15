import { NextResponse } from 'next/server';

export async function GET() {
  const gems = [
    {
      name: 'Hazels Studio',
      handle: '0xhazels',
      avatar: '/brand/mark.png',
      banner: 'https://hazels.io/brand/og.jpg',
      bio: 'Fall seven times, rise the eighth. 七転び八起き // The training hall of the Eighth Rise. Campaigns, drops and the creator race.',
      followers: 85200,
      following: 8,
      joined: '2024-03-01',
      hazels_score: '100%',
      verified: true,
    },
    {
      name: 'Rei',
      handle: 'rei_hzl',
      avatar: '/cards/0001.webp',
      banner: '/campaigns/gtd.webp',
      bio: 'Genesis Katana Prodigy of the Eighth Rise. Sharpening the blade every single day.',
      followers: 18400,
      following: 340,
      joined: '2024-05-12',
      hazels_score: '99.5%',
      verified: true,
    },
    {
      name: 'Kaede',
      handle: 'kaede_ink',
      avatar: '/cards/0002.webp',
      banner: '/campaigns/pulse.webp',
      bio: 'Ink & Shadow operative. Silent steps, absolute precision across the Dojo.',
      followers: 14200,
      following: 280,
      joined: '2024-06-20',
      hazels_score: '98.8%',
      verified: true,
    },
    {
      name: 'Hina',
      handle: 'hina_frames',
      avatar: '/cards/0003.webp',
      banner: '/campaigns/drops.webp',
      bio: 'Kinetic shield operator and Dojo builder. Anchoring the Eighth Rise.',
      followers: 12100,
      following: 410,
      joined: '2024-07-04',
      hazels_score: '97.4%',
      verified: true,
    },
    {
      name: 'Nahian',
      handle: 'yournahian',
      avatar: 'https://unavatar.io/x/yournahian',
      banner: null,
      bio: 'Eighth Rise contender & developer. Building companion tools for Hazels Studio.',
      followers: 2450,
      following: 890,
      joined: '2023-01-15',
      hazels_score: '96.2%',
      verified: true,
    },
  ];

  return NextResponse.json({
    ok: true,
    gems,
  });
}
