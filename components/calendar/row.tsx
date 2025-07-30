import { View } from "react-native";

/**
 * Renders a row of day items.
 */
export const CalendarRow = ({
  days,
  itemRender,
}: {
  days: any[];
  itemRender: (day: any) => React.ReactNode;
}) => {
  return <View>{days.map((day) => itemRender(day))}</View>;
};
