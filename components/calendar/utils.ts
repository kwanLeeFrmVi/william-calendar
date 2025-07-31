/**
 * Utility functions for calendar date operations.
 */

/**
 * Returns an array of all days in the specified month.
 *
 * @param {number} year - The full year (e.g., 2023)
 * @param {number} month - The month (0-11, where 0 is January)
 * @returns {Date[]} An array of Date objects representing each day in the month
 */
export const getMonthDays = (year: number, month: number): Date[] => {
  // Create a date for the first day of the month
  const firstDay = new Date(year, month, 1);

  // Get the number of days in the month
  // Setting day to 0 of the next month gives the last day of the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create an array to hold all days of the month
  const days: Date[] = [];

  // Populate the array with Date objects for each day
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
};

/**
 * Checks if two dates fall on the same day (ignoring time).
 *
 * @param {Date} date1 - The first date to compare
 * @param {Date} date2 - The second date to compare
 * @returns {boolean} True if both dates are on the same day, false otherwise
 */
export const areDatesOnSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
