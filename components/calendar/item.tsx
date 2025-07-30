import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ItemProps } from "./types";

/**
 * Default renderer for a single day cell in the calendar.
 * It displays the day of the month and, if available, the income for that day.
 *
 * @param {ItemProps} props - The component props.
 * @returns {React.ReactElement} The rendered day cell.
 */
export const CalendarItem = (props: ItemProps) => {
  const { day, style } = props;
  const dayOfMonth = React.useMemo(
    () => new Date(day.date * 1000).getDate(),
    [day.date]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "#000000",
      borderWidth: 1,
    },
    incomeText: {
      fontSize: 10,
      color: "#333",
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text>{dayOfMonth}</Text>
      {day.income !== undefined ? (
        <Text style={styles.incomeText}>${day.income}</Text>
      ) : (
        <Text style={styles.incomeText}>...</Text>
      )}
    </View>
  );
};
