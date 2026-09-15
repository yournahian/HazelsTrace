import React from 'react';
import { Sparkles, Trophy, Flame, Layers, ExternalLink, BookOpen, ShieldCheck, ArrowUpRight } from 'lucide-react';

const CAMPAIGNS = [
  {
    id: 'gtd',
    title: 'GTD RACE',
    kanji: '競走',
    status: 'LIVE',
    statusColor: '#10B981',
    season: 'SEASON 01',
    desc: 'The creator race is open. Claim your card, share it on X, and enter the record. Top 500 places take guaranteed spots.',
    image: '/campaigns/gtd.webp',
    url: 'https://studio.hazels.io/gtd',
    facts: [
      { label: 'ENTRY TASKS', val: '3' },
      { label: 'GTD SPOTS', val: '500' },
    ],
  },
  {
    id: 'pulse',
    title: 'PULSE CAMPAIGNS',
    kanji: '鼓動',
    status: 'LIVE',
    statusColor: '#8B5CF6',
    season: 'SEASON 01',
    desc: 'Creator campaigns with real briefs and real rewards. Submit work, earn YORAI points, and climb the Dojo ladder.',
    image: '/campaigns/pulse.webp',
    url: 'https://studio.hazels.io/pulse',
    facts: [
      { label: 'BRIEFS OPEN', val: 'Active' },
      { label: 'REWARD POOL', val: 'YORAI' },
    ],
  },
  {
    id: 'drops',
    title: 'STUDIO DROPS',
    kanji: '雫',
    status: 'COMING SOON',
    statusColor: '#F59E0B',
    season: 'FORGING',
    desc: 'Free mints for the movement. The first drop is being forged in the Dojo for verified Eighth Rise contenders.',
    image: '/campaigns/drops.webp',
    url: 'https://studio.hazels.io/drops',
    facts: [
      { label: 'DROP TYPE', val: 'Free Mint' },
      { label: 'ELIGIBILITY', val: 'GTD Holders' },
    ],
  },
];

const FAQS = [
  {
    q: 'What is Hazels Studio?',
    a: 'The platform side of Hazels: campaigns, drops, the creator race and the store. The story is told on the landing; everything here is the work that follows from it, counted in the open.',
  },
  {
    q: 'What is the GTD Race?',
    a: 'The creator race. Connect X, claim your card, share it, and finish the entry tasks. Every verified contribution earns points, the board ranks the field, and the top places take guaranteed spots when the race closes.',
  },
  {
    q: 'Do I need a wallet to begin?',
    a: 'No. Identity comes first — you sign in with X. A wallet is linked later from Settings, and only the campaigns that pay out on-chain will ask for it.',
  },
  {
    q: 'What is the Social Score?',
    a: 'A reading of how much of crypto X follows you, weighted by who they are. It places you on the Hazel tier ladder, and the tier sets the multiplier your points are scaled by.',
  },
  {
    q: 'How are points counted?',
    a: 'Onboarding tasks and verified posts earn base points; referral and tier multipliers combine on top. The board recomputes every minute while the race is open, and YORAI points land with the ledger.',
  },
];

export const StudioRadar: React.FC = () => {
  return (
    <div className="feature-view-container animate-fade-in">
      {/* Hero Status Box */}
      <div className="radar-hero-box">
        <div
          className="feature-pill-badge"
          style={{
            borderColor: 'rgba(255, 42, 95, 0.4)',
            color: '#FF7597',
            background: 'rgba(255, 42, 95, 0.08)',
          }}
        >
          <span className="card-wave-dot" style={{ background: '#FF2A5F', boxShadow: '0 0 10px #FF2A5F' }} />
          <span>CURRENT CAMPAIGN: GTD RACE LIVE (studio.hazels.io)</span>
        </div>

        <h2 className="feature-title">
          Hazels Studio <span className="gradient-text-amber" style={{ background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Radar</span>
        </h2>
        <p className="feature-desc">
          The story is told. The work starts here. Three moves. Nothing wasted. Connect your X account,
          compete in the GTD Race, earn YORAI points, and take your place in the record.
        </p>

        {/* Quick Action CTAs */}
        <div className="playground-cta-bar" style={{ marginTop: '20px' }}>
          <a
            href="https://studio.hazels.io/gtd"
            target="_blank"
            rel="noopener noreferrer"
            className="monad-claim-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)',
              color: '#FFFFFF',
              fontWeight: 800,
            }}
          >
            <Trophy style={{ width: '16px', height: '16px' }} />
            <span>Enter GTD Race</span>
            <ExternalLink style={{ width: '14px', height: '14px' }} />
          </a>

          <a
            href="https://studio.hazels.io"
            target="_blank"
            rel="noopener noreferrer"
            className="choose-yours-btn"
            style={{ textDecoration: 'none', borderColor: 'rgba(255, 42, 95, 0.35)', color: '#FF7597' }}
          >
            <BookOpen style={{ width: '16px', height: '16px' }} />
            <span>Explore Studio</span>
          </a>

          <a
            href="https://discord.gg/umCNh3X2a"
            target="_blank"
            rel="noopener noreferrer"
            className="choose-yours-btn"
            style={{ textDecoration: 'none', borderColor: 'rgba(139, 92, 246, 0.35)', color: '#A78BFA' }}
          >
            <Sparkles style={{ width: '16px', height: '16px' }} />
            <span>Join Discord</span>
          </a>
        </div>
      </div>

      {/* 3 Active Campaigns Grid */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FF7597', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ACTIVE CAMPAIGNS & BRIEF ENGINES
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0 0' }}>
              What is open, what is coming
            </h3>
          </div>
          <a
            href="https://studio.hazels.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#FF7597', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>View on studio.hazels.io</span>
            <ArrowUpRight style={{ width: '13px', height: '13px' }} />
          </a>
        </div>

        <div className="articles-cards-grid">
          {CAMPAIGNS.map((c) => (
            <a
              key={c.id}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rialo-article-card"
              style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ height: '140px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={c.image}
                  alt={c.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      background: 'rgba(0,0,0,0.7)',
                      border: `1px solid ${c.statusColor}`,
                      color: c.statusColor,
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                    }}
                  >
                    {c.status}
                  </span>
                </div>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <span style={{ fontSize: '18px', opacity: 0.85 }}>{c.kanji}</span>
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {c.title}
                  </h4>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8B5CF6' }}>
                    {c.season}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--arc-text-muted)', lineHeight: 1.5, margin: 0, flex: 1 }}>
                  {c.desc}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {c.facts.map((f, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--arc-text-dim)' }}>
                        {f.label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#FFFFFF', fontWeight: 700 }}>
                        {f.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 4 Dojo Pillars */}
      <div className="radar-pillars-grid" style={{ marginTop: '32px' }}>
        {[
          {
            icon: Trophy,
            title: 'The GTD Creator Race',
            desc: 'A transparent record for creators. Finish tasks, share your custom card on X, and claim guaranteed spots.',
            status: 'Season 01 Live',
            color: '#FF2A5F',
          },
          {
            icon: Flame,
            title: 'YORAI Points Ledger',
            desc: 'Every verified contribution earns base points, augmented by your social score multiplier for on-chain proof.',
            status: 'Ledger Verified',
            color: '#8B5CF6',
          },
          {
            icon: Layers,
            title: 'Tier Multiplier Ladder',
            desc: 'From Tier F (1.00×) to Tier S+ (1.75×), scale your contributions according to your verified crypto standing.',
            status: 'Multipliers Active',
            color: '#F59E0B',
          },
          {
            icon: ShieldCheck,
            title: 'The Eighth Rise Lore',
            desc: '七転び八起き — Fall seven times, rise the eighth. A movement of discipline, shared knowledge, and persistence.',
            status: 'Core Ethos',
            color: '#10B981',
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="pillar-card-box">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="pillar-top-row">
                  <div className="pillar-icon-wrap" style={{ background: 'rgba(255, 42, 95, 0.08)' }}>
                    <Icon style={{ width: '20px', height: '20px', color: item.color }} />
                  </div>
                  <span className="pillar-status-chip">{item.status}</span>
                </div>
                <h3 className="pillar-title-text">{item.title}</h3>
                <p className="pillar-desc-text">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Studio FAQ Section */}
      <div className="radar-rpc-card" style={{ marginTop: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FF7597', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            HAZELS STUDIO KNOWLEDGE BASE
          </span>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0 0' }}>
            Asked at the Door
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#FFFFFF', marginBottom: '6px' }}>
                {faq.q}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--arc-text-muted)', lineHeight: 1.5 }}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
