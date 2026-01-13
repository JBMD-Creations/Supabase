import { usePatients } from '../../contexts/PatientContext';

const ReportsPage = () => {
  const { patients, getFilteredPatients } = usePatients();

  return (
    <div className="reports-page active">
      <div className="reports-header">
        <h1 className="reports-title">End of Shift Reports</h1>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <h2>EOSR Generator</h2>
        <p style={{ marginTop: '12px', color: '#64748b' }}>
          Automatically generate end of shift reports based on patient data.
        </p>

        <div style={{ marginTop: '24px', padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
          <h3 style={{ color: '#0284c7', marginBottom: '12px' }}>Report Sections:</h3>
          <ul style={{ lineHeight: '2', color: '#0c4a6e' }}>
            <li>Treatments completed without issues</li>
            <li>COVID-19 presumptive cases</li>
            <li>Weight deviations (&gt;1.5 kg from dry weight)</li>
            <li>Early terminations (&gt;15 mins)</li>
            <li>Missed treatments</li>
            <li>Medications rescheduled</li>
            <li>STAT labs</li>
            <li>Patients sent to ED/Hospital</li>
            <li>Welfare checks</li>
            <li>Access complications</li>
          </ul>
        </div>

        <div style={{ marginTop: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ fontWeight: 600, color: '#374151' }}>
            Total Patients in Current Shift: {getFilteredPatients().length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
