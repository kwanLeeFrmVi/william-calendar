import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { selectionStore } from "./state/selection";
import { ItemProps } from "./types";
import { areDatesOnSameDay } from "./utils";

// Optimized styles defined outside component to prevent recreation on each render
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#000000",
    borderWidth: 1,
  },
  disabledText: {
    color: "#ccc",
  },
  selectedContainer: {
    backgroundColor: "#007bff",
  },
  selectedText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

/**
 * Default renderer for a single day cell in the calendar.
 * It displays the day of the month and handles its own selection state.
 * This component is memoized to prevent unnecessary re-renders.
 *
 * @param {ItemProps} props - The component props.
 * @returns {React.ReactElement} The rendered day cell.
 */
export const CalendarItem = React.memo(
  (props: ItemProps) => {
    const { day, style } = props;

    // Connect to Zustand store for selection state
    const selectedDate = selectionStore((state) => state.selectedDate);
    const setSelectedDate = selectionStore((state) => state.setSelectedDate);

    // Convert timestamp to Date object
    const currentDate = React.useMemo(
      () => new Date(day.date * 1000),
      [day.date]
    );

    // Get day of month for display
    const dayOfMonth = React.useMemo(
      () => currentDate.toLocaleDateString(),
      [currentDate]
    );

    // Check if this day is selected using utility function
    const isSelected = React.useMemo(
      () =>
        selectedDate ? areDatesOnSameDay(currentDate, selectedDate) : false,
      [currentDate, selectedDate]
    );

    // Handle day selection
    const handlePress = React.useCallback(() => {
      if (day.isDisabled) return;

      // If this day is already selected, clear selection, otherwise set it
      if (isSelected) {
        setSelectedDate(null);
      } else {
        setSelectedDate(currentDate);
      }
    }, [day.isDisabled, isSelected, setSelectedDate, currentDate]);

    // Combine styles based on state
    const containerStyle = React.useMemo(
      () => [styles.container, style, isSelected && styles.selectedContainer],
      [style, isSelected]
    );

    const textStyle = React.useMemo(
      () => [
        day.isDisabled && styles.disabledText,
        isSelected && styles.selectedText,
      ],
      [day.isDisabled, isSelected]
    );

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={handlePress}
        disabled={day.isDisabled}
        activeOpacity={0.7}
      >
        <Text style={textStyle}>{dayOfMonth}</Text>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    // Only re-render if day data or style changes
    return (
      prevProps.day.date === nextProps.day.date &&
      prevProps.day.isDisabled === nextProps.day.isDisabled &&
      prevProps.style === nextProps.style
    );
  }
);

CalendarItem.displayName = "CalendarItem";
