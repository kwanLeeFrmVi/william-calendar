import { View, ViewStyle } from "react-native";

/**
 * Renders a row of day items.
 */
export const CalendarRow = ({
  days,
  itemRender,
  style,
}: {
  days: any[];
  itemRender: (day: any) => React.ReactNode;
  style?: ViewStyle;
}) => {
  return (
    <View style={[{ flexDirection: "row" }, style]}>
      {days.map((day) => itemRender(day))}
    </View>
  );
};
