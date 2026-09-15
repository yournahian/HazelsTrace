import React from 'react';

export type TabType = 'proof' | 'cards' | 'versus' | 'radar' | 'terminal' | 'best_posts';

interface NavigationDockProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

interface TabItem {
  id: TabType;
  label: string;
  kanji: string;
  icon: () => JSX.Element;
}

const TABS: TabItem[] = [
  {
    id: 'proof',
    label: 'Proof of Work',
    kanji: '道場',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: 'cards',
    label: 'Hazels Cards',
    kanji: '札',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="3" />
        <circle cx="12" cy="10" r="3" />
        <path d="M8 18h8" />
      </svg>
    ),
  },
  {
    id: 'versus',
    label: 'Versus Arena',
    kanji: '決闘',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
        <path d="m13 19 6 2 2-6-2-2" />
        <path d="m14 10 4-4a3 3 0 0 0-4-4l-4 4" />
        <path d="m6 18 4 4a3 3 0 0 0 4-4l-4-4" />
      </svg>
    ),
  },
  {
    id: 'radar',
    label: 'Studio Radar',
    kanji: '作戦',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'terminal',
    label: 'Hazels Gems (Voices)',
    kanji: '位',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9Z" />
        <path d="M11 3 8 9l4 13 4-13-3-6" />
        <path d="M2 9h20" />
      </svg>
    ),
  },
  {
    id: 'best_posts',
    label: 'Best Posts',
    kanji: '反響',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export const NavigationDock: React.FC<NavigationDockProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav className="nav-dock" aria-label="Main Navigation">
      <ul className="nav-list">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`dock-btn ${isActive ? 'active' : ''}`}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon />
                <span className="tooltip">
                  <span style={{ color: '#FF2A5F', marginRight: '6px', fontSize: '10px' }}>{tab.kanji}</span>
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
