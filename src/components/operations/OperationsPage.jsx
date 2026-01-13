import { useOperations } from '../../contexts/OperationsContext';

const OperationsPage = () => {
  const { checklists, labs } = useOperations();

  return (
    <div className="operations-page active">
      <div className="ops-header">
        <h1 className="ops-title">Operations Management</h1>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <h2>Operations Module</h2>
        <p style={{ marginTop: '12px', color: '#64748b' }}>
          Manage checklists, labs, and snippets for daily operations.
        </p>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
            <h3 style={{ color: '#0284c7', marginBottom: '12px' }}>Checklists</h3>
            <p style={{ color: '#0c4a6e' }}>
              Total: {checklists.length}
            </p>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#64748b' }}>
              Create and manage daily checklists for different positions
            </p>
          </div>

          <div style={{ padding: '20px', background: '#f0fdf4', borderRadius: '8px' }}>
            <h3 style={{ color: '#059669', marginBottom: '12px' }}>Labs</h3>
            <p style={{ color: '#065f46' }}>
              Total: {labs.length}
            </p>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#64748b' }}>
              Track lab results and patient specimens
            </p>
          </div>

          <div style={{ padding: '20px', background: '#eff6ff', borderRadius: '8px' }}>
            <h3 style={{ color: '#2563eb', marginBottom: '12px' }}>Snippets</h3>
            <p style={{ color: '#1e3a8a' }}>
              Configurations: Available
            </p>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#64748b' }}>
              Manage quick text snippets for notes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsPage;
