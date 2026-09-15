'use client';

import React, { useState } from 'react';
import { Share2, Sparkles, CheckCircle, Info } from 'lucide-react';
import { TierBadge } from './TierBadge';

interface ImpressionData {
  ok: boolean;
  username: string;
  total_impressions: number;
  post_count: number;
  profile?: {
    name: string;
    screen_name: string;
    avatar: string;
    followers: number;
    following: number;
    verified: boolean;
    bio?: string;
  };
  series?: Array<{ t: string; v: number }>;
}

export const ProofOfWork: React.FC = () => {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ImpressionData | null>(null);

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);
    const clean = handle.replace('@', '').trim();

    try {
      const res = await fetch(`/api/impressions?handle=${encodeURIComponent(clean)}`);
      const json = await res.json();

      if (json && json.ok) {
        setData(json);
      } else {
        setData({
          ok: true,
          username: clean,
          total_impressions: 0,
          post_count: 0,
          profile: {
            name: clean,
            screen_name: clean,
            avatar: `https://unavatar.io/x/${clean}`,
            followers: 0,
            following: 0,
            verified: false,
          },
        });
      }
    } catch {
      setData({
        ok: true,
        username: clean,
        total_impressions: 0,
        post_count: 0,
        profile: {
          name: clean,
          screen_name: clean,
          avatar: `https://unavatar.io/x/${clean}`,
          followers: 0,
          following: 0,
          verified: false,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShareToX = () => {
    if (!data) return;
    const text = encodeURIComponent(
      `I audited my Hazels Proof of Work! ⚔️\n\n✨ Total Impressions: ${data.total_impressions.toLocaleString()}\n📜 Verified Posts: ${data.post_count}\n\nAudit your Hazels metrics on Hazels Trace:`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const imps = data?.total_impressions || 0;

  return (
    <div className="feature-view-container animate-fade-in" style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="feature-header-wrap" style={{ textAlign: 'center', marginBottom: '28px' }}>
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
          <span>GTD RACE // SOCIAL SCORE & PROOF OF WORK</span>
        </div>

        <h2 className="feature-title" style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 10px 0' }}>
          Hazels <span style={{ background: 'linear-gradient(135deg, #FF2A5F, #FF7597)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Proof of Work</span>
        </h2>
        <p className="feature-desc" style={{ color: 'var(--arc-text-muted, #94A3B8)', fontSize: '14px', maxWidth: '580px', margin: '0 auto', lineHeight: 1.5 }}>
          Audit your X presence and measure your YORAI points, creator tier, and community impact across Hazels Studio (studio.hazels.io).
        </p>

        {/* Input Bar */}
        <form onSubmit={handleAudit} className="search-form" style={{ maxWidth: '480px', margin: '24px auto 0 auto' }}>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Enter your X username"
            className="pow-input"
          />
          {handle.trim() && (
            <button type="submit" disabled={loading} className="submit-btn" aria-label="Audit Proof of Work">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M5 12h14" />
                <path d="m13 5 7 7-7 7" />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            background: 'rgba(12, 16, 26, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 42, 95, 0.25)',
            borderRadius: '24px',
            padding: '48px 24px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            marginTop: '24px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255, 42, 95, 0.2)',
              borderTopColor: '#FF2A5F',
              borderRadius: '50%',
              margin: '0 auto 16px auto',
              animation: 'spin 1s linear infinite',
            }}
          />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Auditing Hazels Ledger...
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--arc-text-muted, #94A3B8)', marginTop: '8px' }}>
            Fetching verified community impressions and posts
          </p>
        </div>
      )}

      {/* Empty State when no handle has been searched */}
      {!data && !loading && (
        <div
          style={{
            marginTop: '20px',
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '24px',
            background: 'rgba(12, 16, 26, 0.5)',
            border: '1px dashed rgba(255, 42, 95, 0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ fontSize: '38px', marginBottom: '14px' }}>⚔️</div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#FFFFFF' }}>
            No Contender Audited Yet
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--arc-text-muted, #94A3B8)', maxWidth: '440px', margin: '8px auto 0 auto', lineHeight: 1.5 }}>
            Enter your X username in the search bar above to measure your YORAI points, verify GTD contributions, and unlock your Hazels Studio standing.
          </p>
        </div>
      )}

      {/* Result Cards Grid */}
      {data && !loading && (
        <div className="pow-result-grid animate-fade-in" style={{ marginTop: '24px' }}>
          {/* Main Contender Profile Card */}
          <div
            style={{
              padding: '26px',
              borderRadius: '24px',
              background: 'rgba(12, 16, 26, 0.85)',
              border: '1px solid rgba(255, 42, 95, 0.3)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255, 42, 95, 0.15)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={data.profile?.avatar || `https://unavatar.io/x/${data.username}`}
                  alt={data.username}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '2px solid #FF2A5F',
                    boxShadow: '0 0 20px rgba(255, 42, 95, 0.4)',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      {data.profile?.name || data.username}
                    </h3>
                    {data.profile?.verified && (
                      <CheckCircle style={{ width: '16px', height: '16px', color: '#3B82F6' }} />
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#FF7597', marginTop: '2px' }}>
                    @{data.username}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TierBadge impressions={imps} />
                <button
                  type="button"
                  onClick={handleShareToX}
                  style={{
                    background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 0 16px rgba(255, 42, 95, 0.3)',
                  }}
                >
                  <Share2 style={{ width: '14px', height: '14px' }} />
                  <span>Share Score</span>
                </button>
              </div>
            </div>

            {/* 3 Metric Stat Tiles */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginTop: '24px',
              }}
            >
              <div style={{ background: 'rgba(8, 11, 18, 0.7)', border: '1px solid rgba(255, 42, 95, 0.15)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--arc-text-muted, #94A3B8)', letterSpacing: '0.05em' }}>
                  YORAI IMPRESSIONS
                </div>
                <div style={{ color: '#00E5FF', fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>
                  {imps.toLocaleString()}
                </div>
              </div>

              <div style={{ background: 'rgba(8, 11, 18, 0.7)', border: '1px solid rgba(255, 42, 95, 0.15)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--arc-text-muted, #94A3B8)', letterSpacing: '0.05em' }}>
                  GTD CONTRIBUTIONS
                </div>
                <div style={{ color: '#FF7597', fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>
                  {data.post_count.toLocaleString()} Posts
                </div>
              </div>

              <div style={{ background: 'rgba(8, 11, 18, 0.7)', border: '1px solid rgba(255, 42, 95, 0.15)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--arc-text-muted, #94A3B8)', letterSpacing: '0.05em' }}>
                  DOJO SOCIAL SCORE
                </div>
                <div style={{ color: '#A855F7', fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>
                  {Math.round(imps / 10).toLocaleString()} PTS
                </div>
              </div>
            </div>

            {/* Zero impressions notice */}
            {imps === 0 && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 42, 95, 0.08)',
                  border: '1px solid rgba(255, 42, 95, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  color: '#E8E3D5',
                }}
              >
                <Info style={{ width: '16px', height: '16px', color: '#FF7597', flexShrink: 0 }} />
                <span>No Hazels posts or impressions detected yet for @{data.username}. Tweet about @0xhazels or studio.hazels.io to start generating Proof of Work!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
