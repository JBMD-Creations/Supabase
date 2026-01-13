import { useState } from 'react';
import { usePatients } from '../../contexts/PatientContext';
import { useTheme } from '../../contexts/ThemeContext';
import PatientCard from './PatientCard';
import AddPatientModal from './AddPatientModal';
import ExcelImportModal from './ExcelImportModal';
import './PatientCharting.css';

const PatientCharting = () => {
  const { patients, getFilteredPatients, activeShift, setActiveShift, selectedShifts, setSelectedShifts } = usePatients();
  const { technicians } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [activePatientId, setActivePatientId] = useState(null);

  const filteredPatients = getFilteredPatients();

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
    </div>
  );
};

export default PatientCharting;
