import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import SettingsModal from '../settings/SettingsModal';
import UserMenu from '../auth/UserMenu';
import './MainLayout.css';

const MainLayout = ({ activeTab, onTabChange, onLoginClick, children }) => {
  const { theme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="hd-app" data-theme={theme}>
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-tabs">
          <button
            className={`top-nav-tab ${activeTab === 'charting' ? 'active' : ''}`}
            onClick={() => onTabChange('charting')}
          >
            Patient Charting
          </button>
          <button
            className={`top-nav-tab ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => onTabChange('operations')}
          >
            Operations
          </button>
          <button
            className={`top-nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => onTabChange('reports')}
          >
            Reports
          </button>
          <button
            className={`top-nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => onTabChange('analytics')}
          >
            Analytics
          </button>
        </div>
        <div className="nav-actions">
          <UserMenu onLoginClick={onLoginClick} />
          <button
            className="settings-btn"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open settings"
          >
            Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
