import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { IDayData } from "./state/days";
import { ItemRenderFn } from "./types";

// Optimized styles defined outside component to prevent recreation on each render
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});

/**
 * Props for the CalendarRow component.
 */
interface CalendarRowProps {
  /**
   * The data for the days in the row.
   */
  days: IDayData[];
  /**
   * The function to render each day item.
   */
  itemRender: ItemRenderFn;
  /**
   * Optional custom style for the row.
   */
  style?: ViewStyle;
}

/**
 * Renders a row of day items in the calendar.
 * This component is memoized to prevent unnecessary re-renders.
 *
 * @param {CalendarRowProps} props - The component props.
 * @returns {React.ReactElement} The rendered row.
 */
export const CalendarRow = React.memo(
  ({ days, itemRender, style }: CalendarRowProps) => {
    // Combine styles using useMemo to prevent unnecessary recreation
    const rowStyle = React.useMemo(() => [styles.row, style], [style]);

    // Memoize the rendered day items to prevent unnecessary re-renders
    const renderedDays = React.useMemo(
      () => days.map((day, index) => (
        <React.Fragment key={day.date || index}>
          {itemRender(day)}
        </React.Fragment>
      )),
      [days, itemRender]
    );

    return (
      <View style={rowStyle}>
        {renderedDays}
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    // Only re-render if days data, itemRender function, or style changes

    // Check if style reference changed
    if (prevProps.style !== nextProps.style) {
      return false;
    }

    // Check if itemRender function changed
    if (prevProps.itemRender !== nextProps.itemRender) {
      return false;
    }

    // Check if days array length changed
    if (prevProps.days.length !== nextProps.days.length) {
      return false;
    }

    // Check if any day data changed
    for (let i = 0; i < prevProps.days.length; i++) {
      const prevDay = prevProps.days[i];
      const nextDay = nextProps.days[i];

      // Compare essential day properties
      if (
        prevDay.date !== nextDay.date ||
        prevDay.isDisabled !== nextDay.isDisabled ||
        prevDay.isStartOfWeek !== nextDay.isStartOfWeek ||
        prevDay.isStartOfMonth !== nextDay.isStartOfMonth ||
        prevDay.isStartOfYear !== nextDay.isStartOfYear
      ) {
        return false;
      }

      // Compare income/expenses if they exist (for WilliamItem)
      if (
        (prevDay as any).income !== (nextDay as any).income ||
        (prevDay as any).expenses !== (nextDay as any).expenses
      ) {
        return false;
      }
    }

    return true;
  }
);

CalendarRow.displayName = "CalendarRow";
