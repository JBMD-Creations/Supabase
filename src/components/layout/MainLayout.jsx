import { useTheme } from '../../contexts/ThemeContext';
import './MainLayout.css';

const MainLayout = ({ activeTab, onTabChange, children }) => {
  const { theme } = useTheme();

  return (
    <div className="hd-app" data-theme={theme}>
      {/* Top Navigation */}
      <nav className="top-nav">
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
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
