'use client';

import React, { useState } from 'react';
import { generateProofOfWorkPNG } from './CardCanvasExporter';
import { HazelsLogo } from './HazelsLogo';

interface ProfileData {
  name: string;
  screen_name: string;
  avatar: string;
  verified: boolean;
  followers: number;
}

interface HazelsPost {
  id: string;
  screen_name: string;
  created_at: string;
  views: number;
  likes: number;
  reposts: number;
  replies: number;
  text: string;
  url: string;
}

interface ImpressionsResponse {
  ok: boolean;
  profile: ProfileData;
  project: string;
  total_impressions: number;
  post_count: number;
  series: Array<{ t: string; v: number }>;
  posts?: HazelsPost[];
  error?: string;
}

const SAMPLE_HANDLES = ['0xhazels'];

export const ProofOfWork: React.FC = () => {
  const [handleInput, setHandleInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<ImpressionsResponse | null>(null);
  const [downloading, setDownloading] = useState(false);

  const fetchImpressions = async (usernameToFetch: string) => {
    const trimmed = usernameToFetch.trim().replace(/^@/, '');
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch('/api/impressions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || 'Failed to fetch Hazels metrics. Please try again.');
        return;
      }

      setData(json);
    } catch (err) {
      console.error(err);
      setError('Unable to reach server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchImpressions(handleInput);
  };

  const handleDownloadPNG = async () => {
    if (!data) return;
    setDownloading(true);
    try {
      const blob = await generateProofOfWorkPNG({
        name: data.profile.name,
        handle: data.profile.screen_name,
        avatar: data.profile.avatar,
        impressions: data.total_impressions,
        postCount: data.post_count,
        series: data.series,
      });

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.profile.screen_name}-hazels-proof.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const shareText = data
    ? encodeURIComponent(
        `I generated ${data.total_impressions.toLocaleString()} impressions contributing to @0xhazels (studio.hazels.io)! ⚔️\n\nVerify your Hazels Proof-of-Work on Hazels Trace:`
      )
    : '';

  const renderSparkline = () => {
    if (!data || !data.series || data.series.length < 2) return null;

    const width = 440;
    const height = 120;
    const paddingX = 10;
    const paddingY = 15;

    const values = data.series.map((d) => d.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = data.series.map((d, i) => {
      const x = paddingX + (i / (data.series.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((d.v - min) / range) * (height - paddingY * 2);
      return { x, y };
    });

    const d = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    }, '');

    const areaD = `${d} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
      <div className="proof-sparkline-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="proof-sparkline-svg"
        >
          <defs>
            <linearGradient id="hazelsGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF2A5F" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FF2A5F" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#hazelsGlow)" />
          <path
            d={d}
            fill="none"
            stroke="#FF2A5F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="4.5"
              fill="#FF2A5F"
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>
    );
  };

  const formatDateMonthYear = (dStr?: string) => {
    if (!dStr) return '';
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dStr;
    }
  };

  const bestPost = data?.posts && data.posts.length > 0
    ? [...data.posts].sort((a, b) => (b.views || 0) - (a.views || 0))[0]
    : null;

  return (
    <div className="pow-box">
      {!data && !loading && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '700', letterSpacing: '-0.03em', color: '#ffffff' }}>
              Hazels Proof of Work
            </h1>
            <p style={{ color: 'var(--rialo-text-muted)', fontSize: '14px', marginTop: '6px' }}>
              Measure and showcase your social contributions to studio.hazels.io.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="text"
              autoFocus
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              placeholder="Enter your X username"
              className="pow-input"
            />
            {handleInput.trim() && (
              <button type="submit" className="submit-btn" aria-label="Calculate Proof of Work">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M5 12h14" />
                  <path d="m13 5 7 7-7 7" />
                </svg>
              </button>
            )}
          </form>

          {error && (
            <p style={{ color: '#f87171', marginTop: '12px', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <div className="sample-handles">
            <span style={{ fontSize: '11px', color: 'var(--rialo-text-muted)', fontWeight: '600', marginRight: '4px' }}>
              Quick Try:
            </span>
            {SAMPLE_HANDLES.map((h) => (
              <button
                key={h}
                type="button"
                className="sample-chip"
                onClick={() => {
                  setHandleInput(h);
                  fetchImpressions(h);
                }}
              >
                @{h}
              </button>
            ))}
          </div>
        </>
      )}

      {loading && (
        <div
          style={{
            background: 'rgba(12, 12, 12, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--rialo-border)',
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <HazelsLogo size={32} showWordmark={false} />
          </div>
          <div className="loading-dots">
            <span className="dot" style={{ background: '#FF2A5F' }} />
            <span className="dot" style={{ background: '#FF2A5F' }} />
            <span className="dot" style={{ background: '#FF2A5F' }} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--rialo-text-muted)', marginTop: '12px', fontFamily: 'var(--font-mono)' }}>
            Auditing studio.hazels.io onchain & social proof...
          </p>
        </div>
      )}

      {data && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="proof-card">
            <div className="proof-card-header">
              <div className="user-profile-meta">
                <div className="avatar-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.profile.avatar}
                    alt={data.profile.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="user-names">
                  <div className="user-display-name">
                    <span>{data.profile.name}</span>
                    {data.profile.verified && (
                      <svg viewBox="0 0 24 24" fill="#1D9BF0" className="verified-icon">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                  </div>
                  <div className="user-handle">@{data.profile.screen_name}</div>
                </div>
              </div>

              <div className="rialo-target-tag" style={{ borderColor: 'rgba(255, 42, 95, 0.3)', color: '#FF2A5F', background: 'rgba(255, 42, 95, 0.08)' }}>
                <span>0xhazels</span>
              </div>
            </div>

            <div className="proof-stat-body">
              <div className="impressions-big-num">
                {data.total_impressions.toLocaleString()}
              </div>
              <div className="impressions-caption">
                Impressions generated for 0xhazels
              </div>
            </div>

            {renderSparkline()}

            {data.total_impressions === 0 && (
              <div style={{
                margin: '16px 0',
                padding: '16px',
                background: 'rgba(255, 42, 95, 0.05)',
                border: '1px dashed rgba(255, 42, 95, 0.3)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#FF7597', marginBottom: '4px' }}>
                  No Hazels contributions indexed yet
                </div>
                <div style={{ fontSize: '12px', color: 'var(--rialo-text-muted)', lineHeight: '1.4' }}>
                  Tweet mentioning <strong style={{ color: 'var(--rialo-text)' }}>@0xhazels</strong> or <strong style={{ color: 'var(--rialo-text)' }}>#hazels</strong> on X to start earning indexed Proof of Work!
                </div>
              </div>
            )}

            <div className="proof-date-footer">
              <span>
                {data.series && data.series.length > 0 ? `${formatDateMonthYear(data.series[0]?.t)} – ${formatDateMonthYear(data.series[data.series.length - 1]?.t)}` : 'Hazels Index'}
              </span>
              <button
                type="button"
                onClick={handleDownloadPNG}
                disabled={downloading}
                className="download-icon-btn"
                title="Download Badge PNG"
                aria-label="Download Badge PNG"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>

            <div className="proof-actions">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card-action-btn share"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share to X
              </a>

              <button
                type="button"
                onClick={handleDownloadPNG}
                disabled={downloading}
                className="card-action-btn download"
                style={{ background: '#FF2A5F', color: '#010101' }}
              >
                {downloading ? (
                  <span>Generating...</span>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="15" height="15">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download Card</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setData(null);
                  setHandleInput('');
                }}
                className="card-action-btn retry"
                title="Audit another username"
                aria-label="Audit another username"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>
            </div>
          </div>

          {bestPost && (
            <div
              style={{
                background: 'rgba(12, 12, 12, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 42, 95, 0.35)',
                padding: '18px 20px',
                boxShadow: '0 10px 30px rgba(255, 42, 95, 0.15)',
                color: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      background: 'rgba(255, 42, 95, 0.15)',
                      border: '1px solid rgba(255, 42, 95, 0.35)',
                      color: '#FF7597',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    🏆 Best Post About Hazels
                  </span>
                  <span style={{ fontSize: '12px', color: '#FF7597', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                    👁️ {bestPost.views.toLocaleString()} views
                  </span>
                </div>

                <a
                  href={bestPost.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#FF7597',
                    fontSize: '12px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>View on X</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="12" height="12">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--rialo-text)', margin: '0 0 10px 0', lineHeight: '1.5' }}>
                {bestPost.text}
              </p>

              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--rialo-text-muted)' }}>
                <span>❤️ {bestPost.likes || 0}</span>
                <span>🔄 {bestPost.reposts || 0}</span>
                <span>💬 {bestPost.replies || 0}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
