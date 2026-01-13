import { useState } from 'react';
import { useSnippets } from '../../contexts/SnippetContext';
import './SnippetsSidePanel.css';

const SnippetsSidePanel = ({ isOpen, onClose }) => {
  const { getActiveConfig } = useSnippets();
  const [copiedId, setCopiedId] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());

  const activeConfig = getActiveConfig();

  const handleCopySnippet = (text, snippetId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(snippetId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (!activeConfig) {
    return null;
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="snippets-overlay" onClick={onClose}></div>
      )}

      {/* Side Panel */}
      <div className={`snippets-side-panel ${isOpen ? 'open' : ''}`}>
        <div className="snippets-panel-header">
          <div>
            <h3>Quick Snippets</h3>
            <p className="snippets-panel-subtitle">Click to copy</p>
          </div>
          <button
            className="snippets-close-btn"
            onClick={onClose}
            aria-label="Close snippets panel"
          >
            ×
          </button>
        </div>

        <div className="snippets-panel-content">
          {activeConfig.sections?.map(section => {
            const isExpanded = expandedSections.has(section.id);
            const snippets = section.snippets || [];

            return (
              <div key={section.id} className="snippet-section-panel">
                <button
                  className="section-header-btn"
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="section-icon">{section.icon}</span>
                  <span className="section-name">{section.name}</span>
                  <span className="section-count">{snippets.length}</span>
                  <span className={`section-arrow ${isExpanded ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div className="snippets-list">
                    {snippets.map(snippet => (
                      <button
                        key={snippet.id}
                        className={`snippet-item ${copiedId === snippet.id ? 'copied' : ''}`}
                        onClick={() => handleCopySnippet(snippet.text, snippet.id)}
                      >
                        <span className="snippet-text">{snippet.text}</span>
                        {copiedId === snippet.id && (
                          <span className="copied-badge">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="snippets-panel-footer">
          <span className="snippet-tip">💡 Click any snippet to copy</span>
        </div>
      </div>
    </>
  );
};

export default SnippetsSidePanel;
