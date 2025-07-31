import { create } from "zustand";

interface SelectionState {
  selectedDate: number | null;
  setSelectedDate: (date: number | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));