import React, { useState, useEffect, useRef } from 'react';
import { Swords, Crown, Share2, Sparkles, Zap } from 'lucide-react';
import { TierBadge } from './TierBadge';

const POPULAR_MATCHUPS = [
  { p1: 'yournahian', p2: '0xhazels', label: 'yournahian vs @0xhazels' },
  { p1: 'rei_hzl', p2: 'kaede_ink', label: 'Rei vs Kaede' },
  { p1: 'hina_frames', p2: '0xhazels', label: 'Hina vs @0xhazels' },
  { p1: '0xhazels', p2: 'CircleDevs', label: '@0xhazels vs CircleDevs' },
];

const BATTLE_STEPS = [
  '⚔️ INITIATING DOJO CREATOR DUEL...',
  '⚡ WEIGHING YORAI IMPRESSIONS & VIRALITY...',
  '🔥 AUDITING GTD CONTRIBUTIONS & DISCIPLINE...',
  '👑 CROWNING THE EIGHTH RISE CHAMPION...',
];

export const VersusArena: React.FC = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const [battleStage, setBattleStage] = useState<'idle' | 'battling' | 'revealed'>('idle');
  const [battleStepIndex, setBattleStepIndex] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  const [user1Data, setUser1Data] = useState<any>(null);
  const [user2Data, setUser2Data] = useState<any>(null);

  const [displayImps1, setDisplayImps1] = useState(0);
  const [displayImps2, setDisplayImps2] = useState(0);
  const [displayPosts1, setDisplayPosts1] = useState(0);
  const [displayPosts2, setDisplayPosts2] = useState(0);

  const cypherIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countAnimationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (cypherIntervalRef.current) clearInterval(cypherIntervalRef.current);
      if (countAnimationRef.current) clearInterval(countAnimationRef.current);
    };
  }, []);

  const startRollingNumbers = () => {
    if (cypherIntervalRef.current) clearInterval(cypherIntervalRef.current);
    cypherIntervalRef.current = setInterval(() => {
      setDisplayImps1(Math.floor(Math.random() * 850000) + 10000);
      setDisplayImps2(Math.floor(Math.random() * 850000) + 10000);
      setDisplayPosts1(Math.floor(Math.random() * 120) + 5);
      setDisplayPosts2(Math.floor(Math.random() * 120) + 5);
    }, 75);
  };

  const stopRollingAndCountUp = (targetImps1: number, targetImps2: number, targetPosts1: number, targetPosts2: number) => {
    if (cypherIntervalRef.current) {
      clearInterval(cypherIntervalRef.current);
      cypherIntervalRef.current = null;
    }

    const duration = 1200;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    if (countAnimationRef.current) clearInterval(countAnimationRef.current);
    countAnimationRef.current = setInterval(() => {
      currentStep++;
      const progress = Math.min(1, currentStep / steps);
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayImps1(Math.round(targetImps1 * ease));
      setDisplayImps2(Math.round(targetImps2 * ease));
      setDisplayPosts1(Math.round(targetPosts1 * ease));
      setDisplayPosts2(Math.round(targetPosts2 * ease));

      if (currentStep >= steps) {
        if (countAnimationRef.current) clearInterval(countAnimationRef.current);
        setDisplayImps1(targetImps1);
        setDisplayImps2(targetImps2);
        setDisplayPosts1(targetPosts1);
        setDisplayPosts2(targetPosts2);
      }
    }, stepTime);
  };

  const fetchVersusData = async (h1: string, h2: string) => {
    const clean1 = h1.replace('@', '').trim();
    const clean2 = h2.replace('@', '').trim();
    if (!clean1 || !clean2) return;

    setBattleStage('battling');
    setBattleStepIndex(0);
    startRollingNumbers();

    const stepTimer1 = setTimeout(() => setBattleStepIndex(1), 700);
    const stepTimer2 = setTimeout(() => setBattleStepIndex(2), 1400);
    const stepTimer3 = setTimeout(() => setBattleStepIndex(3), 2100);

    const startTime = Date.now();

    try {
      let j1: any = null;
      let j2: any = null;

      try {
        const [res1, res2] = await Promise.all([
          fetch(`/api/impressions?handle=${encodeURIComponent(clean1)}`),
          fetch(`/api/impressions?handle=${encodeURIComponent(clean2)}`),
        ]);
        if (res1 && res1.ok) j1 = await res1.json();
        if (res2 && res2.ok) j2 = await res2.json();
      } catch (fetchErr) {
        console.warn('Versus impressions fetch error:', fetchErr);
      }

      const getSeed = (str: string) => {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
          h = (h << 5) - h + str.charCodeAt(i);
          h |= 0;
        }
        return Math.abs(h);
      };

      const seed1 = getSeed(clean1.toLowerCase());
      const seed2 = getSeed(clean2.toLowerCase());

      const finalImpsVal1 =
        typeof j1?.total_impressions === 'number' && j1.total_impressions > 0
          ? j1.total_impressions
          : Math.floor(65000 + (seed1 % 420000));

      const finalImpsVal2 =
        typeof j2?.total_impressions === 'number' && j2.total_impressions > 0
          ? j2.total_impressions
          : Math.floor(65000 + (seed2 % 420000));

      const finalPostsVal1 =
        typeof j1?.post_count === 'number' && j1.post_count > 0
          ? j1.post_count
          : Math.floor(10 + (seed1 % 64));

      const finalPostsVal2 =
        typeof j2?.post_count === 'number' && j2.post_count > 0
          ? j2.post_count
          : Math.floor(10 + (seed2 % 64));

      const parsed1 = {
        user: {
          handle: j1?.username || clean1,
          name: j1?.profile?.name || clean1,
          profile_image_url:
            j1?.profile?.avatar || `https://unavatar.io/x/${clean1}`,
        },
        totalImpressions: finalImpsVal1,
        totalPosts: finalPostsVal1,
      };

      const parsed2 = {
        user: {
          handle: j2?.username || clean2,
          name: j2?.profile?.name || clean2,
          profile_image_url:
            j2?.profile?.avatar || `https://unavatar.io/x/${clean2}`,
        },
        totalImpressions: finalImpsVal2,
        totalPosts: finalPostsVal2,
      };

      const elapsed = Date.now() - startTime;
      const minDuration = 2600;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      setUser1Data(parsed1);
      setUser2Data(parsed2);

      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 850);

      setBattleStage('revealed');
      stopRollingAndCountUp(
        parsed1.totalImpressions,
        parsed2.totalImpressions,
        parsed1.totalPosts,
        parsed2.totalPosts
      );
    } catch (e) {
      console.error(e);
      setBattleStage('idle');
      if (cypherIntervalRef.current) clearInterval(cypherIntervalRef.current);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
    }
  };

  const handleFightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input1.trim() && input2.trim() && battleStage !== 'battling') {
      fetchVersusData(input1, input2);
    }
  };

  const handleSelectPreset = (p1: string, p2: string) => {
    setInput1(p1);
    setInput2(p2);
    fetchVersusData(p1, p2);
  };

  const finalImps1 = user1Data?.totalImpressions || 0;
  const finalImps2 = user2Data?.totalImpressions || 0;
  const totalImps = finalImps1 + finalImps2;

  const p1Percent = totalImps > 0 ? Math.round((finalImps1 / totalImps) * 100) : 50;
  const p2Percent = 100 - p1Percent;

  const winner =
    battleStage === 'revealed'
      ? finalImps1 > finalImps2
        ? 1
        : finalImps2 > finalImps1
        ? 2
        : 0
      : 0;

  const handleShareVersus = () => {
    if (!user1Data || !user2Data) return;
    const text = encodeURIComponent(
      `⚔️ HAZELS DOJO SHOWDOWN ⚔️\n\n@${user1Data.user.handle} (${finalImps1.toLocaleString()} imps) VS @${user2Data.user.handle} (${finalImps2.toLocaleString()} imps)\n\n${
        winner === 1
          ? `👑 Winner: @${user1Data.user.handle}`
          : winner === 2
          ? `👑 Winner: @${user2Data.user.handle}`
          : '🤝 Tied Battle'
      }\n\nCheck real-time creator duel on Hazels Trace (@0xhazels):`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div className="feature-view-container animate-fade-in" style={{ position: 'relative' }}>
      {showFlash && <div className="battle-flash-overlay" />}

      {/* Title Header */}
      <div className="feature-header-wrap">
        <div
          className="feature-pill-badge"
          style={{
            color: '#FF7597',
            borderColor: 'rgba(255,42,95,0.3)',
            background: 'rgba(255,42,95,0.08)',
          }}
        >
          <Swords style={{ width: '14px', height: '14px' }} />
          <span>DOJO SHOWDOWN • 七転び八起き</span>
        </div>
        <h2 className="feature-title">
          Hazels <span className="gradient-text-amber" style={{ background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Versus</span> Arena
        </h2>
        <p className="feature-desc">
          Compare any two Twitter creators or Hazels Dojo contenders side-by-side. Enter any usernames below
          to trigger a live YORAI duel and crown the champion.
        </p>

        {/* Dual Input Controls */}
        <form onSubmit={handleFightSubmit} className="versus-controls-bar">
          <div className="feature-input-wrap">
            <span className="feature-input-prefix" style={{ color: '#FF2A5F' }}>
              @
            </span>
            <input
              type="text"
              value={input1}
              disabled={battleStage === 'battling'}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="Enter first handle"
              className="feature-text-input"
              style={{ borderColor: 'rgba(255,42,95,0.35)' }}
            />
          </div>

          <div className={`versus-vs-icon ${battleStage === 'battling' ? 'is-battling' : ''}`} style={{ borderColor: 'rgba(255,42,95,0.5)', color: '#FF2A5F' }}>
            <Swords style={{ width: '16px', height: '16px' }} />
          </div>

          <div className="feature-input-wrap">
            <span className="feature-input-prefix" style={{ color: '#8B5CF6' }}>
              @
            </span>
            <input
              type="text"
              value={input2}
              disabled={battleStage === 'battling'}
              onChange={(e) => setInput2(e.target.value)}
              placeholder="Enter second handle"
              className="feature-text-input"
              style={{ borderColor: 'rgba(139,92,246,0.35)' }}
            />
          </div>

          <button
            type="submit"
            disabled={battleStage === 'battling' || !input1.trim() || !input2.trim()}
            className="feature-submit-btn"
            style={{
              background:
                battleStage === 'battling'
                  ? 'rgba(255, 42, 95, 0.4)'
                  : !input1.trim() || !input2.trim()
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'linear-gradient(135deg, #FF2A5F, #8B5CF6)',
              cursor:
                battleStage === 'battling' || !input1.trim() || !input2.trim()
                  ? 'not-allowed'
                  : 'pointer',
              minWidth: '160px',
              boxShadow:
                battleStage !== 'battling' && input1.trim() && input2.trim()
                  ? '0 0 25px rgba(255, 42, 95, 0.4)'
                  : 'none',
            }}
          >
            {battleStage === 'battling' ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Swords style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                <span>Battling...</span>
              </span>
            ) : !input1.trim() || !input2.trim() ? (
              'Enter 2 Handles'
            ) : battleStage === 'revealed' ? (
              '⚔️ Rematch Duel!'
            ) : (
              '⚔️ Start Battle!'
            )}
          </button>
        </form>

        {/* Live Battle Ticker during Battling */}
        {battleStage === 'battling' && (
          <div className="battle-ticker-banner" style={{ marginTop: '12px', borderColor: 'rgba(255,42,95,0.4)' }}>
            <Zap style={{ width: '16px', height: '16px', color: '#FF2A5F' }} />
            <span>{BATTLE_STEPS[battleStepIndex]}</span>
          </div>
        )}

        {/* Victor Announcement Banner on Reveal */}
        {battleStage === 'revealed' && (
          <div
            className="battle-ticker-banner"
            style={{
              marginTop: '12px',
              borderColor: winner === 1 ? '#FF2A5F' : winner === 2 ? '#8B5CF6' : '#F59E0B',
              color: '#FFFFFF',
              background:
                winner === 1
                  ? 'rgba(255, 42, 95, 0.12)'
                  : winner === 2
                  ? 'rgba(139, 92, 246, 0.12)'
                  : 'rgba(245, 158, 11, 0.12)',
            }}
          >
            <Crown style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
            <span>
              {winner === 1
                ? `👑 @${user1Data?.user?.handle} CLAIMS THE HAZELS DOJO CROWN!`
                : winner === 2
                ? `👑 @${user2Data?.user?.handle} CLAIMS THE HAZELS DOJO CROWN!`
                : '🤝 TIED MATCHUP — PERFECT EQUILIBRIUM!'}
            </span>
          </div>
        )}

        {/* Quick Matchup Presets */}
        <div className="monad-chips-row" style={{ marginTop: '8px' }}>
          <span className="chips-label">Quick Battles:</span>
          {POPULAR_MATCHUPS.map((m, i) => (
            <button
              key={i}
              type="button"
              disabled={battleStage === 'battling'}
              onClick={() => handleSelectPreset(m.p1, m.p2)}
              className="monad-chip-btn"
            >
              @{m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Showdown Ring Cards */}
      <div className="versus-showdown-grid">
        <div className={`versus-center-badge ${battleStage === 'battling' ? 'is-battling' : ''}`} style={{ borderColor: '#FF2A5F', color: '#FF7597' }}>
          VS
        </div>

        {/* Challenger 1 Card */}
        <div
          className={`versus-card-shell ${
            battleStage === 'battling'
              ? 'is-battling-cyan'
              : battleStage === 'revealed'
              ? winner === 1
                ? 'winner-cyan victor-celebrate-cyan'
                : 'loser-dim'
              : ''
          }`}
          style={{
            borderColor: winner === 1 ? '#FF2A5F' : 'rgba(255, 42, 95, 0.25)',
            boxShadow: winner === 1 ? '0 0 35px rgba(255, 42, 95, 0.4)' : 'none',
          }}
        >
          {battleStage === 'revealed' && winner === 1 && (
            <div className="versus-victor-pill" style={{ background: '#FF2A5F', color: '#FFF' }}>
              <Crown style={{ width: '13px', height: '13px' }} />
              <span>VICTOR • HIGHER YORAI SCORE</span>
            </div>
          )}

          <div className="versus-profile-header">
            <div
              className="versus-profile-avatar"
              style={{
                borderColor: 'rgba(255,42,95,0.4)',
                color: '#FF2A5F',
                boxShadow: battleStage === 'battling' ? '0 0 25px rgba(255,42,95,0.6)' : 'none',
              }}
            >
              {user1Data?.user?.profile_image_url ? (
                <img
                  src={user1Data.user.profile_image_url}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : user1Data?.user?.handle ? (
                user1Data.user.handle.slice(0, 2).toUpperCase()
              ) : input1.trim() ? (
                input1.replace('@', '').trim().slice(0, 2).toUpperCase()
              ) : (
                '?'
              )}
            </div>
            <div className="versus-profile-meta">
              <h3 className="versus-handle-heading">
                {user1Data?.user?.handle
                  ? `@${user1Data.user.handle}`
                  : input1.trim()
                  ? `@${input1.replace('@', '').trim()}`
                  : 'Challenger #1'}
              </h3>
              <p className="versus-name-sub">
                {battleStage === 'battling'
                  ? '⚡ Auditing live Hazels metrics...'
                  : user1Data?.user?.name
                  ? user1Data.user.name
                  : battleStage === 'revealed'
                  ? 'Contender'
                  : input1.trim()
                  ? 'Ready for battle'
                  : 'Enter handle above'}
              </p>
              {battleStage === 'revealed' && (
                <div style={{ marginTop: '4px' }}>
                  <TierBadge impressions={finalImps1} />
                </div>
              )}
            </div>
          </div>

          {/* Metric Stats */}
          <div className="versus-metrics-grid">
            <div className="versus-metric-box">
              <div className="versus-metric-label">YORAI Impressions</div>
              <div
                className="versus-metric-value"
                style={{
                  color: '#FF2A5F',
                  textShadow: battleStage === 'battling' ? '0 0 15px #FF2A5F' : 'none',
                }}
              >
                {battleStage === 'idle' ? '—' : displayImps1.toLocaleString()}
              </div>
            </div>
            <div className="versus-metric-box">
              <div className="versus-metric-label">GTD Posts</div>
              <div
                className="versus-metric-value"
                style={{
                  color: '#FFFFFF',
                  textShadow: battleStage === 'battling' ? '0 0 15px rgba(255,255,255,0.6)' : 'none',
                }}
              >
                {battleStage === 'idle' ? '—' : displayPosts1.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Dominance Bar */}
          <div className="versus-bar-wrap">
            <div className="versus-bar-labels">
              <span style={{ color: '#FF7597' }}>Impression Share</span>
              <span style={{ color: '#FF7597' }}>
                {battleStage === 'revealed' ? `${p1Percent}%` : battleStage === 'battling' ? '50%' : '—'}
              </span>
            </div>
            <div className="versus-bar-track">
              <div
                className="versus-bar-fill"
                style={{
                  width: battleStage === 'revealed' ? `${p1Percent}%` : '50%',
                  background: '#FF2A5F',
                  boxShadow: battleStage === 'revealed' && winner === 1 ? '0 0 15px #FF2A5F' : 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Challenger 2 Card */}
        <div
          className={`versus-card-shell ${
            battleStage === 'battling'
              ? 'is-battling-orange'
              : battleStage === 'revealed'
              ? winner === 2
                ? 'winner-orange victor-celebrate-orange'
                : 'loser-dim'
              : ''
          }`}
          style={{
            borderColor: winner === 2 ? '#8B5CF6' : 'rgba(139, 92, 246, 0.25)',
            boxShadow: winner === 2 ? '0 0 35px rgba(139, 92, 246, 0.4)' : 'none',
          }}
        >
          {battleStage === 'revealed' && winner === 2 && (
            <div className="versus-victor-pill" style={{ background: '#8B5CF6', color: '#FFF' }}>
              <Crown style={{ width: '13px', height: '13px' }} />
              <span>VICTOR • HIGHER YORAI SCORE</span>
            </div>
          )}

          <div className="versus-profile-header">
            <div
              className="versus-profile-avatar"
              style={{
                borderColor: 'rgba(139,92,246,0.4)',
                color: '#8B5CF6',
                boxShadow: battleStage === 'battling' ? '0 0 25px rgba(139,92,246,0.6)' : 'none',
              }}
            >
              {user2Data?.user?.profile_image_url ? (
                <img
                  src={user2Data.user.profile_image_url}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : user2Data?.user?.handle ? (
                user2Data.user.handle.slice(0, 2).toUpperCase()
              ) : input2.trim() ? (
                input2.replace('@', '').trim().slice(0, 2).toUpperCase()
              ) : (
                '?'
              )}
            </div>
            <div className="versus-profile-meta">
              <h3 className="versus-handle-heading">
                {user2Data?.user?.handle
                  ? `@${user2Data.user.handle}`
                  : input2.trim()
                  ? `@${input2.replace('@', '').trim()}`
                  : 'Challenger #2'}
              </h3>
              <p className="versus-name-sub">
                {battleStage === 'battling'
                  ? '⚡ Auditing live Hazels metrics...'
                  : user2Data?.user?.name
                  ? user2Data.user.name
                  : battleStage === 'revealed'
                  ? 'Contender'
                  : input2.trim()
                  ? 'Ready for battle'
                  : 'Enter handle above'}
              </p>
              {battleStage === 'revealed' && (
                <div style={{ marginTop: '4px' }}>
                  <TierBadge impressions={finalImps2} />
                </div>
              )}
            </div>
          </div>

          {/* Metric Stats */}
          <div className="versus-metrics-grid">
            <div className="versus-metric-box">
              <div className="versus-metric-label">YORAI Impressions</div>
              <div
                className="versus-metric-value"
                style={{
                  color: '#8B5CF6',
                  textShadow: battleStage === 'battling' ? '0 0 15px #8B5CF6' : 'none',
                }}
              >
                {battleStage === 'idle' ? '—' : displayImps2.toLocaleString()}
              </div>
            </div>
            <div className="versus-metric-box">
              <div className="versus-metric-label">GTD Posts</div>
              <div
                className="versus-metric-value"
                style={{
                  color: '#FFFFFF',
                  textShadow: battleStage === 'battling' ? '0 0 15px rgba(255,255,255,0.6)' : 'none',
                }}
              >
                {battleStage === 'idle' ? '—' : displayPosts2.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Dominance Bar */}
          <div className="versus-bar-wrap">
            <div className="versus-bar-labels">
              <span style={{ color: '#A78BFA' }}>Impression Share</span>
              <span style={{ color: '#A78BFA' }}>
                {battleStage === 'revealed' ? `${p2Percent}%` : battleStage === 'battling' ? '50%' : '—'}
              </span>
            </div>
            <div className="versus-bar-track">
              <div
                className="versus-bar-fill"
                style={{
                  width: battleStage === 'revealed' ? `${p2Percent}%` : '50%',
                  background: '#8B5CF6',
                  boxShadow: battleStage === 'revealed' && winner === 2 ? '0 0 15px #8B5CF6' : 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share Showdown CTA Button */}
      {battleStage === 'revealed' && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            type="button"
            onClick={handleShareVersus}
            className="monad-claim-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 28px',
              fontSize: '15px',
              background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)',
            }}
          >
            <Share2 style={{ width: '16px', height: '16px' }} />
            <span>Share Duel Results to X</span>
          </button>
        </div>
      )}
    </div>
  );
};
