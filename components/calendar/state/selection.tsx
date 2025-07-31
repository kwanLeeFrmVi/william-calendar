import { create } from "zustand";

/**
 * The Zustand store for managing calendar date selection state.
 */
export interface ISelectionStore {
  /**
   * The currently selected date.
   */
  selectedDate: Date | null;
  /**
   * Sets the selected date.
   *
   * @param {Date | null} date - The date to set as selected, or null to clear selection.
   */
  setSelectedDate: (date: Date | null) => void;
  /**
   * Clears the current date selection.
   */
  clearSelection: () => void;
  /**
   * Checks if a specific date is selected.
   *
   * @param {Date} date - The date to check.
   * @returns {boolean} True if the date is selected, false otherwise.
   */
  isDateSelected: (date: Date) => boolean;
}

export const selectionStore = create<ISelectionStore>((set, get) => ({
  selectedDate: null,
  setSelectedDate: (date: Date | null) => set({ selectedDate: date }),
  clearSelection: () => set({ selectedDate: null }),
  isDateSelected: (date: Date) => {
    const { selectedDate } = get();
    if (!selectedDate || !date) return false;

    // Compare year, month, and day to check if dates are the same
    return (
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getDate() === date.getDate()
    );
  },
}));
