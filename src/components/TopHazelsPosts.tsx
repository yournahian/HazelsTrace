import React, { useState } from 'react';
import { Sparkles, Heart, Repeat, MessageCircle, ExternalLink, Flame } from 'lucide-react';

interface HazelsPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  date: string;
  text: string;
  likes: number;
  retweets: number;
  replies: number;
  url: string;
  tag: string;
}

const FEATURED_POSTS: HazelsPost[] = [
  {
    id: 'post-1',
    authorName: 'Hazels',
    authorHandle: '0xhazels',
    authorAvatar: '/brand/mark.png',
    date: 'Sep 12, 2026',
    text: 'Fall seven times, rise the eighth. 七転び八起き\n\nThe Dojo is open for Season 01. The creator race has begun. Check your standing, claim your GTD card, and let the work speak.',
    likes: 3420,
    retweets: 1250,
    replies: 418,
    url: 'https://x.com/0xhazels',
    tag: 'Official Announcement',
  },
  {
    id: 'post-2',
    authorName: 'Rei',
    authorHandle: 'rei_hzl',
    authorAvatar: '/cards/0001.webp',
    date: 'Sep 13, 2026',
    text: 'Sharpening the blade every single day. 12,000+ YORAI points locked on-chain in the GTD race. Who is challenging the crown in the Versus Arena?',
    likes: 1890,
    retweets: 620,
    replies: 195,
    url: 'https://x.com/0xhazels',
    tag: 'Creator Spotlight',
  },
  {
    id: 'post-3',
    authorName: 'Kaede',
    authorHandle: 'kaede_ink',
    authorAvatar: '/cards/0002.webp',
    date: 'Sep 14, 2026',
    text: 'Ink & Shadow. Silent discipline. The top 500 GTD spots are filling up fast on studio.hazels.io. Connect your X, no wallet required to start.',
    likes: 1450,
    retweets: 510,
    replies: 132,
    url: 'https://x.com/0xhazels',
    tag: 'GTD Race',
  },
  {
    id: 'post-4',
    authorName: 'Hina',
    authorHandle: 'hina_frames',
    authorAvatar: '/cards/0003.webp',
    date: 'Sep 14, 2026',
    text: 'Building kinetic barriers and forging custom Hazels cards. The 3D animations and anime archetypes are unmatched. Season 01 is just the start.',
    likes: 1280,
    retweets: 430,
    replies: 98,
    url: 'https://x.com/0xhazels',
    tag: 'Community',
  },
];

export const TopHazelsPosts: React.FC = () => {
  return (
    <div className="feature-view-container animate-fade-in">
      <div className="feature-header-wrap">
        <div
          className="feature-pill-badge"
          style={{
            borderColor: 'rgba(255, 42, 95, 0.4)',
            color: '#FF7597',
            background: 'rgba(255, 42, 95, 0.08)',
          }}
        >
          <Flame style={{ width: '14px', height: '14px' }} />
          <span>VIRAL TRANSMISSIONS // 反響</span>
        </div>
        <h2 className="feature-title">
          Top Posts About <span className="gradient-text-amber" style={{ background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hazels</span>
        </h2>
        <p className="feature-desc">
          Discover the highest-impact tweets, community discussions, and creative broadcasts from the @0xhazels Dojo.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="articles-cards-grid" style={{ marginTop: '24px' }}>
        {FEATURED_POSTS.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rialo-article-card"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={p.authorAvatar}
                  alt={p.authorName}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1.5px solid #FF2A5F',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{p.authorName}</div>
                  <div style={{ fontSize: '11px', color: '#FF7597', fontFamily: 'var(--font-mono)' }}>@{p.authorHandle}</div>
                </div>
              </div>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: 'rgba(255,42,95,0.1)',
                  border: '1px solid rgba(255,42,95,0.25)',
                  color: '#FF7597',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {p.tag}
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--arc-text-muted)', lineHeight: 1.5, margin: '0 0 16px 0', flex: 1, whiteSpace: 'pre-line' }}>
              {p.text}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--arc-text-dim)' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart style={{ width: '12px', height: '12px', color: '#FF2A5F' }} />
                  {p.likes.toLocaleString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Repeat style={{ width: '12px', height: '12px', color: '#8B5CF6' }} />
                  {p.retweets.toLocaleString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageCircle style={{ width: '12px', height: '12px' }} />
                  {p.replies.toLocaleString()}
                </span>
              </div>
              <ExternalLink style={{ width: '13px', height: '13px', color: '#FF7597' }} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
