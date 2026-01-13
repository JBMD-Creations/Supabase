import { useState } from 'react';
import { useOperations } from '../../contexts/OperationsContext';
import ChecklistsManager from './ChecklistsManager';
import LabsTracker from './LabsTracker';
import SnippetsManager from './SnippetsManager';
import './OperationsPage.css';

const OperationsPage = () => {
  const { checklists, labs } = useOperations();
  const [activeTab, setActiveTab] = useState('checklists');

  const renderContent = () => {
    switch (activeTab) {
      case 'checklists':
        return <ChecklistsManager />;
      case 'labs':
        return <LabsTracker />;
      case 'snippets':
        return <SnippetsManager />;
      default:
        return <ChecklistsManager />;
    }
  };

  return (
    <div className="operations-page active">
      <div className="ops-header">
        <h1 className="ops-title">Operations Management</h1>
        <p className="ops-subtitle">Manage checklists, labs, and snippets for daily operations</p>
      </div>

      <div className="ops-tabs">
        <button
          className={`ops-tab ${activeTab === 'checklists' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklists')}
        >
          <span className="ops-tab-icon">📋</span>
          <span className="ops-tab-label">Checklists</span>
          <span className="ops-tab-count">{checklists.length}</span>
        </button>
        <button
          className={`ops-tab ${activeTab === 'labs' ? 'active' : ''}`}
          onClick={() => setActiveTab('labs')}
        >
          <span className="ops-tab-icon">🧪</span>
          <span className="ops-tab-label">Labs</span>
          <span className="ops-tab-count">{labs.length}</span>
        </button>
        <button
          className={`ops-tab ${activeTab === 'snippets' ? 'active' : ''}`}
          onClick={() => setActiveTab('snippets')}
        >
          <span className="ops-tab-icon">📝</span>
          <span className="ops-tab-label">Snippets</span>
        </button>
      </div>

      <div className="ops-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default OperationsPage;
