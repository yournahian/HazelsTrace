import React from 'react';

interface HazelsLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export const HazelsLogo: React.FC<HazelsLogoProps> = ({
  size = 28,
  showWordmark = true,
  className = '',
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '900',
        fontFamily: 'var(--font-display, sans-serif)',
        fontSize: `${size}px`,
        letterSpacing: '0.05em',
        color: '#ffffff',
      }}
      className={className}
    >
      <img
        src="/brand/mark.png"
        alt="Hazels Mark"
        style={{
          width: `${size * 1.1}px`,
          height: `${size * 1.1}px`,
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 10px rgba(255, 42, 95, 0.4))',
        }}
      />
      {showWordmark && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img
            src="/brand/wordmark.png"
            alt="HAZELS"
            style={{
              height: `${size * 0.75}px`,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '6px',
              background: 'rgba(255, 42, 95, 0.15)',
              border: '1px solid rgba(255, 42, 95, 0.35)',
              color: '#FF2A5F',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Studio
          </span>
        </div>
      )}
    </div>
  );
};

export const HazelsIcon: React.FC<{
  size?: number;
  className?: string;
  glow?: boolean;
}> = ({ size = 48, className = '', glow = true }) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 42, 95, 0.08)',
        border: '1px solid rgba(255, 42, 95, 0.35)',
        boxShadow: glow ? '0 0 30px rgba(255, 42, 95, 0.4)' : 'none',
      }}
      className={className}
    >
      <img
        src="/brand/mark.png"
        alt="Hazels Icon"
        style={{
          width: `${size * 0.75}px`,
          height: `${size * 0.75}px`,
          objectFit: 'contain',
        }}
      />
    </div>
  );
};
