import React, { useState } from 'react';
import { HazelsLogo } from './HazelsLogo';

export const FollowGate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [followedNahian, setFollowedNahian] = useState(false);
  const [followedSallu, setFollowedSallu] = useState(false);
  const [step, setStep] = useState<'prompt' | 'detecting' | 'unlocked'>('prompt');

  const handleFollowNahian = () => {
    window.open('https://x.com/yournahian', '_blank', 'noopener,noreferrer');
    setFollowedNahian(true);
  };

  const handleFollowSallu = () => {
    window.open('https://x.com/sallubroz', '_blank', 'noopener,noreferrer');
    setFollowedSallu(true);
  };

  const handleVerify = () => {
    setStep('detecting');
    setTimeout(() => {
      setStep('unlocked');
    }, 2000);
  };

  const handleEnter = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        backgroundColor: 'rgba(6, 8, 14, 0.95)',
        backdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.3s ease',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(12, 16, 26, 0.98)',
          border: '1px solid rgba(255, 42, 95, 0.35)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 42, 95, 0.25)',
          textAlign: 'center',
          color: '#ffffff',
        }}
      >
        {/* Banner */}
        <div
          style={{
            height: '90px',
            background: 'linear-gradient(135deg, #0A0C14 0%, #2A0B14 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255, 42, 95, 0.2)',
          }}
        >
          <div
            style={{
              background: 'rgba(10, 12, 20, 0.8)',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 42, 95, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <HazelsLogo size={18} showWordmark={false} />
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                fontFamily: 'var(--font-mono, monospace)',
                color: '#FF2A5F',
                letterSpacing: '0.08em',
              }}
            >
              DOJO GATE // 七転び八起き
            </span>
          </div>
        </div>

        <div style={{ padding: '0 24px 28px 24px' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #FF2A5F',
              background: '#1A0B14',
              margin: '-34px auto 14px auto',
              boxShadow: '0 4px 20px rgba(255, 42, 95, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/brand/mark.png"
              alt="Hazels mark"
              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
            />
          </div>

          {step === 'prompt' && (
            <>
              <h2
                style={{
                  fontFamily: 'var(--font-display, sans-serif)',
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#ffffff',
                }}
              >
                Enter Hazels Trace
              </h2>
              <p
                style={{
                  color: 'var(--arc-text-muted, #94A3B8)',
                  fontSize: '13px',
                  marginTop: '6px',
                  lineHeight: '1.45',
                }}
              >
                Follow the creators on X to unlock the GTD race, YORAI analytics, Versus Arena, and Hazels collectible cards.
              </p>

              {/* Follow actions for both */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px' }}>
                <button
                  type="button"
                  onClick={handleFollowNahian}
                  style={{
                    width: '100%',
                    background: followedNahian ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 42, 95, 0.15)',
                    color: followedNahian ? '#4ADE80' : '#ffffff',
                    border: followedNahian ? '1px solid #22C55E' : '1px solid rgba(255, 42, 95, 0.4)',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>Follow <strong>@yournahian</strong> on X</span>
                  <span>{followedNahian ? '✓ Followed' : 'Follow →'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFollowSallu}
                  style={{
                    width: '100%',
                    background: followedSallu ? 'rgba(34, 197, 94, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                    color: followedSallu ? '#4ADE80' : '#ffffff',
                    border: followedSallu ? '1px solid #22C55E' : '1px solid rgba(139, 92, 246, 0.4)',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>Follow <strong>@sallubroz</strong> on X</span>
                  <span>{followedSallu ? '✓ Followed' : 'Follow →'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                style={{
                  marginTop: '16px',
                  width: '100%',
                  background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '12px 18px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(255, 42, 95, 0.4)',
                }}
              >
                Verify & Enter Dojo
              </button>

              <button
                type="button"
                onClick={handleEnter}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  background: 'transparent',
                  color: 'var(--arc-text-muted, #94A3B8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  padding: '9px 18px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Already Following / Skip
              </button>
            </>
          )}

          {step === 'detecting' && (
            <div style={{ padding: '24px 0' }}>
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
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                Verifying Dojo Access...
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--arc-text-muted, #94A3B8)', marginTop: '4px' }}>
                Confirming @yournahian and @sallubroz connections
              </p>
            </div>
          )}

          {step === 'unlocked' && (
            <div style={{ padding: '20px 0' }}>
              <div
                style={{
                  fontSize: '36px',
                  marginBottom: '10px',
                }}
              >
                ⚔️
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FF2A5F' }}>
                Access Granted: Welcome Contender
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--arc-text-muted, #94A3B8)', marginBottom: '18px', marginTop: '4px' }}>
                七転び八起き — Fall seven times, rise the eighth. The Dojo is open.
              </p>
              <button
                type="button"
                onClick={handleEnter}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FF2A5F, #8B5CF6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '12px 18px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(255, 42, 95, 0.4)',
                }}
              >
                Enter Hazels Trace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
