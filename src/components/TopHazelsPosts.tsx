'use client';

import React, { useState } from 'react';
import { Sparkles, Heart, Repeat2, MessageSquare, ExternalLink } from 'lucide-react';

interface HazelsPost {
  id: string;
  screen_name: string;
  created_at: string;
  views: number;
  likes: number;
  reposts: number;
  replies: number;
  text: string;
  author_name: string;
  author_avatar: string;
  author_verified?: boolean;
  url: string;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

const SAMPLE_HANDLES = ['0xhazels'];

export const TopHazelsPosts: React.FC = () => {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<HazelsPost[]>([]);
  const [searchedUser, setSearchedUser] = useState('');

  const fetchTopPosts = async (targetHandle: string) => {
    const clean = targetHandle.trim().replace(/^@/, '');
    if (!clean) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/impressions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: clean }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Failed to fetch posts');
        return;
      }

      const allPosts: HazelsPost[] = data.posts || [];
      const sorted = allPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
      setPosts(sorted);
      setSearchedUser(data.profile?.screen_name || clean);
      if (sorted.length === 0) {
        setError(`No Hazels posts detected for @${clean}. Try another handle or post about @0xhazels!`);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load Hazels posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTopPosts(handle);
  };

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
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
          <span>VIRAL TRANSMISSIONS // 反響</span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display, sans-serif)', color: '#ffffff', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
          Top Posts About <span style={{ background: 'linear-gradient(135deg, #FF2A5F, #FF7597)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hazels</span>
        </h2>
        <p style={{ color: 'var(--arc-text-muted, #94A3B8)', fontSize: '14px', margin: '0 auto', maxWidth: '520px', lineHeight: 1.5 }}>
          Discover the highest-impact tweets, community discussions, and creative broadcasts from the Hazels ecosystem.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-form" style={{ marginBottom: '14px' }}>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="Enter an X username (e.g. 0xhazels)"
          className="pow-input"
        />
        {handle.trim() && (
          <button type="submit" disabled={loading} className="submit-btn" aria-label="Search Top Posts">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </button>
        )}
      </form>

      {/* Quick Try Handle Chips */}
      {posts.length === 0 && !loading && (
        <div className="sample-handles" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--arc-text-muted, #94A3B8)', fontWeight: '600', marginRight: '4px' }}>
            Quick Try:
          </span>
          {SAMPLE_HANDLES.map((h) => (
            <button
              key={h}
              type="button"
              className="sample-chip"
              onClick={() => {
                setHandle(h);
                fetchTopPosts(h);
              }}
              style={{
                background: 'rgba(255, 42, 95, 0.1)',
                color: '#FF7597',
                border: '1px solid rgba(255, 42, 95, 0.3)',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              @{h}
            </button>
          ))}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div
          style={{
            background: 'rgba(12, 16, 26, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 42, 95, 0.25)',
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid rgba(255, 42, 95, 0.2)',
              borderTopColor: '#FF2A5F',
              borderRadius: '50%',
              margin: '0 auto 16px auto',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ color: 'var(--arc-text-muted, #94A3B8)', fontSize: '14px', margin: 0 }}>
            Fetching top posts from the ledger...
          </p>
        </div>
      )}

      {/* Error / Empty notice */}
      {error && !loading && (
        <div
          style={{
            background: 'rgba(255, 42, 95, 0.08)',
            border: '1px solid rgba(255, 42, 95, 0.25)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            color: '#E8E3D5',
            fontSize: '13px',
            lineHeight: 1.5,
          }}
        >
          {error}
        </div>
      )}

      {/* Posts List */}
      {!loading && posts.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: 'var(--arc-text-muted, #94A3B8)', fontFamily: 'var(--font-mono, monospace)' }}>
              Top posts by @{searchedUser}
            </span>
            <span style={{ fontSize: '12px', color: '#FF7597', fontWeight: 700 }}>
              {posts.length} verified
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: 'rgba(12, 16, 26, 0.85)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid rgba(255, 42, 95, 0.2)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={post.author_avatar || `https://unavatar.io/x/${post.screen_name}`}
                      alt={post.author_name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255, 42, 95, 0.3)', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                        {post.author_name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--arc-text-muted, #94A3B8)' }}>
                        @{post.screen_name} • {formatDate(post.created_at)}
                      </div>
                    </div>
                  </div>

                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#FF7597', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', textDecoration: 'none' }}
                  >
                    <span>View</span>
                    <ExternalLink style={{ width: '13px', height: '13px' }} />
                  </a>
                </div>

                <p style={{ fontSize: '13px', color: '#E8E3D5', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                  {post.text}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--arc-text-muted, #94A3B8)', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#00E5FF', fontWeight: 700 }}>
                    {(post.views || 0).toLocaleString()} views
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart style={{ width: '12px', height: '12px', color: '#FF2A5F' }} />
                    {post.likes || 0}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Repeat2 style={{ width: '12px', height: '12px', color: '#22c55e' }} />
                    {post.reposts || 0}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageSquare style={{ width: '12px', height: '12px', color: '#8B5CF6' }} />
                    {post.replies || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
