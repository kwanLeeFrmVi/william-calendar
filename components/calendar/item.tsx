import { Text, View } from "react-native";
import { IDayData } from "./state/days";

/**
 * Default renderer for a single day cell.
 */
export const CalendarItem = ({ date }: IDayData) => {
  return (
    <View>
      <Text>{date}</Text>
    </View>
  );
};
