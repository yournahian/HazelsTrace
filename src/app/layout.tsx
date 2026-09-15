import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hazels Trace | Proof of Work & GTD Race Engine (@0xhazels)',
  description:
    'The training hall of the Eighth Rise. Track, audit, and showcase your Proof-of-Work contributions, YORAI points, and collectible cards for Hazels Studio (studio.hazels.io / @0xhazels). Fall seven times, rise the eighth.',
  keywords: ['Hazels', 'Hazels Studio', '0xhazels', 'GTD Race', 'YORAI', 'Proof of Work', 'Eighth Rise', 'Anime Cards', 'Web3'],
  openGraph: {
    title: 'Hazels Trace | Measure Your Impact on Hazels Studio',
    description: 'Proof-of-work engagement engine, GTD Race tracker, and anime archetype cards for Hazels (@0xhazels).',
    url: 'https://hazelstrace.vercel.app',
    siteName: 'Hazels Trace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hazels Trace | Proof of Work & GTD Race Engine (@0xhazels)',
    description: 'The training hall of the Eighth Rise. Claim cards, track YORAI points, and duel in the Versus Arena.',
    creator: '@0xhazels',
  },
  icons: {
    icon: '/brand/mark.png',
    shortcut: '/brand/mark.png',
    apple: '/brand/mark.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@700;800&family=Noto+Serif+JP:wght@600;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-glow-orb orb-1" />
        <div className="bg-glow-orb orb-2" />
        <div className="bg-glow-orb orb-3" />
        <div className="noise-layer" />
        {children}
      </body>
    </html>
  );
}
