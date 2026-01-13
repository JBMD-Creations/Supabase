import { createContext, useContext, useState, useEffect } from 'react';

const PatientContext = createContext();

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};

const SECTIONS = {
  B1: { name: 'B1', chairs: [1, 2, 3, 4, 5, 6, 7, 8], info: '' },
  B2: { name: 'B2', chairs: [9, 10, 11, 12, 13, 14, 15, 16], info: '' },
  A1: { name: 'A1', chairs: [17, 18, 19, 20, 21, 22, 23, 24], info: '' },
  A2: { name: 'A2', chairs: [25, 26, 27, 28, 29, 30, 31, 32], info: '' },
  TCH: { name: 'TCH', chairs: [33, 34, 35, 36], info: 'Wheelchair patients' }
};

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('hd-patients');
    return saved ? JSON.parse(saved) : [];
  });

  const [activePatientId, setActivePatientId] = useState(null);
  const [activePod, setActivePod] = useState(null);
  const [activeShift, setActiveShift] = useState('1st');
  const [selectedShifts, setSelectedShifts] = useState(['1st']);
  const [currentSection, setCurrentSection] = useState('B1');
  const [sections] = useState(SECTIONS);
  const [nextId, setNextId] = useState(() => {
    const saved = localStorage.getItem('hd-next-id');
    return saved ? parseInt(saved) : 1;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('hd-patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('hd-next-id', nextId.toString());
  }, [nextId]);

  // Add patient
  const addPatient = (patientData) => {
    const newPatient = {
      id: nextId,
      name: patientData.name || '',
      chair: patientData.chair || null,
      tech: patientData.tech || '',
      pod: patientData.pod || '',
      section: patientData.section || currentSection,
      shift: patientData.shift || activeShift,
      dryWeight: patientData.dryWeight || null,
      preWeight: patientData.preWeight || null,
      goalUF: patientData.goalUF || null,
      postWeight: patientData.postWeight || null,
      startTime: patientData.startTime || '',
      endTime: patientData.endTime || '',
      notes: patientData.notes || '',
      qa: {
        preCheck: false,
        thirtyMin: false,
        meds: false,
        abxIdpn: false,
        statLabs: false,
        missedTx: '',
        whiteboard: false,
        labsPrep: false,
        ettSigned: false,
        chartClosed: false
      },
      hospitalized: { isHosp: false, hospital: '' },
      missedTx: { isMissed: false, type: '' },
      miscTodos: [],
      collapsedSections: {},
      wheelchairWeight: {},
      ...patientData
    };

    setPatients(prev => [...prev, newPatient]);
    setNextId(prev => prev + 1);
    return newPatient;
  };

  // Update patient
  const updatePatient = (patientId, updates) => {
    setPatients(prev =>
      prev.map(p => (p.id === patientId ? { ...p, ...updates } : p))
    );
  };

  // Delete patient
  const deletePatient = (patientId) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
    if (activePatientId === patientId) {
      setActivePatientId(null);
    }
  };

  // Bulk import patients (from Excel)
  const importPatients = (patientsData) => {
    const newPatients = patientsData.map(data => {
      const id = nextId + patientsData.indexOf(data);
      return {
        id,
        name: data.name || '',
        chair: data.chair || null,
        tech: data.tech || '',
        pod: data.pod || '',
        section: data.section || currentSection,
        shift: data.shift || activeShift,
        dryWeight: data.dryWeight || null,
        preWeight: null,
        goalUF: null,
        postWeight: null,
        startTime: '',
        endTime: '',
        notes: '',
        qa: {
          preCheck: false,
          thirtyMin: false,
          meds: false,
          abxIdpn: false,
          statLabs: false,
          missedTx: '',
          whiteboard: false,
          labsPrep: false,
          ettSigned: false,
          chartClosed: false
        },
        hospitalized: { isHosp: false, hospital: '' },
        missedTx: { isMissed: false, type: '' },
        miscTodos: [],
        collapsedSections: {},
        wheelchairWeight: {}
      };
    });

    setPatients(prev => [...prev, ...newPatients]);
    setNextId(prev => prev + newPatients.length);
  };

  // Get filtered patients
  const getFilteredPatients = () => {
    return patients.filter(p => {
      // Filter by shift (show unassigned in all shifts)
      if (!p.shift || p.shift === '') {
        return true; // Unassigned patients show in all shifts
      }
      return p.shift === activeShift;
    });
  };

  // Get patients by pod
  const getPatientsByPod = (pod) => {
    return getFilteredPatients().filter(p => p.pod === pod);
  };

  // Get patients by section
  const getPatientsBySection = (section) => {
    return getFilteredPatients().filter(p => p.section === section);
  };

  // Clear all patients
  const clearAllPatients = () => {
    setPatients([]);
    setActivePatientId(null);
    setNextId(1);
  };

  const value = {
    patients,
    setPatients,
    activePatientId,
    setActivePatientId,
    activePod,
    setActivePod,
    activeShift,
    setActiveShift,
    selectedShifts,
    setSelectedShifts,
    currentSection,
    setCurrentSection,
    sections,
    addPatient,
    updatePatient,
    deletePatient,
    importPatients,
    getFilteredPatients,
    getPatientsByPod,
    getPatientsBySection,
    clearAllPatients
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};
