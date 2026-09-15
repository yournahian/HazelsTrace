'use client';

import React, { useState } from 'react';
import { NavigationDock, TabType } from '@/components/NavigationDock';
import { ProofOfWork } from '@/components/ProofOfWork';
import { HazelsCards } from '@/components/HazelsCards';
import { VersusArena } from '@/components/VersusArena';
import { StudioRadar } from '@/components/StudioRadar';
import { HazelsGems } from '@/components/HazelsGems';
import { TopHazelsPosts } from '@/components/TopHazelsPosts';
import { FollowGate } from '@/components/FollowGate';
import { HazelsLogo } from '@/components/HazelsLogo';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('proof');

  return (
    <div className="app-viewport">
      <FollowGate />

            <header className="app-header">
        <div className="brand-link">
          <div className="brand-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/brand/mark.png"
              alt="Hazels"
              style={{ width: '24px', height: '24px', objectFit: 'contain' }}
            />
            <span className="brand-name" style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Hazels Trace
            </span>
          </div>
        </div>

        <div className="header-right">
          <a
            href="https://studio.hazels.io"
            target="_blank"
            rel="noopener noreferrer"
            className="rialo-status-chip"
            style={{
              borderColor: 'rgba(255, 42, 95, 0.4)',
              color: '#FF7597',
              background: 'rgba(255, 42, 95, 0.08)',
            }}
            title="Hazels Studio Official"
          >
            <span
              className="pulse-dot"
              style={{ background: '#FF2A5F', boxShadow: '0 0 10px #FF2A5F' }}
            />
            <span>studio.hazels.io</span>
          </a>
        </div>
      </header>

      <NavigationDock activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      <main className="main-stage">
        {activeTab === 'proof' && <ProofOfWork />}
        {activeTab === 'cards' && <HazelsCards />}
        {activeTab === 'versus' && <VersusArena />}
        {activeTab === 'radar' && <StudioRadar />}
        {activeTab === 'terminal' && <HazelsGems />}
        {activeTab === 'best_posts' && <TopHazelsPosts />}
      </main>
    </div>
  );
}
