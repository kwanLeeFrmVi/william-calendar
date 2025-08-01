import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelectionStore } from "./state/selection";
import { ItemProps } from "./types";

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
export const CalendarItem = React.memo((props: ItemProps) => {
  const { day, style } = props;
  const index = day.index;
  const isSelected = useSelectionStore(
    (state) => state.selectedDate === day.date
  );

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
  const dayOfWeek = React.useMemo(
    () => currentDate.toLocaleDateString("en-US", { weekday: "short" }),
    [currentDate]
  );
  // Handle day selection
  const handlePress = React.useCallback(() => {
    if (day.isDisabled) return;
    const { selectedDate, setSelectedDate } = useSelectionStore.getState();
    setSelectedDate(selectedDate === day.date ? null : day.date);
  }, [day.isDisabled, day.date]);

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
      <Text>{dayOfWeek}</Text>
      <Text>index {index}</Text>
    </TouchableOpacity>
  );
});

CalendarItem.displayName = "CalendarItem";
