import React from 'react';

interface TierBadgeProps {
  impressions: number;
}

export const TierBadge: React.FC<TierBadgeProps> = ({ impressions }) => {
  let tier = 'TIER F';
  let tierKanji = '初';
  let color = '#64748B';
  let bg = 'rgba(100, 116, 139, 0.15)';
  let border = 'rgba(100, 116, 139, 0.35)';
  let multiplier = '1.00×';

  if (impressions >= 1000000) {
    tier = 'TIER S+';
    tierKanji = '極';
    color = '#FF2A5F';
    bg = 'rgba(255, 42, 95, 0.18)';
    border = 'rgba(255, 42, 95, 0.5)';
    multiplier = '1.75×';
  } else if (impressions >= 500000) {
    tier = 'TIER S';
    tierKanji = '範';
    color = '#A855F7';
    bg = 'rgba(168, 85, 247, 0.18)';
    border = 'rgba(168, 85, 247, 0.45)';
    multiplier = '1.40×';
  } else if (impressions >= 250000) {
    tier = 'TIER A';
    tierKanji = '師';
    color = '#8B5CF6';
    bg = 'rgba(139, 92, 246, 0.15)';
    border = 'rgba(139, 92, 246, 0.4)';
    multiplier = '1.25×';
  } else if (impressions >= 100000) {
    tier = 'TIER B';
    tierKanji = '士';
    color = '#3B82F6';
    bg = 'rgba(59, 130, 246, 0.15)';
    border = 'rgba(59, 130, 246, 0.4)';
    multiplier = '1.18×';
  } else if (impressions >= 50000) {
    tier = 'TIER C';
    tierKanji = '達';
    color = '#06B6D4';
    bg = 'rgba(6, 182, 212, 0.15)';
    border = 'rgba(6, 182, 212, 0.35)';
    multiplier = '1.12×';
  } else if (impressions >= 20000) {
    tier = 'TIER D';
    tierKanji = '修';
    color = '#14B8A6';
    bg = 'rgba(20, 184, 166, 0.15)';
    border = 'rgba(20, 184, 166, 0.35)';
    multiplier = '1.08×';
  } else if (impressions >= 5000) {
    tier = 'TIER E';
    tierKanji = '門';
    color = '#10B981';
    bg = 'rgba(16, 185, 129, 0.15)';
    border = 'rgba(16, 185, 129, 0.35)';
    multiplier = '1.04×';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '9999px',
        background: bg,
        border: `1px solid ${border}`,
        color: color,
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.05em',
        boxShadow: `0 0 12px ${color}33`,
      }}
    >
      <span style={{ fontSize: '10px', opacity: 0.9 }}>{tierKanji}</span>
      <span>{tier}</span>
      <span style={{ opacity: 0.65, fontSize: '10px' }}>({multiplier})</span>
    </div>
  );
};
