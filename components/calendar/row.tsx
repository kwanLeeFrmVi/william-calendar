import { View, ViewStyle } from "react-native";
import { ItemRenderFn } from "./types";

/**
 * Renders a row of day items in the calendar.
 *
 * @param {object} props - The component props.
 * @param {any[]} props.days - The data for the days in the row.
 * @param {ItemRenderFn} props.itemRender - The function to render each day item.
 * @param {ViewStyle} [props.style] - Optional custom style for the row.
 * @returns {React.ReactElement} The rendered row.
 */
export const CalendarRow = ({
  days,
  itemRender,
  style,
}: {
  days: any[];
  itemRender: ItemRenderFn;
  style?: ViewStyle;
}) => {
  return (
    <View style={[{ flexDirection: "row" }, style]}>
      {days.map((day) => itemRender(day))}
    </View>
  );
};
