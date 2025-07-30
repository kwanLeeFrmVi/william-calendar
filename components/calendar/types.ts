import { StyleProp, ViewProps, ViewStyle } from "react-native";
import { IDayData } from "./state/days";

/**
 * Props for the `CalendarItem` component.
 */
export type ItemProps = {
  /**
   * The data for the day to be rendered.
   */
  day: IDayData;
} & ViewProps;

/**
 * A function that renders a single day item.
 */
export type ItemRenderFn = (day: IDayData) => React.ReactNode;

/**
 * Props for the `CalendarContainer` component.
 */
export interface CalendarContainerProps {
  /**
   * The number of days to display in each row.
   * @default 7
   */
  daysPerRow?: number;
  /**
   * The number of rows to display in the visible portion of the calendar.
   * @default 5
   */
  nOfRows?: number;
  /**
   * A custom function to render each day item.
   */
  itemRender?: ItemRenderFn;
  /**
   * The starting day of the week, where 0 is Sunday.
   * @default 0
   */
  startOfTheWeek?: number;
  /**
   * The initial date to center the calendar on, as a Unix timestamp (seconds).
   * @default Date.now()
   */
  initialDate?: number;
  /**
   * The fixed height of each row in pixels.
   * If not provided, it is calculated as `containerHeight / nOfRows`.
   */
  rowHeight?: number;
  /**
   * An optional function to extract a unique key for each row.
   * Defaults to using the timestamp of the first day in the row.
   */
  keyExtractor?: (item: IDayData[]) => string;
  /**
   * Optional custom style for the container.
   */
  style?: StyleProp<ViewStyle>;
}
