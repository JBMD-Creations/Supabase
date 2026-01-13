import { createContext, useContext, useState, useEffect } from 'react';

const OperationsContext = createContext();

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (!context) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return context;
};

export const OperationsProvider = ({ children }) => {
  // Checklists state
  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('hd-checklists');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChecklistId, setActiveChecklistId] = useState(null);
  const [completions, setCompletions] = useState(() => {
    const saved = localStorage.getItem('hd-checklist-completions');
    return saved ? JSON.parse(saved) : {};
  });

  // Labs state
  const [labs, setLabs] = useState(() => {
    const saved = localStorage.getItem('hd-labs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('hd-checklists', JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    localStorage.setItem('hd-checklist-completions', JSON.stringify(completions));
  }, [completions]);

  useEffect(() => {
    localStorage.setItem('hd-labs', JSON.stringify(labs));
  }, [labs]);

  // Checklist methods
  const addChecklist = (name, position) => {
    const newChecklist = {
      id: Date.now(),
      name,
      position,
      order: checklists.length,
      folders: [],
      items: []
    };
    setChecklists(prev => [...prev, newChecklist]);
    return newChecklist;
  };

  const updateChecklist = (checklistId, updates) => {
    setChecklists(prev =>
      prev.map(c => (c.id === checklistId ? { ...c, ...updates } : c))
    );
  };

  const deleteChecklist = (checklistId) => {
    setChecklists(prev => prev.filter(c => c.id !== checklistId));
  };

  // Lab methods
  const addLab = (patientName, timestamp) => {
    const newLab = {
      id: Date.now(),
      patientName,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    setLabs(prev => [newLab, ...prev]);
    return newLab;
  };

  const deleteLab = (labId) => {
    setLabs(prev => prev.filter(l => l.id !== labId));
  };

  const clearAllLabs = () => {
    setLabs([]);
  };

  const value = {
    // Checklists
    checklists,
    setChecklists,
    activeChecklistId,
    setActiveChecklistId,
    completions,
    setCompletions,
    addChecklist,
    updateChecklist,
    deleteChecklist,

    // Labs
    labs,
    setLabs,
    addLab,
    deleteLab,
    clearAllLabs
  };

  return (
    <OperationsContext.Provider value={value}>
      {children}
    </OperationsContext.Provider>
  );
};
