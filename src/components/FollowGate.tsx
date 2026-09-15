'use client';

import React, { useState } from 'react';
import { HazelsLogo } from './HazelsLogo';

export const FollowGate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState<'prompt' | 'detecting' | 'unlocked'>('prompt');

  const handleFollowClick = (url: string = 'https://x.com/0xhazels') => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setStep('detecting');
    setTimeout(() => {
      setStep('unlocked');
    }, 3000);
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
          maxWidth: '420px',
          background: 'rgba(12, 16, 26, 0.95)',
          border: '1px solid rgba(255, 42, 95, 0.3)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 42, 95, 0.25)',
          textAlign: 'center',
          color: '#ffffff',
        }}
      >
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
              alt="0xhazels mark"
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
                Enter the Eighth Rise Dojo
              </h2>
              <p
                style={{
                  color: 'var(--arc-text-muted, #94A3B8)',
                  fontSize: '13px',
                  marginTop: '6px',
                  lineHeight: '1.45',
                }}
              >
                Follow the official Hazels Studio on X (@0xhazels) to unlock access to the GTD race, YORAI analytics, and anime collectible cards.
              </p>

              <button
                type="button"
                onClick={() => handleFollowClick('https://x.com/0xhazels')}
                style={{
                  marginTop: '20px',
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
                Follow @0xhazels on X
              </button>

              <button
                type="button"
                onClick={handleEnter}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  background: 'transparent',
                  color: 'var(--arc-text-muted, #94A3B8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  padding: '10px 18px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Already Following / Enter Dojo
              </button>
            </>
          )}

          {step === 'detecting' && (
            <div style={{ padding: '20px 0' }}>
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
              <p style={{ fontSize: '12px', color: 'var(--arc-text-muted, #94A3B8)' }}>
                Checking @0xhazels connection on the ledger
              </p>
            </div>
          )}

          {step === 'unlocked' && (
            <div style={{ padding: '16px 0' }}>
              <div
                style={{
                  fontSize: '32px',
                  marginBottom: '10px',
                }}
              >
                ⚔️
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FF2A5F' }}>
                Access Granted: Welcome Contender
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--arc-text-muted, #94A3B8)', marginBottom: '16px' }}>
                Fall seven times, rise the eighth. The Dojo is open.
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
