import { create } from "zustand";

/**
 * Represents the data for a single day cell in the calendar.
 */
export interface IDayData {
  /**
   * The date as a Unix timestamp (seconds since epoch).
   */
  date: number;
  /**
   * Optional income data for the day.
   */
  income?: number;
  /**
   * Allows for other arbitrary data to be attached to a day.
   */
  [key: string]: any;
}

/**
 * The Zustand store for managing calendar state, including day data and scrolling.
 */
export interface IDaysStore {
  /**
   * A map of day timestamps to their corresponding data.
   */
  days: Map<number, IDayData>;
  /**
   * Adds or updates the data for a specific day.
   * If the day already exists, the new data will be merged with the existing data.
   *
   * @param {number} dayTs - The timestamp of the day to add or update.
   * @param {Partial<IDayData>} [data] - The data to set for the day.
   */
  addDay: (dayTs: number, data?: Partial<IDayData>) => void;
  /**
   * Removes a day's data from the store.
   *
   * @param {number} dayTs - The timestamp of the day to remove.
   */
  removeDay: (dayTs: number) => void;
  /**
   * The timestamp of the date to which the calendar should scroll.
   */
  scrollToTimestamp?: number;
  /**
   * Sets the `scrollToTimestamp` to trigger a scroll event in the calendar.
   *
   * @param {number} timestamp - The timestamp to scroll to.
   */
  setScrollToTimestamp: (timestamp: number) => void;
  /**
   * Fetches data for a given date range and updates the store.
   * In a real application, this would make an API call.
   *
   * @param {number} startTs - The start timestamp of the range.
   * @param {number} endTs - The end timestamp of the range.
   */
  fetchDaysData: (startTs: number, endTs: number) => Promise<void>;
}

export const dayStore = create<IDaysStore>((set) => ({
  days: new Map(),
  addDay: (dayTs: number, data?: Partial<IDayData>) =>
    set((state) => {
      const newDays = new Map(state.days);
      const existingData = newDays.get(dayTs) || { date: dayTs };
      newDays.set(dayTs, { ...existingData, ...data });
      return { days: newDays };
    }),
  removeDay: (dayTs: number) =>
    set((state) => {
      const newDays = new Map(state.days);
      newDays.delete(dayTs);
      return { days: newDays };
    }),
  scrollToTimestamp: undefined,
  setScrollToTimestamp: (timestamp: number) =>
    set({ scrollToTimestamp: timestamp }),

  fetchDaysData: async (startTs: number, endTs: number) => {
    // In a real app, you would fetch from your API here.
    // For this example, we'll simulate a network request
    // and generate some dummy data.
    console.log(
      `Fetching data from ${new Date(
        startTs * 1000
      ).toLocaleDateString()} to ${new Date(endTs * 1000).toLocaleDateString()}`
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    const fetchedDays = new Map<number, IDayData>();
    for (let ts = startTs; ts <= endTs; ts += 86400) {
      const dayData: IDayData = {
        date: ts,
        income: Math.floor(Math.random() * 500), // Example extra data
      };
      fetchedDays.set(ts, dayData);
    }

    set((state) => {
      const newDays = new Map(state.days);
      fetchedDays.forEach((value, key) => {
        const existing = newDays.get(key) || {};
        newDays.set(key, { ...existing, ...value });
      });
      return { days: newDays };
    });
  },
}));
