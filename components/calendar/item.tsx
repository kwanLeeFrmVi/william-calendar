import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ItemProps } from "./types";

/**
 * Default renderer for a single day cell.
 */
export const CalendarItem = (props: ItemProps) => {
  const { day, style } = props;
  // Format the date properly to ensure consistent display
  const formattedDate = React.useMemo(() => {
    if (!day.date) return "";
    return new Date(day.date * 1000).toLocaleDateString();
  }, [day.date]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "#000000",
      borderWidth: 1,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text>{formattedDate}</Text>
    </View>
  );
};
