import { usePatients } from '../../contexts/PatientContext';
import { useTheme } from '../../contexts/ThemeContext';

const PatientCharting = () => {
  const { patients, getFilteredPatients, activeShift } = usePatients();
  const { technicians } = useTheme();

  return (
    <div className="pt-charting-page active">
      <div className="charting-header">
        <h1 style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          HD Flowsheet & QA Tracker
        </h1>
        <p style={{ color: 'white', marginTop: '10px' }}>
          Active Shift: {activeShift} | Patients: {getFilteredPatients().length} | Technicians: {technicians.length}
        </p>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <h2>Patient Charting Module</h2>
        <p style={{ marginTop: '12px', color: '#64748b' }}>
          This section will contain the patient charting interface with pod-based navigation,
          patient tabs, QA checklists, and flowsheet management.
        </p>

        <div style={{ marginTop: '24px', padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
          <h3 style={{ color: '#0284c7', marginBottom: '12px' }}>Coming Soon:</h3>
          <ul style={{ lineHeight: '2', color: '#0c4a6e' }}>
            <li>Pod-based patient navigation</li>
            <li>Patient tabs with status indicators</li>
            <li>QA checklist management</li>
            <li>Weight & UF calculations</li>
            <li>Treatment time tracking</li>
            <li>Quick assign modal</li>
            <li>Excel import functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientCharting;
