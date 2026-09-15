import React, { useState, useRef, useEffect } from 'react';
import { Download, Share2, Sparkles, RefreshCw, Copy, Check, Palette, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { exportHazelsCardPNG } from './HazelsCardCanvasExporter';
import { HazelsLogo, HazelsIcon } from './HazelsLogo';

export interface CardArchetype {
  id: string;
  title: string;
  series: string;
  rarity: string;
  glowColor: string;
  badgeEmoji: string;
  lore: string;
  image: string;
  iconBg: string;
}

// 10 100% Original Hazels Studio Characters from studio.hazels.io
export const HAZELS_ARCHETYPES: Record<string, CardArchetype> = {
  rei: {
    id: 'rei',
    title: 'Rei · Blade of Dawn',
    series: 'GENESIS WAVE 1',
    rarity: 'S+ MYTHIC',
    glowColor: '#FF2A5F',
    badgeEmoji: '🗡️',
    lore: 'Katana prodigy of the Eighth Rise. Turns discipline into unyielding momentum across the Dojo.',
    image: '/cards/0001.webp',
    iconBg: 'rgba(255, 42, 95, 0.25)',
  },
  kaede: {
    id: 'kaede',
    title: 'Kaede · Ink & Shadow',
    series: 'GENESIS WAVE 1',
    rarity: 'S TIER',
    glowColor: '#8B5CF6',
    badgeEmoji: '🥷',
    lore: 'Covert infiltrator who writes history in shadows. Silent steps, absolute precision.',
    image: '/cards/0002.webp',
    iconBg: 'rgba(139, 92, 246, 0.25)',
  },
  hina: {
    id: 'hina',
    title: 'Hina · Solar Sentinel',
    series: 'GENESIS WAVE 1',
    rarity: 'S TIER',
    glowColor: '#F59E0B',
    badgeEmoji: '🛡️',
    lore: 'Kinetic barrier specialist. Anchors the Dojo training hall against all external distortion.',
    image: '/cards/0003.webp',
    iconBg: 'rgba(245, 158, 11, 0.25)',
  },
  yuki: {
    id: 'yuki',
    title: 'Yuki · Frost Valkyrie',
    series: 'GENESIS WAVE 1',
    rarity: 'A TIER',
    glowColor: '#00E5FF',
    badgeEmoji: '❄️',
    lore: 'Sub-zero frontline guardian. Glaciates high-frequency anomalies with absolute zero finality.',
    image: '/cards/0004.webp',
    iconBg: 'rgba(0, 229, 255, 0.25)',
  },
  aoi: {
    id: 'aoi',
    title: 'Aoi · Cyber Ronin',
    series: 'GENESIS WAVE 1',
    rarity: 'A TIER',
    glowColor: '#3B82F6',
    badgeEmoji: '⚡',
    lore: 'Masterless warrior bound only to the ledger. Roams the digital perimeter with dual blades.',
    image: '/cards/0005.webp',
    iconBg: 'rgba(59, 130, 246, 0.25)',
  },
  sora: {
    id: 'sora',
    title: 'Sora · Aether Weaver',
    series: 'GENESIS WAVE 1',
    rarity: 'B TIER',
    glowColor: '#10B981',
    badgeEmoji: '🌪️',
    lore: 'Protocol mystic weaving high-dimensional currents into seamless creator broadcasts.',
    image: '/cards/0006.webp',
    iconBg: 'rgba(16, 185, 129, 0.25)',
  },
  ren: {
    id: 'ren',
    title: 'Ren · Iron Vanguard',
    series: 'GENESIS WAVE 1',
    rarity: 'B TIER',
    glowColor: '#EC4899',
    badgeEmoji: '⚙️',
    lore: 'Heavy armor bastion. The unyielding anvil upon which the Hazels movement is hammered.',
    image: '/cards/0007.webp',
    iconBg: 'rgba(236, 72, 153, 0.25)',
  },
  mai: {
    id: 'mai',
    title: 'Mai · Blossom Assassin',
    series: 'GENESIS WAVE 1',
    rarity: 'C TIER',
    glowColor: '#FF7597',
    badgeEmoji: '🌸',
    lore: 'Petal-storm skirmisher. Strikes through the noise like cherry blossoms on a spring wind.',
    image: '/cards/0008.webp',
    iconBg: 'rgba(255, 117, 151, 0.25)',
  },
  rin: {
    id: 'rin',
    title: 'Rin · Pulse Engineer',
    series: 'GENESIS WAVE 1',
    rarity: 'C TIER',
    glowColor: '#A78BFA',
    badgeEmoji: '🔮',
    lore: 'YORAI ledger engineer. Translates creator energy into perpetual momentum.',
    image: '/cards/0009.webp',
    iconBg: 'rgba(167, 139, 250, 0.25)',
  },
  kuro: {
    id: 'kuro',
    title: 'Kuro · Eighth Rise OG',
    series: 'GENESIS WAVE 1',
    rarity: 'S+ MYTHIC',
    glowColor: '#EF4444',
    badgeEmoji: '👑',
    lore: 'Legendary elder who stood before the torii gates when the first rise began.',
    image: '/cards/0010.webp',
    iconBg: 'rgba(239, 68, 68, 0.25)',
  },
};

const ARCHETYPES_LIST = Object.values(HAZELS_ARCHETYPES);

export const HazelsCards: React.FC = () => {
  const [handle, setHandle] = useState('yournahian');
  const [searchInput, setSearchInput] = useState('yournahian');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    avatar: string;
    totalImpressions: number;
    postCount: number;
  } | null>(null);

  // Opening & Flip States
  const [hasOpened, setHasOpened] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [openingStage, setOpeningStage] = useState<'idle' | 'charging' | 'revealed'>('idle');
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('rei');

  // 3D Carousel Customizer Modal
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Copy Feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [exportingPNG, setExportingPNG] = useState(false);

  // 3D Tilt Card Ref
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-fetch profile data on load
  useEffect(() => {
    fetchProfileData(handle);
  }, []);

  const fetchProfileData = async (userHandle: string) => {
    setLoading(true);
    const clean = userHandle.replace('@', '').trim();
    try {
      const res = await fetch(`/api/impressions?handle=${encodeURIComponent(clean)}`);
      const json = await res.json();
      let assignedArchetype = 'rei';

      if (json && json.ok) {
        setUserData({
          name: json.profile?.name || clean,
          avatar: json.profile?.avatar || `https://unavatar.io/x/${clean}`,
          totalImpressions: json.total_impressions || 0,
          postCount: json.post_count || 0,
        });

        // Deterministic assignment
        const imps = json.total_impressions || 0;
        if (imps >= 1000000) assignedArchetype = 'rei';
        else if (imps >= 500000) assignedArchetype = 'kaede';
        else if (imps >= 250000) assignedArchetype = 'hina';
        else if (imps >= 100000) assignedArchetype = 'yuki';
        else if (imps >= 50000) assignedArchetype = 'aoi';
        else if (imps >= 20000) assignedArchetype = 'sora';
        else assignedArchetype = 'mai';
      } else {
        setUserData({
          name: clean,
          avatar: `https://unavatar.io/x/${clean}`,
          totalImpressions: 12480,
          postCount: 14,
        });
        assignedArchetype = 'rei';
      }

      setSelectedArchetypeId(assignedArchetype);
      setCarouselIndex(ARCHETYPES_LIST.findIndex((a) => a.id === assignedArchetype));
    } catch {
      setUserData({
        name: clean,
        avatar: `https://unavatar.io/x/${clean}`,
        totalImpressions: 12480,
        postCount: 14,
      });
      setSelectedArchetypeId('rei');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const clean = searchInput.replace('@', '').trim();
    setHandle(clean);
    fetchProfileData(clean);
    setHasOpened(false);
    setIsFlipped(false);
    setOpeningStage('idle');
  };

  // Cinematic Pack Opening Ceremony
  const triggerOpenPack = () => {
    if (openingStage !== 'idle') return;
    setOpeningStage('charging');

    setTimeout(() => {
      setOpeningStage('revealed');
      setHasOpened(true);
      setIsFlipped(false);
    }, 1800);
  };

  const handleReplay = () => {
    setHasOpened(false);
    setIsFlipped(false);
    setOpeningStage('idle');
    setTimeout(() => {
      triggerOpenPack();
    }, 150);
  };

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  // 3D Tilt calculations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  const archetype = HAZELS_ARCHETYPES[selectedArchetypeId] || HAZELS_ARCHETYPES.rei;

  const handleEquipFromCarousel = (arch: CardArchetype) => {
    setSelectedArchetypeId(arch.id);
    setShowCarouselModal(false);
    if (!hasOpened) {
      setHasOpened(true);
      setOpeningStage('revealed');
      setIsFlipped(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!userData) return;
    setExportingPNG(true);
    try {
      const blob = await exportHazelsCardPNG({
        handle,
        avatarUrl: userData.avatar,
        totalImpressions: userData.totalImpressions,
        postCount: userData.postCount,
        archetypeId: archetype.id,
        archetypeTitle: archetype.title,
        archetypeLore: archetype.lore,
        glowColor: archetype.glowColor,
        rarity: archetype.rarity,
        image: archetype.image,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${handle}-hazels-card.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setExportingPNG(false);
    }
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(
      `I forged my official @0xhazels Collectible Card: ${archetype.badgeEmoji} ${archetype.title} (${archetype.rarity})!\n\n⚔️ YORAI Impressions: ${(userData?.totalImpressions || 0).toLocaleString()}\n🔥 GTD Race Season 01\n\nForge your Hazels Card on @0xhazels Trace:`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="monad-cards-stage animate-fade-in">
      {/* Background Ambient Beams */}
      <div className="spotlight-beam beam-left" />
      <div className="spotlight-beam beam-right" />

      {/* Top Handle Search */}
      <div className="cards-search-toolbar">
        <form onSubmit={handleSearch} className="monad-search-form">
          <div className="monad-input-wrapper">
            <span className="monad-input-prefix">@</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter your X username to forge card"
              className="monad-handle-input"
            />
          </div>
          <button type="submit" disabled={loading} className="monad-forge-btn">
            <Sparkles style={{ width: '16px', height: '16px' }} />
            <span>{loading ? 'Auditing GTD Stats...' : 'Forge & Reveal Card'}</span>
          </button>
        </form>
      </div>

      {/* Main 2-Column Stage */}
      <div className="monad-showcase-container">
        {/* Left Column: Interactive 3D Card */}
        <div className="monad-card-interactive-col">
          <div
            className={`monad-card-3d-wrapper ${openingStage === 'charging' ? 'is-charging-energy' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={cardRef}
          >
            {/* Flippable Card Inner */}
            <div className={`monad-card-flipper ${isFlipped || !hasOpened ? 'is-flipped' : ''}`}>
              {/* CARD FRONT */}
              <div
                className="monad-card-face monad-card-front"
                style={{
                  border: `2px solid ${archetype.glowColor}`,
                  boxShadow: `0 0 45px ${archetype.glowColor}55, 0 20px 40px rgba(0,0,0,0.8)`,
                }}
              >
                {/* Header: Series & Brand */}
                <div className="monad-card-header-bar">
                  <span className="monad-header-label">HAZELS CARDS</span>
                  <span className="monad-header-badge" style={{ color: archetype.glowColor }}>
                    GTD SERIES 1 // 七転び八起き
                  </span>
                </div>

                {/* Character Anime Illustration */}
                <div className="monad-character-portal">
                  <div
                    className="monad-image-glow-ring"
                    style={{
                      border: `2px solid ${archetype.glowColor}`,
                      background: `linear-gradient(135deg, ${archetype.glowColor}, #8B5CF6)`,
                    }}
                  />
                  <div className="monad-character-img-frame">
                    <img
                      src={archetype.image}
                      alt={archetype.title}
                      className="monad-character-img"
                    />
                  </div>
                </div>

                {/* User Nameplate */}
                <div className="monad-user-nameplate">
                  <div className="monad-nameplate-left">
                    <div
                      className="monad-user-avatar-wrap"
                      style={{ borderColor: archetype.glowColor }}
                    >
                      {userData?.avatar ? (
                        <img src={userData.avatar} alt={handle} className="monad-user-avatar" />
                      ) : (
                        <div className="monad-user-avatar-fallback">{handle.slice(0, 2).toUpperCase()}</div>
                      )}
                    </div>
                    <div className="monad-nameplate-text">
                      <div className="monad-nameplate-handle">@{handle}</div>
                      <div className="monad-nameplate-sub" style={{ color: archetype.glowColor }}>
                        VERIFIED GTD CONTENDER
                      </div>
                    </div>
                  </div>
                  <div className="monad-nameplate-star" style={{ color: archetype.glowColor }}>
                    ★
                  </div>
                </div>

                {/* Trait & Lore Box */}
                <div className="monad-trait-box">
                  <div className="monad-trait-top">
                    <div
                      className="monad-trait-icon-wrap"
                      style={{ background: archetype.iconBg }}
                    >
                      <span className="monad-trait-icon">{archetype.badgeEmoji}</span>
                    </div>
                    <div className="monad-trait-title-meta">
                      <div className="monad-trait-name" style={{ color: archetype.glowColor }}>
                        {archetype.title}
                      </div>
                      <div className="monad-trait-desc">
                        {archetype.lore}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Rarity & Stats */}
                <div className="monad-card-footer">
                  <div className="monad-rarity-chip" style={{ background: archetype.glowColor, color: '#000000', fontWeight: 900 }}>
                    {archetype.rarity}
                  </div>
                  <div className="monad-wave-badge">
                    <span>EIGHTH RISE</span>
                  </div>
                </div>
              </div>

              {/* CARD BACK (Unrevealed Holographic Pack Back) */}
              <div
                className="monad-card-face monad-card-back"
                style={{
                  border: '2px solid rgba(255, 42, 95, 0.7)',
                  boxShadow: '0 0 50px rgba(255, 42, 95, 0.5)',
                }}
              >
                <div className="monad-back-header">
                  <span>HAZELS STUDIO</span>
                  <span>GTD PACK 1</span>
                </div>

                <div className="monad-back-center-logo">
                  <div className="monad-back-emblem" style={{ borderColor: 'rgba(255, 42, 95, 0.4)', background: 'rgba(255, 42, 95, 0.1)', boxShadow: '0 0 35px rgba(255, 42, 95, 0.5)' }}>
                    <HazelsIcon size={56} />
                  </div>
                  <div className="monad-back-title" style={{ letterSpacing: '0.05em' }}>studio.hazels.io</div>
                  <div className="monad-back-subtitle" style={{ color: '#FF7597' }}>七転び八起き // EIGHTH RISE</div>
                </div>

                <div className="monad-back-cta">
                  <Sparkles style={{ width: '16px', height: '16px', color: '#FF2A5F' }} />
                  <span>{openingStage === 'charging' ? 'CHARGING YORAI ENERGY...' : 'CLICK TO REVEAL CARD'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Buttons Beside Card */}
          <div className="monad-floating-actions">
            <button
              type="button"
              onClick={toggleFlip}
              title={isFlipped ? 'Flip to Front' : 'Flip to Back'}
              className={`monad-action-circle ${!isFlipped ? 'active-flip' : ''}`}
            >
              <RefreshCw style={{ width: '18px', height: '18px' }} />
            </button>

            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={exportingPNG}
              title="Download Card PNG"
              className="monad-action-circle"
            >
              <Download style={{ width: '18px', height: '18px' }} />
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy Link"
              className="monad-action-circle"
            >
              {copiedLink ? (
                <Check style={{ width: '18px', height: '18px', color: '#10B981' }} />
              ) : (
                <Copy style={{ width: '18px', height: '18px' }} />
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Narrative Hero Showcase & Action Bar */}
        <div className="monad-narrative-col">
          <div className="hero-narrative-box">
            <div className="narrative-tag-chip" style={{ color: '#FF2A5F', borderColor: 'rgba(255, 42, 95, 0.35)', background: 'rgba(255, 42, 95, 0.1)' }}>
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span>{hasOpened ? 'EIGHTH RISE // VERIFIED WARRIOR' : 'GENESIS HAZELS PACK • UNREVEALED'}</span>
            </div>

            <h1 className="narrative-main-title">
              HAZELS <span className="gradient-text-amber" style={{ background: 'linear-gradient(135deg, #FF2A5F, #FF7597)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CARDS</span>
            </h1>

            <div className="narrative-wave-divider">
              <span className="wave-line" />
              <span className="wave-text" style={{ color: '#8B5CF6' }}>GTD RACE — SEASON 01</span>
              <span className="wave-line" />
            </div>

            <p className="narrative-quote">
              “Fall seven times, rise the eighth. Forged in the Dojo for the Hazels Community.”
            </p>

            <div className="narrative-forged-tag">
              Forged for <span className="forged-handle" style={{ color: '#FF7597' }}>@{handle}</span>
            </div>

            {/* CTAs */}
            <div className="narrative-actions-cluster">
              {!hasOpened ? (
                <button
                  type="button"
                  onClick={triggerOpenPack}
                  disabled={openingStage === 'charging'}
                  className="monad-claim-button"
                  style={{ background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)' }}
                >
                  <Sparkles style={{ width: '16px', height: '16px' }} />
                  <span>{openingStage === 'charging' ? 'Synthesizing Aura...' : '⚡ Open & Reveal Card ⚡'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleShareToX}
                  className="monad-claim-button"
                  style={{ background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)' }}
                >
                  <Share2 style={{ width: '16px', height: '16px' }} />
                  <span>Claim & Share to X</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowCarouselModal(true)}
                className="choose-yours-btn"
                style={{ borderColor: 'rgba(255, 42, 95, 0.4)', color: '#FF7597' }}
              >
                <Palette style={{ width: '16px', height: '16px' }} />
                <span>Choose Yours ({ARCHETYPES_LIST.length})</span>
              </button>

              {hasOpened && (
                <button
                  type="button"
                  onClick={handleReplay}
                  className="choose-yours-btn"
                  title="Replay Opening Ceremony"
                >
                  <RefreshCw style={{ width: '16px', height: '16px' }} />
                  <span>Replay</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Archetype Carousel Modal */}
      {showCarouselModal && (
        <div className="carousel-modal-overlay animate-fade-in">
          <div className="carousel-modal-container">
            <button
              onClick={() => setShowCarouselModal(false)}
              className="carousel-close-btn"
              title="Close modal"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <div className="carousel-header">
              <h2 className="carousel-title">CHOOSE YOURS</h2>
              <div className="carousel-subtitle" style={{ color: '#FF7597' }}>
                3D ARCHETYPE CAROUSEL // 10 GENESIS HAZELS WARRIORS
              </div>
            </div>

            <div className="carousel-stage">
              <button
                onClick={() =>
                  setCarouselIndex((prev) => (prev - 1 + ARCHETYPES_LIST.length) % ARCHETYPES_LIST.length)
                }
                className="carousel-nav-btn left"
                title="Previous Archetype"
              >
                <ChevronLeft style={{ width: '24px', height: '24px' }} />
              </button>

              <div className="carousel-cards-deck">
                {ARCHETYPES_LIST.map((arch, idx) => {
                  const offset = idx - carouselIndex;
                  const absOffset = Math.abs(offset);
                  if (absOffset > 2) return null;

                  const translateX = offset * 180;
                  const translateZ = -absOffset * 100;
                  const rotateY = offset * -20;
                  const opacity = 1 - absOffset * 0.3;
                  const isSelected = selectedArchetypeId === arch.id;

                  return (
                    <div
                      key={arch.id}
                      onClick={() => setCarouselIndex(idx)}
                      className={`carousel-card-item ${idx === carouselIndex ? 'active-center' : ''}`}
                      style={{
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                        opacity,
                        zIndex: 10 - absOffset,
                        borderColor: absOffset === 0 ? arch.glowColor : 'rgba(255,255,255,0.15)',
                        boxShadow:
                          absOffset === 0
                            ? `0 0 50px ${arch.glowColor}88, 0 0 100px ${arch.glowColor}44`
                            : 'none',
                      }}
                    >
                      {/* Card Content */}
                      <div className="monad-card-header-bar">
                        <span className="monad-header-label">HAZELS</span>
                        <span className="monad-header-badge" style={{ color: arch.glowColor }}>
                          {arch.series}
                        </span>
                      </div>

                      <div className="monad-character-portal" style={{ margin: '8px 0' }}>
                        <div
                          className="monad-image-glow-ring"
                          style={{
                            border: `2px solid ${arch.glowColor}`,
                            background: `linear-gradient(135deg, ${arch.glowColor}, #8B5CF6)`,
                          }}
                        />
                        <div className="monad-character-img-frame" style={{ width: '130px', height: '130px' }}>
                          <img
                            src={arch.image}
                            alt={arch.title}
                            className="monad-character-img"
                          />
                        </div>
                      </div>

                      <div className="monad-trait-box" style={{ padding: '8px' }}>
                        <div className="monad-trait-top">
                          <div
                            className="monad-trait-icon-wrap"
                            style={{ width: '32px', height: '32px', background: arch.iconBg }}
                          >
                            <span className="monad-trait-icon" style={{ fontSize: '16px' }}>{arch.badgeEmoji}</span>
                          </div>
                          <div className="monad-trait-title-meta">
                            <div className="monad-trait-name" style={{ color: arch.glowColor, fontSize: '13px' }}>
                              {arch.title}
                            </div>
                            <div className="monad-trait-desc" style={{ fontSize: '11px', WebkitLineClamp: 2 }}>
                              {arch.lore}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="monad-card-footer" style={{ marginTop: 'auto' }}>
                        <div className="monad-rarity-chip" style={{ background: arch.glowColor, color: '#000', fontWeight: 900, fontSize: '10px' }}>
                          {arch.rarity}
                        </div>
                        {isSelected && (
                          <span style={{ fontSize: '10px', color: '#10B981', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            EQUIPPED ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setCarouselIndex((prev) => (prev + 1) % ARCHETYPES_LIST.length)}
                className="carousel-nav-btn right"
                title="Next Archetype"
              >
                <ChevronRight style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            {/* Dots */}
            <div className="carousel-dots-row">
              {ARCHETYPES_LIST.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCarouselIndex(dotIdx)}
                  className={`carousel-dot ${dotIdx === carouselIndex ? 'active' : ''}`}
                />
              ))}
            </div>

            {/* Equip Button */}
            <div className="carousel-footer-action">
              <button
                onClick={() => handleEquipFromCarousel(ARCHETYPES_LIST[carouselIndex])}
                className="carousel-equip-btn"
                style={{
                  background: `linear-gradient(135deg, ${ARCHETYPES_LIST[carouselIndex].glowColor}, #8B5CF6)`,
                  boxShadow: `0 0 35px ${ARCHETYPES_LIST[carouselIndex].glowColor}99`,
                }}
              >
                <span>{ARCHETYPES_LIST[carouselIndex].badgeEmoji}</span>
                <span>Equip {ARCHETYPES_LIST[carouselIndex].title}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
