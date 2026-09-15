import React, { useState } from 'react';
import { Trophy, TrendingUp, Sparkles, ExternalLink, Search } from 'lucide-react';
import { TierBadge } from './TierBadge';

interface GemLeader {
  rank: number;
  handle: string;
  name: string;
  avatar: string;
  points: number;
  tier: string;
  role: string;
}

const DEFAULT_LEADERS: GemLeader[] = [
  {
    rank: 1,
    handle: 'rei_hzl',
    name: 'Rei',
    avatar: '/cards/0001.webp',
    points: 124800,
    tier: 'TIER S+',
    role: 'Genesis Katana Prodigy',
  },
  {
    rank: 2,
    handle: 'kaede_ink',
    name: 'Kaede',
    avatar: '/cards/0002.webp',
    points: 119050,
    tier: 'TIER S',
    role: 'Ink & Shadow Operative',
  },
  {
    rank: 3,
    handle: 'hina_frames',
    name: 'Hina',
    avatar: '/cards/0003.webp',
    points: 103200,
    tier: 'TIER S',
    role: 'Kinetic Shield Sentinel',
  },
  {
    rank: 4,
    handle: 'yournahian',
    name: 'Nahian',
    avatar: 'https://unavatar.io/x/yournahian',
    points: 98450,
    tier: 'TIER A',
    role: 'Eighth Rise Contender',
  },
  {
    rank: 5,
    handle: '0xhazels',
    name: 'Hazels Studio',
    avatar: '/brand/mark.png',
    points: 540000,
    tier: 'TIER S+',
    role: 'Official Headquarters',
  },
  {
    rank: 6,
    handle: 'aoi_grid',
    name: 'Aoi',
    avatar: '/cards/0005.webp',
    points: 84200,
    tier: 'TIER A',
    role: 'Cyber Ronin Grid Enforcer',
  },
  {
    rank: 7,
    handle: 'sora_weaves',
    name: 'Sora',
    avatar: '/cards/0006.webp',
    points: 72100,
    tier: 'TIER B',
    role: 'Aether Protocol Weaver',
  },
  {
    rank: 8,
    handle: 'mai_blossom',
    name: 'Mai',
    avatar: '/cards/0008.webp',
    points: 59300,
    tier: 'TIER C',
    role: 'Petal Storm Skirmisher',
  },
];

export const HazelsGems: React.FC = () => {
  const [filter, setFilter] = useState('');

  const filtered = DEFAULT_LEADERS.filter(
    (l) =>
      l.handle.toLowerCase().includes(filter.toLowerCase()) ||
      l.name.toLowerCase().includes(filter.toLowerCase()) ||
      l.role.toLowerCase().includes(filter.toLowerCase())
  );

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
          <Trophy style={{ width: '14px', height: '14px' }} />
          <span>GTD RACE LEADERBOARD // 位</span>
        </div>
        <h2 className="feature-title">
          Hazels <span className="gradient-text-amber" style={{ background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gems</span>
        </h2>
        <p className="feature-desc">
          Top ecosystem creators, artists, and contenders in the Hazels Dojo ranked by verified YORAI points and GTD contributions.
        </p>

        {/* Filter Input */}
        <div className="monad-input-wrapper" style={{ maxWidth: '420px', marginTop: '20px' }}>
          <Search style={{ width: '16px', height: '16px', color: '#FF7597', marginLeft: '12px' }} />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search contender, handle, or role..."
            className="monad-handle-input"
            style={{ paddingLeft: '8px' }}
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="radar-rpc-card" style={{ marginTop: '24px', padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((leader, i) => (
            <div
              key={leader.handle}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: i === filtered.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                background: leader.rank <= 3 ? 'rgba(255, 42, 95, 0.03)' : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: leader.rank === 1 ? '#FF2A5F' : leader.rank === 2 ? '#8B5CF6' : leader.rank === 3 ? '#F59E0B' : 'var(--arc-text-dim)',
                    width: '28px',
                  }}
                >
                  #{leader.rank}
                </span>

                <img
                  src={leader.avatar}
                  alt={leader.name}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: `2px solid ${leader.rank === 1 ? '#FF2A5F' : 'rgba(255,255,255,0.1)'}`,
                    objectFit: 'cover',
                  }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                      {leader.name}
                    </span>
                    <a
                      href={`https://x.com/${leader.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '12px', color: '#FF7597', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
                    >
                      @{leader.handle}
                    </a>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--arc-text-muted)', marginTop: '2px' }}>
                    {leader.role}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <TierBadge impressions={leader.points} />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 800, color: '#00E5FF' }}>
                    {leader.points.toLocaleString()}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--arc-text-dim)' }}>
                    YORAI PTS
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
