'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, ExternalLink, Search } from 'lucide-react';

interface GemContributor {
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  bio: string;
  followers: number;
  following: number;
  joined: string;
  hazels_score: string;
  verified: boolean;
}

function formatStatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

export const HazelsGems: React.FC = () => {
  const [gems, setGems] = useState<GemContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/gems')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && (data.projects || data.gems)) {
          setGems(data.projects || data.gems);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = gems.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.handle.toLowerCase().includes(search.toLowerCase()) ||
      g.bio.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div
          className="feature-pill-badge"
          style={{
            borderColor: 'rgba(255, 42, 95, 0.4)',
            color: '#FF7597',
            background: 'rgba(255, 42, 95, 0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 42, 95, 0.3)',
            marginBottom: '16px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          <span className="card-wave-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF2A5F', boxShadow: '0 0 10px #FF2A5F' }} />
          <span>GTD RACE LEADERBOARD // 位</span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display, sans-serif)', color: '#ffffff', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
          Hazels <span style={{ background: 'linear-gradient(135deg, #FF2A5F, #FF7597)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gems</span>
        </h2>
        <p style={{ color: 'var(--arc-text-muted, #94A3B8)', fontSize: '14px', margin: '0 auto', maxWidth: '480px', lineHeight: 1.5 }}>
          Top ecosystem voices, official channels, and builders across Hazels Studio.
        </p>
      </div>

      {/* Full-width Search Bar */}
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--arc-text-muted, #94A3B8)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ecosystem entities..."
            style={{
              width: '100%',
              borderRadius: '9999px',
              background: 'rgba(14, 16, 24, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 42, 95, 0.25)',
              padding: '14px 20px 14px 48px',
              fontSize: '14px',
              color: '#ffffff',
              outline: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid rgba(255, 42, 95, 0.2)',
              borderTopColor: '#FF2A5F',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((gem) => (
            <div
              key={gem.handle}
              style={{
                background: 'rgba(12, 16, 26, 0.88)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 42, 95, 0.25)',
                boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
              }}
            >
              <div
                style={{
                  height: '60px',
                  background: 'linear-gradient(135deg, #1A0710, #3B0D1E)',
                  borderBottom: '1px solid rgba(255, 42, 95, 0.15)',
                }}
              />
              <div style={{ padding: '0 20px 20px 20px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-30px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      border: '3px solid #0C101A',
                      overflow: 'hidden',
                      background: '#1A0710',
                      boxShadow: '0 4px 20px rgba(255, 42, 95, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={gem.avatar}
                      alt={gem.name}
                      style={{ width: '85%', height: '85%', objectFit: 'contain' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <a
                    href={`https://x.com/${gem.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '8px 18px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      boxShadow: '0 0 16px rgba(255, 42, 95, 0.3)',
                    }}
                  >
                    Follow on X
                  </a>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff' }}>{gem.name}</span>
                    <span style={{ color: '#FF7597', fontSize: '13px', fontFamily: 'var(--font-mono, monospace)' }}>
                      @{gem.handle}
                    </span>
                  </div>
                  <p style={{ color: 'var(--arc-text-muted, #94A3B8)', fontSize: '13px', margin: '8px 0 14px 0', lineHeight: 1.5 }}>
                    {gem.bio}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--arc-text-muted, #94A3B8)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    <span>
                      <strong style={{ color: '#ffffff' }}>{formatStatNumber(gem.followers)}</strong> Followers
                    </span>
                    <span>
                      <strong style={{ color: '#ffffff' }}>{gem.following}</strong> Following
                    </span>
                    <span style={{ marginLeft: 'auto', color: '#FF7597', fontWeight: 700 }}>
                      Score: {gem.hazels_score}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
