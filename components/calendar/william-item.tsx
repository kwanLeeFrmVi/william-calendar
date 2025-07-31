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
    opacity: 0.35,
  },
  incomeText: {
    fontSize: 10,
    color: "green",
  },
  expenseText: {
    fontSize: 10,
    color: "red",
  },
  selectedContainer: {
    backgroundColor: "#e6f7ff",
    borderColor: "#1890ff",
    borderWidth: 2,
  },
});

/**
 * Default renderer for a single day cell in the calendar.
 * It displays the day of the month and, if available, the income for that day.
 * This component is memoized to prevent unnecessary re-renders and handles its own selection state.
 *
 * @param {ItemProps} props - The component props.
 * @returns {React.ReactElement} The rendered day cell.
 */
export const WilliamItem = React.memo(
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

    const disabledTextStyle = React.useMemo(
      () => (day.isDisabled ? styles.disabledText : {}),
      [day.isDisabled]
    );

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={handlePress}
        disabled={day.isDisabled}
        activeOpacity={0.7}
      >
        <Text style={disabledTextStyle}>{dayOfMonth}</Text>
        {day.income !== undefined ? (
          <>
            <Text style={[styles.incomeText, disabledTextStyle]}>
              +: ${day.income}
            </Text>
            <Text style={[styles.expenseText, disabledTextStyle]}>
              -: ${day.expenses}
            </Text>
          </>
        ) : (
          <Text style={[styles.incomeText, disabledTextStyle]}>...</Text>
        )}
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    // Only re-render if day data or style changes
    return (
      prevProps.day.date === nextProps.day.date &&
      prevProps.day.isDisabled === nextProps.day.isDisabled &&
      prevProps.day.income === nextProps.day.income &&
      prevProps.day.expenses === nextProps.day.expenses &&
      prevProps.style === nextProps.style
    );
  }
);

WilliamItem.displayName = "WilliamItem";
