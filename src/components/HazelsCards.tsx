'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Share2, Sparkles, RefreshCw, Copy, Check, Palette, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { exportHazelsCardPNG } from './HazelsCardCanvasExporter';

export interface CardArchetype {
  id: string;
  title: string;
  lore: string;
  rarity: 'MYTHIC' | 'LEGENDARY' | 'EPIC' | 'RARE';
  glowColor: string;
  image: string;
  badgeEmoji: string;
  iconBg: string;
}

export const HAZELS_ARCHETYPES: Record<string, CardArchetype> = {
  rei: {
    id: 'rei',
    title: 'Genesis Katana Prodigy',
    lore: 'Forged in the fires of the Dojo. Unrivaled speed with a katana that cuts through market noise.',
    rarity: 'MYTHIC',
    glowColor: '#FF2A5F',
    image: '/cards/0001.webp',
    badgeEmoji: '⚔️',
    iconBg: '#FF2A5F',
  },
  kaede: {
    id: 'kaede',
    title: 'Ink & Shadow Operative',
    lore: 'Master of stealth diplomacy. Moves silently between communities, leaving behind enduring impact.',
    rarity: 'LEGENDARY',
    glowColor: '#8B5CF6',
    image: '/cards/0002.webp',
    badgeEmoji: '🥷',
    iconBg: '#8B5CF6',
  },
  hina: {
    id: 'hina',
    title: 'Kinetic Shield Sentinel',
    lore: 'Defends the community with unwavering loyalty. Constructs energetic barriers against volatility.',
    rarity: 'EPIC',
    glowColor: '#00E5FF',
    image: '/cards/0003.webp',
    badgeEmoji: '🛡️',
    iconBg: '#00E5FF',
  },
  yuki: {
    id: 'yuki',
    title: 'Frost Archer Specialist',
    lore: 'Perfection in long-range precision. Freezes state transitions and executes flawless strategic calls.',
    rarity: 'RARE',
    glowColor: '#38BDF8',
    image: '/cards/0004.webp',
    badgeEmoji: '🏹',
    iconBg: '#38BDF8',
  },
  aoi: {
    id: 'aoi',
    title: 'Cyber Ronin Grid Enforcer',
    lore: 'Wanders the decentralized frontier upholding the code of honour. Pure decentralized discipline.',
    rarity: 'LEGENDARY',
    glowColor: '#F59E0B',
    image: '/cards/0005.webp',
    badgeEmoji: '⚡',
    iconBg: '#F59E0B',
  },
  sora: {
    id: 'sora',
    title: 'Aether Protocol Weaver',
    lore: 'Channels cosmic telemetry to weave liquid consensus across high-frequency chains.',
    rarity: 'MYTHIC',
    glowColor: '#EC4899',
    image: '/cards/0006.webp',
    badgeEmoji: '🌌',
    iconBg: '#EC4899',
  },
  ren: {
    id: 'ren',
    title: 'Blaze Blade Striker',
    lore: 'An untamable flame in the heart of battle. Overwhelms obstacles through boundless intensity.',
    rarity: 'EPIC',
    glowColor: '#EF4444',
    image: '/cards/0007.webp',
    badgeEmoji: '🔥',
    iconBg: '#EF4444',
  },
  mai: {
    id: 'mai',
    title: 'Petal Storm Skirmisher',
    lore: 'Dances between adversarial currents with grace. Turns tempestuous market winds into artistic triumphs.',
    rarity: 'RARE',
    glowColor: '#10B981',
    image: '/cards/0008.webp',
    badgeEmoji: '🌸',
    iconBg: '#10B981',
  },
  rin: {
    id: 'rin',
    title: 'Thunder Claw Vanguard',
    lore: 'Strikes like lightning with sub-second momentum. Leading the frontline charge of the Eighth Rise.',
    rarity: 'LEGENDARY',
    glowColor: '#EAB308',
    image: '/cards/0009.webp',
    badgeEmoji: '⚡',
    iconBg: '#EAB308',
  },
  kuro: {
    id: 'kuro',
    title: 'Shadow Veil Assassin',
    lore: 'The unseen sentinel of the Dojo. Executes strategic moves before anyone notices the ledger shift.',
    rarity: 'MYTHIC',
    glowColor: '#6366F1',
    image: '/cards/0010.webp',
    badgeEmoji: '🌑',
    iconBg: '#6366F1',
  },
};

const ARCHETYPES_LIST = Object.values(HAZELS_ARCHETYPES);

export const HazelsCards: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{
    user: { handle: string; name: string; profile_image_url: string };
    totalImpressions: number;
    totalPosts: number;
  } | null>(null);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('rei');
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [openingStage, setOpeningStage] = useState<'idle' | 'charging' | 'spinning' | 'revealed'>('idle');
  const [isFlipping, setIsFlipping] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 3D Carousel Customizer State
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // 3D tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });

  const toggleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (openingStage === 'charging' || openingStage === 'spinning') return;
    setIsFlipping(true);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
    setIsFlipped((prev) => !prev);
    setTimeout(() => {
      setIsFlipping(false);
    }, 700);
  };

  useEffect(() => {
    if (!isCustomizerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCarouselIndex((prev) => (prev - 1 + ARCHETYPES_LIST.length) % ARCHETYPES_LIST.length);
      } else if (e.key === 'ArrowRight') {
        setCarouselIndex((prev) => (prev + 1) % ARCHETYPES_LIST.length);
      } else if (e.key === 'Escape') {
        setIsCustomizerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCustomizerOpen]);

  const triggerOpeningSequence = (targetArchetypeId?: string) => {
    if (targetArchetypeId) setSelectedArchetypeId(targetArchetypeId);
    setIsFlipped(false);
    setOpeningStage('charging');

    setTimeout(() => {
      setOpeningStage('spinning');

      setTimeout(() => {
        setIsFlipped(true);
        setShowFlash(true);
      }, 450);

      setTimeout(() => {
        setOpeningStage('revealed');
        setHasRevealed(true);
        setTimeout(() => setShowFlash(false), 700);

        setTimeout(() => {
          setOpeningStage('idle');
        }, 600);
      }, 900);
    }, 550);
  };

  const fetchUserCard = async (targetHandle: string) => {
    const clean = targetHandle.replace('@', '').trim();
    if (!clean) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/impressions?handle=${encodeURIComponent(clean)}`);
      const json = await res.json();
      let assignedArchetype = 'rei';

      if (json && json.ok) {
        setUserData({
          user: {
            handle: json.username || clean,
            name: json.profile?.name || clean,
            profile_image_url: json.profile?.avatar || '',
          },
          totalImpressions: json.total_impressions || 0,
          totalPosts: json.post_count || 0,
        });

        const imps = json.total_impressions || 0;
        if (imps >= 100000) assignedArchetype = 'rei';
        else if (imps >= 50000) assignedArchetype = 'kaede';
        else if (imps >= 25000) assignedArchetype = 'hina';
        else if (imps >= 10000) assignedArchetype = 'yuki';
        else if (imps >= 5000) assignedArchetype = 'aoi';
        else if (imps >= 2000) assignedArchetype = 'sora';
        else assignedArchetype = 'mai';
      } else {
        setUserData({
          user: { handle: clean, name: clean, profile_image_url: `https://unavatar.io/x/${clean}` },
          totalImpressions: 0,
          totalPosts: 0,
        });
        assignedArchetype = 'rei';
      }

      setSelectedArchetypeId(assignedArchetype);
      setCarouselIndex(ARCHETYPES_LIST.findIndex((a) => a.id === assignedArchetype));
      triggerOpeningSequence(assignedArchetype);
    } catch {
      setUserData({
        user: { handle: clean, name: clean, profile_image_url: `https://unavatar.io/x/${clean}` },
        totalImpressions: 0,
        totalPosts: 0,
      });
      triggerOpeningSequence('rei');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (!hasRevealed) {
      triggerOpeningSequence();
    } else {
      toggleFlip();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || openingStage === 'charging' || openingStage === 'spinning') return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -14;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 14;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotX, y: rotY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const archetype = HAZELS_ARCHETYPES[selectedArchetypeId] || HAZELS_ARCHETYPES.rei;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const displayHandle = userData?.user?.handle || inputVal.trim() || 'Contender';
      const displayName = userData?.user?.name || displayHandle;
      const avatarUrl = userData?.user?.profile_image_url || `https://unavatar.io/x/${displayHandle}`;

      const blob = await exportHazelsCardPNG({
        handle: displayHandle,
        avatarUrl,
        archetypeId: archetype.id,
        archetypeTitle: archetype.title,
        archetypeLore: archetype.lore,
        rarity: archetype.rarity,
        glowColor: archetype.glowColor,
        totalImpressions: userData?.totalImpressions || 0,
        postCount: userData?.totalPosts || 0,
        image: archetype.image,
      });

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${displayHandle}-hazels-card.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareToX = () => {
    const displayHandle = userData?.user?.handle || inputVal.trim() || 'Contender';
    const text = encodeURIComponent(
      `I forged my official Hazels Collectible Card: ${archetype.badgeEmoji} ${archetype.title} (${archetype.rarity})! ⚔️\n\nFall seven times, rise the eighth. 七転び八起き\nForge your Hazels Card on Hazels Trace:`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const displayHandle = userData?.user?.handle || inputVal.trim() || 'Contender';

  const getAnimationClass = () => {
    if (openingStage === 'charging') return 'card-is-charging';
    if (openingStage === 'spinning') return 'card-is-spinning';
    if (openingStage === 'revealed') return 'card-just-revealed';
    if (isFlipping) return 'is-flipping-transition';
    return '';
  };

  const handleEquipFromCarousel = (arch: CardArchetype) => {
    setSelectedArchetypeId(arch.id);
    setIsCustomizerOpen(false);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 600);
  };

  return (
    <div className="monad-style-stage animate-fade-in">
      {/* Top Search Bar */}
      <div className="monad-search-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputVal.trim()) fetchUserCard(inputVal.trim());
          }}
          className="monad-search-form"
        >
          <div className="monad-input-pill">
            <span className="monad-input-prefix">@</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter your X username to forge card"
              className="monad-input-field"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="monad-btn-generate"
            style={{ background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)' }}
          >
            {loading ? 'Forging...' : '⚡ Forge & Reveal Card'}
          </button>
        </form>
      </div>

      {/* Main 3D Card Stage */}
      <div className="monad-stage-center">
        {/* Card and Action Side Buttons Wrapper */}
        <div className="monad-card-and-actions">
          {/* Ambient Spotlight Beams */}
          <div className={`card-spotlight-backdrop ${openingStage === 'charging' ? 'charging' : ''}`}>
            <div className="card-beam" style={{ background: 'linear-gradient(180deg, rgba(255, 42, 95, 0.4), transparent)' }} />
            <div className="card-beam" style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.4), transparent)' }} />
            <div className="card-beam" style={{ background: 'linear-gradient(180deg, rgba(255, 42, 95, 0.4), transparent)' }} />
          </div>

          {/* Flash burst overlay on reveal */}
          {showFlash && <div className="card-flash-burst" />}

          {/* Card Canvas with 3D Perspective */}
          <div
            className="monad-perspective-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={cardRef}
              onClick={handleCardClick}
              className={`monad-card-3d ${getAnimationClass()}`}
              style={{
                transform: openingStage === 'spinning' || openingStage === 'charging'
                  ? undefined
                  : `rotateX(${tilt.x}deg) rotateY(${isFlipped ? tilt.y : 180 - tilt.y}deg)`,
                boxShadow: isFlipped
                  ? `0 0 55px ${archetype.glowColor}66, 0 0 110px ${archetype.glowColor}33`
                  : '0 0 50px rgba(255, 42, 95, 0.5), 0 0 100px rgba(139, 92, 246, 0.3)',
              }}
            >
              {/* CARD FRONT */}
              <div
                className="monad-card-face monad-card-front"
                style={{
                  border: `2px solid ${archetype.glowColor}`,
                }}
              >
                {/* Holographic dynamic sheen */}
                <div
                  className="monad-holographic-sheen"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)`,
                  }}
                />

                {/* Top Nameplate Box with User's X Avatar */}
                <div className="monad-card-nameplate">
                  <div className="monad-nameplate-user">
                    {userData?.user?.profile_image_url ? (
                      <img
                        src={userData.user.profile_image_url}
                        alt={displayHandle}
                        className="monad-user-dp"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        className="monad-user-dp-placeholder"
                        style={{
                          background: `linear-gradient(135deg, ${archetype.glowColor}, #8B5CF6)`,
                        }}
                      >
                        {displayHandle.replace('@', '').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="monad-nameplate-text">
                      @{displayHandle}
                    </span>
                  </div>
                  <div
                    className="monad-nameplate-star"
                    style={{ color: archetype.glowColor }}
                  >
                    ★
                  </div>
                </div>

                {/* Character Artwork Frame */}
                <div className="monad-art-frame">
                  <img
                    src={archetype.image}
                    alt={archetype.title}
                    className="monad-art-image"
                  />
                </div>

                {/* Trait Box */}
                <div className="monad-trait-card">
                  <div
                    className="monad-trait-icon-box"
                    style={{ background: archetype.iconBg }}
                  >
                    <span className="monad-trait-icon">{archetype.badgeEmoji}</span>
                  </div>
                  <div className="monad-trait-content">
                    <div className="monad-trait-title" style={{ color: archetype.glowColor }}>
                      {archetype.title}
                    </div>
                    <p className="monad-trait-lore">
                      {archetype.lore}
                    </p>
                  </div>
                </div>

                {/* Bottom Footer: Brand & Wave Stamp */}
                <div className="monad-card-footer">
                  <span className="monad-footer-brand" style={{ color: '#FF7597' }}>Hazels Cards</span>
                  <div className="monad-wave-badge" style={{ background: 'rgba(255, 42, 95, 0.2)', border: '1px solid rgba(255, 42, 95, 0.4)' }}>
                    <span style={{ color: '#FF7597' }}>GENESIS 1</span>
                  </div>
                </div>
              </div>

              {/* CARD BACK */}
              <div
                className="monad-card-face monad-card-back"
                style={{
                  border: '2px solid rgba(255, 42, 95, 0.7)',
                  boxShadow: '0 0 50px rgba(255, 42, 95, 0.5)',
                  background: 'linear-gradient(135deg, #090B14 0%, #1A0710 100%)',
                }}
              >
                <div className="monad-back-header">
                  <span style={{ color: '#FF7597' }}>HAZELS CARDS</span>
                  <span style={{ color: '#8B5CF6' }}>SERIES 1</span>
                </div>

                <div className="monad-back-center-logo">
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(255, 42, 95, 0.1)',
                      border: '2px solid #FF2A5F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto',
                      boxShadow: '0 0 24px rgba(255, 42, 95, 0.4)',
                    }}
                  >
                    <img
                      src="/brand/mark.png"
                      alt="Hazels"
                      style={{ width: '60%', height: '60%', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="monad-back-title" style={{ color: '#FFFFFF' }}>studio.hazels.io</div>
                  <div className="monad-back-subtitle" style={{ color: '#FF7597' }}>七転び八起き // EIGHTH RISE</div>
                </div>

                <div className="monad-back-cta" style={{ color: '#FF2A5F' }}>
                  <Sparkles style={{ width: '16px', height: '16px', color: '#FF2A5F' }} />
                  <span>{openingStage === 'charging' ? 'CHARGING ENERGY...' : 'CLICK TO REVEAL CARD'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Buttons Beside Card */}
          <div className="monad-floating-actions">
            <button
              type="button"
              onClick={toggleFlip}
              title={isFlipped ? 'Flip to Card Back' : 'Flip to Card Front'}
              className={`monad-action-circle ${!isFlipped ? 'active-flip' : ''}`}
            >
              <RefreshCw
                style={{
                  width: '18px',
                  height: '18px',
                  transform: !isFlipped ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.4s ease',
                }}
              />
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              title="Download Card PNG"
              className="monad-action-circle"
            >
              <Download style={{ width: '18px', height: '18px' }} />
            </button>

            <button
              type="button"
              onClick={handleShareToX}
              title="Share to X"
              className="monad-action-circle"
            >
              <Share2 style={{ width: '18px', height: '18px' }} />
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy Link"
              className="monad-action-circle"
            >
              {copiedLink ? (
                <Check style={{ width: '18px', height: '18px', color: '#22c55e' }} />
              ) : (
                <Copy style={{ width: '18px', height: '18px' }} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              title="Browse Characters"
              className="monad-action-circle"
              style={{
                borderColor: 'rgba(255, 42, 95, 0.4)',
                background: 'rgba(255, 42, 95, 0.15)',
              }}
            >
              <Palette style={{ width: '18px', height: '18px', color: '#FF2A5F' }} />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Carousel Customizer Modal */}
      {isCustomizerOpen && (
        <div className="carousel-modal-overlay" onClick={() => setIsCustomizerOpen(false)}>
          <div className="carousel-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="carousel-modal-header">
              <div className="carousel-header-title">
                <h3>Choose Character Archetype</h3>
                <span className="carousel-counter">
                  {carouselIndex + 1} / {ARCHETYPES_LIST.length}
                </span>
              </div>
              <button
                type="button"
                className="carousel-close-btn"
                onClick={() => setIsCustomizerOpen(false)}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div className="carousel-viewport">
              <button
                type="button"
                className="carousel-nav-btn prev"
                onClick={() =>
                  setCarouselIndex((prev) => (prev - 1 + ARCHETYPES_LIST.length) % ARCHETYPES_LIST.length)
                }
              >
                <ChevronLeft style={{ width: '24px', height: '24px' }} />
              </button>

              <div className="carousel-3d-stage">
                {ARCHETYPES_LIST.map((arch, idx) => {
                  const offset = (idx - carouselIndex + ARCHETYPES_LIST.length) % ARCHETYPES_LIST.length;
                  let normalizedOffset = offset;
                  if (normalizedOffset > ARCHETYPES_LIST.length / 2) {
                    normalizedOffset -= ARCHETYPES_LIST.length;
                  }

                  const isCenter = normalizedOffset === 0;
                  const isVisible = Math.abs(normalizedOffset) <= 2;

                  if (!isVisible) return null;

                  const translateX = normalizedOffset * 180;
                  const translateZ = -Math.abs(normalizedOffset) * 120;
                  const rotateY = -normalizedOffset * 25;
                  const opacity = 1 - Math.abs(normalizedOffset) * 0.35;

                  return (
                    <div
                      key={arch.id}
                      className={`carousel-slide ${isCenter ? 'active' : ''}`}
                      style={{
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                        opacity,
                        zIndex: 10 - Math.abs(normalizedOffset),
                        borderColor: arch.glowColor,
                      }}
                      onClick={() => {
                        if (isCenter) {
                          handleEquipFromCarousel(arch);
                        } else {
                          setCarouselIndex(idx);
                        }
                      }}
                    >
                      <div className="slide-rarity-chip" style={{ background: arch.glowColor, color: '#010101' }}>
                        {arch.rarity}
                      </div>
                      <img src={arch.image} alt={arch.title} className="slide-card-img" />
                      <div className="slide-meta">
                        <div className="slide-title" style={{ color: arch.glowColor }}>
                          {arch.badgeEmoji} {arch.title}
                        </div>
                        <div className="slide-lore">{arch.lore}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="carousel-nav-btn next"
                onClick={() =>
                  setCarouselIndex((prev) => (prev + 1) % ARCHETYPES_LIST.length)
                }
              >
                <ChevronRight style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div className="carousel-modal-footer">
              <button
                type="button"
                className="carousel-equip-btn"
                style={{ background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)' }}
                onClick={() => handleEquipFromCarousel(ARCHETYPES_LIST[carouselIndex])}
              >
                Equip {ARCHETYPES_LIST[carouselIndex].title}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
