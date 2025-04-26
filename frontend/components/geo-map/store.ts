// stores/useGeoStore.ts
import { create } from "zustand";

interface GeoState {
  lat: number | null;
  lng: number | null;
  ideas: { title: string; reason: string }[];
  setLocation: (lat: number, lng: number) => void;
  setIdeas: (ideas: { title: string; reason: string }[]) => void;
}

export const useGeoStore = create<GeoState>((set) => ({
  lat: null,
  lng: null,
  ideas: [],
  setLocation: (lat, lng) => set({ lat, lng }),
  setIdeas: (ideas) => set({ ideas }),
}));

