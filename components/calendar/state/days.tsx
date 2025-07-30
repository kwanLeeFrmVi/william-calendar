import { create } from "zustand";

/**
 * Represents data for a single day cell.
 */
export interface IDayData {
  /**
   * Date as timestamp / 1000
   */
  date: number;
  [key: string]: any;
}

/**
 * Store for managing day data and custom entries.
 */
export interface IDaysStore {
  /** Map of day timestamp to data */
  days: Map<number, IDayData>;
  /** add or update a day's data */
  addDay: (dayTs: number, data?: IDayData) => void;
  /** remove a day's data */
  removeDay: (dayTs: number) => void;
}

export const dayStore = create<IDaysStore>((set, get) => ({
  days: new Map(),
  addDay: (dayTs: number, data?: IDayData) =>
    set((state) => {
      state.days.set(dayTs, data || { date: dayTs });
      return state;
    }),
  removeDay: (dayTs: number) =>
    set((state) => {
      state.days.delete(dayTs);
      return state;
    }),
}));
