import { useState } from 'react';
import { usePatients } from '../../contexts/PatientContext';

const PatientCard = ({ patient }) => {
  const { updatePatient, deletePatient } = usePatients();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQAChange = (field, value) => {
    updatePatient(patient.id, {
      qa: { ...patient.qa, [field]: value }
    });
  };

  const handleFieldChange = (field, value) => {
    updatePatient(patient.id, { [field]: value });
  };

  const calculateUF = () => {
    if (patient.preWeight && patient.postWeight) {
      return (patient.preWeight - patient.postWeight).toFixed(2);
    }
    return patient.goalUF || '—';
  };

  return (
    <div className={`patient-card ${patient.qa?.chartClosed ? 'chart-closed' : ''}`}>
      {/* Header */}
      <div className="patient-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="patient-info">
          <h3>
            {patient.name || 'Unnamed Patient'}
            {patient.chair && <span className="chair-badge">Chair {patient.chair}</span>}
          </h3>
          <p className="patient-meta">
            {patient.tech || 'No Tech'} | {patient.section || 'No Section'}
          </p>
        </div>
        <button className="expand-btn">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* QA Status Pills */}
      <div className="qa-pills">
        <span className={`qa-pill ${patient.qa?.preCheck ? 'complete' : 'pending'}`}>
          Pre
        </span>
        <span className={`qa-pill ${patient.qa?.thirtyMin ? 'complete' : 'pending'}`}>
          30min
        </span>
        <span className={`qa-pill ${patient.qa?.meds ? 'complete' : 'pending'}`}>
          Meds
        </span>
        <span className={`qa-pill ${patient.qa?.ettSigned ? 'complete' : 'pending'}`}>
          Post
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="patient-card-body">
          {/* QA Checklist */}
          <div className="section">
            <h4>QA Checklist</h4>
            <div className="checkbox-grid">
              <label>
                <input
                  type="checkbox"
                  checked={patient.qa?.preCheck || false}
                  onChange={(e) => handleQAChange('preCheck', e.target.checked)}
                />
                Pre Check
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={patient.qa?.thirtyMin || false}
                  onChange={(e) => handleQAChange('thirtyMin', e.target.checked)}
                />
                30 Min Check
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={patient.qa?.meds || false}
                  onChange={(e) => handleQAChange('meds', e.target.checked)}
                />
                Meds
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={patient.qa?.abxIdpn || false}
                  onChange={(e) => handleQAChange('abxIdpn', e.target.checked)}
                />
                Abx/IDPN
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={patient.qa?.statLabs || false}
                  onChange={(e) => handleQAChange('statLabs', e.target.checked)}
                />
                STAT Labs
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={patient.qa?.labsPrep || false}
                  onChange={(e) => handleQAChange('labsPrep', e.target.checked)}
                />
                Labs Prep
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={patient.qa?.whiteboard || false}
                  onChange={(e) => handleQAChange('whiteboard', e.target.checked)}
                />
                Whiteboard
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={patient.qa?.ettSigned || false}
                  onChange={(e) => handleQAChange('ettSigned', e.target.checked)}
                />
                ETT Signed
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={patient.qa?.chartClosed || false}
                  onChange={(e) => handleQAChange('chartClosed', e.target.checked)}
                />
                <strong>Chart Closed</strong>
              </label>
            </div>
          </div>

          {/* Weight & UF */}
          <div className="section">
            <h4>Weight & UF Management</h4>
            <div className="input-grid">
              <div className="input-group">
                <label>Dry Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={patient.dryWeight || ''}
                  onChange={(e) => handleFieldChange('dryWeight', parseFloat(e.target.value))}
                  placeholder="0.0"
                />
              </div>
              <div className="input-group">
                <label>Pre Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={patient.preWeight || ''}
                  onChange={(e) => handleFieldChange('preWeight', parseFloat(e.target.value))}
                  placeholder="0.0"
                />
              </div>
              <div className="input-group">
                <label>Goal UF (L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={patient.goalUF || ''}
                  onChange={(e) => handleFieldChange('goalUF', parseFloat(e.target.value))}
                  placeholder="0.0"
                />
              </div>
              <div className="input-group">
                <label>Post Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={patient.postWeight || ''}
                  onChange={(e) => handleFieldChange('postWeight', parseFloat(e.target.value))}
                  placeholder="0.0"
                />
              </div>
              <div className="input-group">
                <label>Actual UF (L)</label>
                <div className="calculated-field">{calculateUF()}</div>
              </div>
            </div>
          </div>

          {/* Treatment Times */}
          <div className="section">
            <h4>Treatment Times</h4>
            <div className="input-grid">
              <div className="input-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={patient.startTime || ''}
                  onChange={(e) => handleFieldChange('startTime', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={patient.endTime || ''}
                  onChange={(e) => handleFieldChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="section">
            <h4>Notes</h4>
            <textarea
              value={patient.notes || ''}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              placeholder="Add notes here..."
              rows="3"
            />
          </div>

          {/* Delete Button */}
          <button
            className="delete-patient-btn"
            onClick={() => {
              if (confirm('Delete this patient?')) {
                deletePatient(patient.id);
              }
            }}
          >
            Delete Patient
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientCard;
