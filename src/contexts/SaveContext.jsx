import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePatients } from './PatientContext';
import { useOperations } from './OperationsContext';
import { useSnippets } from './SnippetContext';
import { useTheme } from './ThemeContext';

const SaveContext = createContext();

export const useSave = () => {
  const context = useContext(SaveContext);
  if (!context) {
    throw new Error('useSave must be used within a SaveProvider');
  }
  return context;
};

// Save status types
const SAVE_STATUS = {
  IDLE: 'idle',
  SAVING: 'saving',
  SAVED: 'saved',
  ERROR: 'error',
  UNSAVED: 'unsaved'
};

export const SaveProvider = ({ children }) => {
  const { patients } = usePatients();
  const { checklists, labs, completions } = useOperations();
  const { configurations, activeConfigId } = useSnippets();
  const { theme, technicians } = useTheme();

  const [saveStatus, setSaveStatus] = useState(SAVE_STATUS.IDLE);
  const [lastSaved, setLastSaved] = useState(() => {
    const saved = localStorage.getItem('hd-last-saved');
    return saved ? new Date(saved) : null;
  });
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    const saved = localStorage.getItem('hd-autosave-enabled');
    return saved !== 'false'; // Default to true
  });
  const [autoSaveInterval, setAutoSaveInterval] = useState(() => {
    const saved = localStorage.getItem('hd-autosave-interval');
    return saved ? parseInt(saved) : 60000; // Default 60 seconds
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const autoSaveTimerRef = useRef(null);
  const lastSavedDataRef = useRef(null);

  // Generate a hash of current data to detect changes
  const getCurrentDataHash = useCallback(() => {
    const data = {
      patients,
      checklists,
      labs,
      completions,
      configurations,
      activeConfigId,
      theme,
      technicians
    };
    return JSON.stringify(data);
  }, [patients, checklists, labs, completions, configurations, activeConfigId, theme, technicians]);

  // Check for unsaved changes
  useEffect(() => {
    const currentHash = getCurrentDataHash();
    if (lastSavedDataRef.current && lastSavedDataRef.current !== currentHash) {
      setHasUnsavedChanges(true);
      setSaveStatus(SAVE_STATUS.UNSAVED);
    }
  }, [getCurrentDataHash]);

  // Save all data to localStorage
  const saveAll = useCallback(async () => {
    setSaveStatus(SAVE_STATUS.SAVING);

    try {
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));

      // Save all data (contexts already auto-save, but we ensure it here)
      localStorage.setItem('hd-patients', JSON.stringify(patients));
      localStorage.setItem('hd-checklists', JSON.stringify(checklists));
      localStorage.setItem('hd-labs', JSON.stringify(labs));
      localStorage.setItem('hd-checklist-completions', JSON.stringify(completions));
      localStorage.setItem('hd-snippet-configs', JSON.stringify(configurations));
      localStorage.setItem('hd-active-snippet-config', activeConfigId?.toString() || '');
      localStorage.setItem('hd-theme', theme);
      localStorage.setItem('hd-technicians', JSON.stringify(technicians));

      // Update last saved
      const now = new Date();
      localStorage.setItem('hd-last-saved', now.toISOString());
      setLastSaved(now);

      // Update hash reference
      lastSavedDataRef.current = getCurrentDataHash();
      setHasUnsavedChanges(false);

      setSaveStatus(SAVE_STATUS.SAVED);

      // Reset to idle after showing saved status
      setTimeout(() => {
        setSaveStatus(SAVE_STATUS.IDLE);
      }, 2000);

      return { success: true };
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus(SAVE_STATUS.ERROR);

      setTimeout(() => {
        setSaveStatus(SAVE_STATUS.UNSAVED);
      }, 3000);

      return { success: false, error };
    }
  }, [patients, checklists, labs, completions, configurations, activeConfigId, theme, technicians, getCurrentDataHash]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && hasUnsavedChanges) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(() => {
        saveAll();
      }, autoSaveInterval);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [autoSaveEnabled, hasUnsavedChanges, autoSaveInterval, saveAll]);

  // Persist auto-save settings
  useEffect(() => {
    localStorage.setItem('hd-autosave-enabled', autoSaveEnabled.toString());
  }, [autoSaveEnabled]);

  useEffect(() => {
    localStorage.setItem('hd-autosave-interval', autoSaveInterval.toString());
  }, [autoSaveInterval]);

  // Initialize lastSavedDataRef on mount
  useEffect(() => {
    lastSavedDataRef.current = getCurrentDataHash();
  }, []);

  // Save before page unload if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        // Trigger a synchronous save
        localStorage.setItem('hd-patients', JSON.stringify(patients));
        localStorage.setItem('hd-checklists', JSON.stringify(checklists));
        localStorage.setItem('hd-labs', JSON.stringify(labs));
        localStorage.setItem('hd-checklist-completions', JSON.stringify(completions));
        localStorage.setItem('hd-snippet-configs', JSON.stringify(configurations));
        localStorage.setItem('hd-active-snippet-config', activeConfigId?.toString() || '');
        localStorage.setItem('hd-theme', theme);
        localStorage.setItem('hd-technicians', JSON.stringify(technicians));
        localStorage.setItem('hd-last-saved', new Date().toISOString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, patients, checklists, labs, completions, configurations, activeConfigId, theme, technicians]);

  // Export all data as JSON
  const exportAllData = useCallback(() => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      patients,
      checklists,
      labs,
      completions,
      snippetConfigurations: configurations,
      activeSnippetConfigId: activeConfigId,
      theme,
      technicians
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hdflowsheet-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [patients, checklists, labs, completions, configurations, activeConfigId, theme, technicians]);

  // Clear all data
  const clearAllData = useCallback(() => {
    if (window.confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      localStorage.removeItem('hd-patients');
      localStorage.removeItem('hd-checklists');
      localStorage.removeItem('hd-labs');
      localStorage.removeItem('hd-checklist-completions');
      localStorage.removeItem('hd-snippet-configs');
      localStorage.removeItem('hd-active-snippet-config');
      localStorage.removeItem('hd-technicians');
      localStorage.removeItem('hd-last-saved');
      localStorage.removeItem('hd-next-id');

      // Reload the page to reset all contexts
      window.location.reload();
    }
  }, []);

  const value = {
    // Status
    saveStatus,
    SAVE_STATUS,
    hasUnsavedChanges,
    lastSaved,

    // Actions
    saveAll,
    exportAllData,
    clearAllData,

    // Auto-save settings
    autoSaveEnabled,
    setAutoSaveEnabled,
    autoSaveInterval,
    setAutoSaveInterval
  };

  return (
    <SaveContext.Provider value={value}>
      {children}
    </SaveContext.Provider>
  );
};
