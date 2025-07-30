import React from "react";
import { Text, View } from "react-native";
import { IDayData } from "./state/days";

/**
 * Default renderer for a single day cell.
 */
export const CalendarItem = ({ date }: IDayData) => {
  // Format the date properly to ensure consistent display
  const formattedDate = React.useMemo(() => {
    if (!date) return '';
    return new Date(date * 1000).toLocaleDateString();
  }, [date]);
  
  return (
    <View style={{ flex: 1, padding: 5, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{formattedDate}</Text>
    </View>
  );
};
