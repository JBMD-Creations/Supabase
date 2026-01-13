import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const THEMES = [
  { value: 'clinical-blue', label: 'Clinical Blue' },
  { value: 'slate', label: 'Slate Professional' },
  { value: 'warm', label: 'Warm Neutral' },
  { value: 'navy', label: 'Navy Professional' },
  { value: 'ultra-light', label: 'Ultra-Light Clinical' }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hd-theme') || 'clinical-blue';
  });

  const [technicians, setTechnicians] = useState(() => {
    const saved = localStorage.getItem('hd-technicians');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hd-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('hd-technicians', JSON.stringify(technicians));
  }, [technicians]);

  const addTechnician = (name, pod) => {
    setTechnicians(prev => [...prev, { name, pod }]);
  };

  const removeTechnician = (name) => {
    setTechnicians(prev => prev.filter(t => t.name !== name));
  };

  const clearAllTechnicians = () => {
    setTechnicians([]);
  };

  const value = {
    theme,
    setTheme,
    themes: THEMES,
    technicians,
    addTechnician,
    removeTechnician,
    clearAllTechnicians,
    setTechnicians
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
