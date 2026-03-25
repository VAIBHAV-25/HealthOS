import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MOCK_PATIENTS } from '../data/patients';
import type { Patient, ViewMode, FilterStatus } from '../types';

interface PatientState {
  patients: Patient[];
  userEmail: string | null;
  loading: boolean;
  viewMode: ViewMode;
  searchQuery: string;
  filterStatus: FilterStatus;
  selectedPatient: Patient | null;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: FilterStatus) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  addPatient: (patient: Patient) => void;
  filteredPatients: () => Patient[];
  initializeForUser: (email: string) => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: [],
      userEmail: null,
      loading: false,
      viewMode: 'grid',
      searchQuery: '',
      filterStatus: 'All',
      selectedPatient: null,

      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setSelectedPatient: (patient) => set({ selectedPatient: patient }),
      addPatient: async (patient) => {
        const { userEmail } = get();
        
        // Optimistic UI update
        set((state) => ({ 
          patients: [patient, ...state.patients],
          searchQuery: '',
          filterStatus: 'All'
        }));

        // Persist to Firebase
        if (userEmail && userEmail !== 'demo@healthos.com') {
          try {
            await setDoc(doc(db, 'users', userEmail, 'patients', patient.id), patient);
          } catch (error) {
            console.error("Error saving patient to Firebase:", error);
          }
        }
      },

      filteredPatients: () => {
        const { patients, searchQuery, filterStatus } = get();
        return patients.filter((p) => {
          const matchesSearch =
            !searchQuery ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.ward.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter =
            filterStatus === 'All' || p.status === filterStatus;
          return matchesSearch && matchesFilter;
        });
      },

      initializeForUser: async (email: string) => {
        set({ userEmail: email, loading: true });
        
        // Only show mock data for the demo user to preserve the showcase
        if (email === 'demo@healthos.com') {
          set({ patients: MOCK_PATIENTS, loading: false });
          return;
        }

        try {
          const snapshot = await getDocs(collection(db, 'users', email, 'patients'));
          const loadedPatients: Patient[] = [];
          snapshot.forEach((document) => {
            loadedPatients.push(document.data() as Patient);
          });
          
          set({ 
            patients: loadedPatients.sort((a, b) => b.id.localeCompare(a.id)), 
            loading: false 
          });
        } catch (error) {
          console.error("Error loading patients from Firebase. Falling back to local cache:", error);
          set({ loading: false });
        }
      },
    }),
    {
      name: 'healthos-patient-store',
      // Persist both viewMode and patients so that if Firebase goes offline (or API is disabled),
      // the user doesn't lose data on page reload.
      partialize: (state) => ({ viewMode: state.viewMode, patients: state.patients }),
    }
  )
);
