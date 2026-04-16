import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  activeParkingId: string | null;
  activeParkingName: string | null;
  setActiveParking: (id: string, name: string) => void;
  clearActiveParking: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeParkingId: null,
      activeParkingName: null,
      
      setActiveParking: (id, name) => set({ 
        activeParkingId: id, 
        activeParkingName: name 
      }),
      
      clearActiveParking: () => set({ 
        activeParkingId: null, 
        activeParkingName: null 
      }),
    }),
    {
      name: 'app-storage',
    }
  )
);
