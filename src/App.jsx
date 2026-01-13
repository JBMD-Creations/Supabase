import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { PatientProvider } from './contexts/PatientContext';
import { OperationsProvider } from './contexts/OperationsContext';
import { SnippetProvider } from './contexts/SnippetContext';
import MainLayout from './components/layout/MainLayout';
import PatientCharting from './components/charting/PatientCharting';
import OperationsPage from './components/operations/OperationsPage';
import ReportsPage from './components/reports/ReportsPage';
import './styles/hdflowsheet.css';

function App() {
  const [activeTab, setActiveTab] = useState('charting');

  const renderContent = () => {
    switch (activeTab) {
      case 'charting':
        return <PatientCharting />;
      case 'operations':
        return <OperationsPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <PatientCharting />;
    }
  };

  return (
    <ThemeProvider>
      <PatientProvider>
        <OperationsProvider>
          <SnippetProvider>
            <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
              {renderContent()}
            </MainLayout>
          </SnippetProvider>
        </OperationsProvider>
      </PatientProvider>
    </ThemeProvider>
  );
}

export default App;
