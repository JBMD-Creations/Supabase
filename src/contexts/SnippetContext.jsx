import { createContext, useContext, useState, useEffect } from 'react';

const SnippetContext = createContext();

export const useSnippets = () => {
  const context = useContext(SnippetContext);
  if (!context) {
    throw new Error('useSnippets must be used within a SnippetProvider');
  }
  return context;
};

const DEFAULT_SNIPPETS = [
  {
    id: 1,
    name: 'Default Configuration',
    order: 0,
    sections: [
      {
        id: 1,
        name: 'Quick Notes',
        icon: '📝',
        order: 0,
        snippets: [
          { id: 1, text: 'Midodrine given for BP drop', tags: ['meds', 'bp'] },
          { id: 2, text: '100 ml bolus given', tags: ['treatment'] },
          { id: 3, text: 'BP drop > 20', tags: ['bp', 'alert'] },
          { id: 4, text: 'Cramping reported', tags: ['symptoms'] },
          { id: 5, text: 'UF goal increased', tags: ['treatment'] }
        ]
      },
      {
        id: 2,
        name: 'To-Do Items',
        icon: '✅',
        order: 1,
        snippets: [
          { id: 6, text: 'Access assessment chart', tags: ['documentation'] },
          { id: 7, text: 'Foot check', tags: ['assessment'] },
          { id: 8, text: 'Monthly progress note', tags: ['documentation'] },
          { id: 9, text: 'Daily progress note', tags: ['documentation'] },
          { id: 10, text: 'Notify MD/NP', tags: ['communication'] },
          { id: 11, text: 'PHN Call', tags: ['communication'] }
        ]
      }
    ]
  }
];

export const SnippetProvider = ({ children }) => {
  const [configurations, setConfigurations] = useState(() => {
    const saved = localStorage.getItem('hd-snippet-configs');
    return saved ? JSON.parse(saved) : DEFAULT_SNIPPETS;
  });

  const [activeConfigId, setActiveConfigId] = useState(() => {
    const saved = localStorage.getItem('hd-active-snippet-config');
    return saved ? parseInt(saved) : configurations[0]?.id || null;
  });

  const [tagFilter, setTagFilter] = useState(new Set());

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('hd-snippet-configs', JSON.stringify(configurations));
  }, [configurations]);

  useEffect(() => {
    localStorage.setItem('hd-active-snippet-config', activeConfigId?.toString() || '');
  }, [activeConfigId]);

  // Get active configuration
  const getActiveConfig = () => {
    return configurations.find(c => c.id === activeConfigId);
  };

  // Get all unique tags
  const getAllTags = () => {
    const tags = new Set();
    configurations.forEach(config => {
      config.sections?.forEach(section => {
        section.snippets?.forEach(snippet => {
          snippet.tags?.forEach(tag => tags.add(tag));
        });
      });
    });
    return Array.from(tags);
  };

  // Filter snippets by tags
  const getFilteredSnippets = (sectionId) => {
    const config = getActiveConfig();
    if (!config) return [];

    const section = config.sections?.find(s => s.id === sectionId);
    if (!section) return [];

    if (tagFilter.size === 0) {
      return section.snippets || [];
    }

    return section.snippets?.filter(snippet =>
      snippet.tags?.some(tag => tagFilter.has(tag))
    ) || [];
  };

  const value = {
    configurations,
    setConfigurations,
    activeConfigId,
    setActiveConfigId,
    tagFilter,
    setTagFilter,
    getActiveConfig,
    getAllTags,
    getFilteredSnippets
  };

  return (
    <SnippetContext.Provider value={value}>
      {children}
    </SnippetContext.Provider>
  );
};
