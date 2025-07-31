# Calendar Performance Refactor

This document outlines the task have to refactor the calendar component for significantly improved performance and maintainability.

## Objective

The primary goal was to enhance the calendar's performance by minimizing unnecessary re-renders, particularly when a user selects a date. The guiding principles were inspired by the high-performance [Flash Calendar](https://github.com/Shopify/flash-list/tree/main/packages/calendar) library.

## Key Changes

The following architectural changes were implemented:

1.  **Centralized State with Zustand:**

    - The selected date state was moved from local component state into a global, centralized [Zustand](https://github.com/pmndrs/zustand) store (`useCalendarState`).
    - This allows individual components (like `CalendarItem`) to subscribe directly to the state they need, preventing a cascade of re-renders down the component tree when the state changes.

2.  **Optimized and Memoized Components:**

    - `CalendarItem` is now a self-reliant component that connects to the Zustand store to determine its selection status and handle updates.
    - It is wrapped in `React.memo` to ensure it only re-renders when its own props or state change. As a result, only the previously selected and newly selected dates will re-render upon a date change.

3.  **Simplified Component Hierarchy:**

    - `CalendarContainer` and `CalendarRow` were refactored into simple, presentational components.
    - They no longer manage any state and are solely responsible for layout, making them more predictable and performant.

4.  **Modular Utility Functions:**
    - Date-related logic was extracted into utility functions (`getMonthDays`, `areDatesOnSameDay`) in `utils.ts` to keep component code clean and focused on rendering.

## Development Log

- **Initial Setup:** The project was initialized with a basic calendar component that had performance issues, particularly with selection.
- **First Attempt: Lifting State:** The initial attempt to fix the performance issue involved lifting the selection state to the `CalendarScreen`. This was a step in the right direction, but it still caused the entire calendar to re-render on selection.
- **Second Attempt: Zustand Store:** The next attempt involved using a `Zustand` store to manage the selection state. This was a significant improvement, but it was still not as performant as it could be because each `CalendarItem` was subscribed to the entire selection state.
- **Third Attempt: Zustand Store with Selectors:** The final and successful attempt involved using a `Zustand` store with selectors. This ensures that each `CalendarItem` only subscribes to its own selection status, which means that only the selected and previously selected items re-render when the selection changes.
- **Drag-to-Select (Abandoned):** An attempt was made to implement a drag-to-select feature using `PanResponder` and then `react-native-gesture-handler`. This was ultimately abandoned because it required ejecting from Expo Go, which was a project constraint.

## Outcome

The calendar is now significantly more responsive. The new architecture ensures that user interactions, like selecting a date, trigger the minimum number of re-renders possible. The codebase is also more modular, maintainable, and scalable.

- **Enhanced Reusability and Customization:** By decoupling the state management from the UI components, it is now much easier to reuse and customize the calendar. The core components (`CalendarContainer`, `CalendarRow`, `CalendarItem`) are simple and can be easily styled or composed into different layouts without affecting the underlying selection logic.
