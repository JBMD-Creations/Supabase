import { useState } from 'react';
import { usePatients } from '../../contexts/PatientContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useSave } from '../../contexts/SaveContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import PatientCard from './PatientCard';
import AddPatientModal from './AddPatientModal';
import ExcelImportModal from './ExcelImportModal';
import SnippetsSidePanel from './SnippetsSidePanel';
import QuickAssignModal from './QuickAssignModal';
import QuickNotesModal from './QuickNotesModal';
import { RealtimeCursors } from '../realtime-cursors';
import './PatientCharting.css';

const PatientCharting = () => {
  const { patients, getFilteredPatients, activeShift, setActiveShift, selectedShifts, setSelectedShifts, isCloudConnected, lastCloudSync } = usePatients();
  const { technicians } = useTheme();
  const { saveAll, saveStatus, SAVE_STATUS, hasUnsavedChanges, lastSaved, autoSaveEnabled } = useSave();
  const { summary: alertSummary, setShowNotificationPanel, SEVERITY } = useNotifications();
  const { user, isAuthenticated } = useAuth();

  // Get username for realtime cursors
  const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous';
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showQuickAssign, setShowQuickAssign] = useState(false);
  const [showQuickNotes, setShowQuickNotes] = useState(false);
  const [quickNotesPatientId, setQuickNotesPatientId] = useState(null);
  const [activePatientId, setActivePatientId] = useState(null);

  // Get alert button class based on severity
  const getAlertButtonClass = () => {
    if (alertSummary.critical > 0) return 'alert-btn has-critical';
    if (alertSummary.warning > 0) return 'alert-btn has-warning';
    if (alertSummary.info > 0) return 'alert-btn has-info';
    return 'alert-btn no-alerts';
  };

  // Get save button text and class based on status
  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case SAVE_STATUS.SAVING:
        return { text: '⏳ Saving...', className: 'saving' };
      case SAVE_STATUS.SAVED:
        return { text: '✓ Saved!', className: 'saved' };
      case SAVE_STATUS.ERROR:
        return { text: '❌ Error', className: 'error' };
      case SAVE_STATUS.UNSAVED:
        return { text: '💾 Save All •', className: 'unsaved' };
      default:
        return { text: '💾 Save All', className: '' };
    }
  };

  const saveButton = getSaveButtonContent();

  const filteredPatients = getFilteredPatients();

  // Open Quick Notes for a specific patient
  const openQuickNotes = (patientId = null) => {
    // Use provided patientId, or activePatientId, or first patient
    const targetId = patientId || activePatientId || (filteredPatients.length > 0 ? filteredPatients[0].id : null);
    if (targetId) {
      setQuickNotesPatientId(targetId);
      setShowQuickNotes(true);
    }
  };

  // Group patients by pod
  const patientsByPod = {};
  filteredPatients.forEach(patient => {
    const pod = patient.pod || 'Unassigned';
    if (!patientsByPod[pod]) {
      patientsByPod[pod] = [];
    }
    patientsByPod[pod].push(patient);
  });

  const pods = Object.keys(patientsByPod).sort();

  return (
    <div className="pt-charting-page active">
      {/* Header */}
      <div className="charting-header">
        <div>
          <h1 style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', marginBottom: '8px' }}>
            HD Flowsheet & QA Tracker
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
            Active Shift: {activeShift} | Patients: {filteredPatients.length} | Technicians: {technicians.length}
            {isCloudConnected && (
              <span style={{ marginLeft: '12px', background: 'rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                ☁️ Cloud Synced
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="import-excel-btn"
            onClick={() => setShowImportModal(true)}
          >
            📊 Import Excel
          </button>
          <button
            className="add-patient-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Patient
          </button>
        </div>
      </div>

      {/* Shift Tabs */}
      <div className="shift-tabs">
        {['1st', '2nd', '3rd'].map(shift => (
          <button
            key={shift}
            className={`shift-tab ${activeShift === shift ? 'active' : ''}`}
            onClick={() => setActiveShift(shift)}
          >
            {shift} Shift
            <span className="shift-count">
              ({patients.filter(p => p.shift === shift || !p.shift).length})
            </span>
          </button>
        ))}
      </div>

      {/* Pod Tabs */}
      {pods.length > 0 && (
        <div className="pod-tabs">
          {pods.map(pod => (
            <button
              key={pod}
              className="pod-tab"
              onClick={() => {
                const firstPatient = patientsByPod[pod][0];
                setActivePatientId(firstPatient.id);
              }}
            >
              {pod}
              <span className="pod-count">({patientsByPod[pod].length})</span>
            </button>
          ))}
        </div>
      )}

      {/* Patient Cards */}
      <div className="patients-container">
        {filteredPatients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏥</div>
            <h3>No Patients Yet</h3>
            <p>Click "Add Patient" to get started</p>
          </div>
        ) : (
          <div className="patients-grid">
            {filteredPatients.map(patient => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <AddPatientModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      {/* Snippets Side Panel (Drawer) */}
      <SnippetsSidePanel
        isOpen={showSnippets}
        onClose={() => setShowSnippets(false)}
      />

      {/* Quick Assign Modal */}
      <QuickAssignModal
        isOpen={showQuickAssign}
        onClose={() => setShowQuickAssign(false)}
      />

      {/* Quick Notes Modal - Per-patient notes (matches HDFlowsheet reference) */}
      <QuickNotesModal
        isOpen={showQuickNotes}
        onClose={() => setShowQuickNotes(false)}
        patientId={quickNotesPatientId}
      />

      {/* Floating Buttons - Top Right (matches HDFlowsheet structure) */}
      <div className="floating-buttons">
        <button
          className={`floating-btn ${getAlertButtonClass()}`}
          onClick={() => setShowNotificationPanel(true)}
        >
          🔔 Alerts
          {alertSummary.total > 0 && (
            <span className="notification-badge">{alertSummary.total}</span>
          )}
        </button>
        <button
          className="floating-btn"
          onClick={() => setShowSnippets(!showSnippets)}
        >
          📋 Charting
        </button>
        <button
          className="floating-btn"
          onClick={() => setShowQuickAssign(true)}
        >
          👥 Quick Assign
        </button>
        <button
          className="floating-btn"
          onClick={() => openQuickNotes()}
        >
          📝 Quick Notes
        </button>
        <button
          className={`floating-btn save-btn ${saveButton.className}`}
          onClick={saveAll}
          disabled={saveStatus === SAVE_STATUS.SAVING}
        >
          {saveButton.text}
        </button>
      </div>

      {/* Auto-save indicator */}
      {autoSaveEnabled && (
        <div className="autosave-indicator">
          {lastSaved ? (
            <span>Auto-save: {lastSaved.toLocaleTimeString()}</span>
          ) : (
            <span>Auto-save enabled</span>
          )}
        </div>
      )}

      {/* Realtime Cursors - Show team member cursors */}
      {isAuthenticated && (
        <RealtimeCursors
          roomName="charting:main:cursors"
          username={username}
        />
      )}
    </div>
  );
};

export default PatientCharting;
