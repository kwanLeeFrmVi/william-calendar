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
  /**
   * A function that determines whether a given day should be displayed as disabled.
   */
  isDayDisabled?: (date: number) => boolean;
}

/**
 * Props for the `CalendarGrid` component.
 */
export interface CalendarGridProps {
  /**
   * A function that renders a single row of the calendar.
   */
  renderRow: ({ item }: { item: IDayData[] }) => React.ReactElement;
  /**
   * The number of rows to display in the visible portion of the calendar.
   */
  nOfRows: number;
  /**
   * An optional function to extract a unique key for each row.
   */
  keyExtractor: (item: IDayData[]) => string;
  /**
   * Returns the total number of rows in the list.
   */
  getItemCount: () => number;
  /**
   * Generates the data for a given row index.
   */
  getRow: (_: any, index: number) => IDayData[];
  /**
   * Provides the layout information for each item.
   */
  getItemLayout: (_: IDayData[][] | null, index: number) => { length: number; offset: number; index: number };
  /**
   * The initial index to scroll to.
   */
  initialScrollIndex: number;
  /**
   * Callback for when the viewable items change.
   */
  onViewableItemsChanged: ({ viewableItems }: { viewableItems: Array<any> }) => void;
  /**
   * Optional custom style for the container.
   */
  style?: StyleProp<ViewStyle>;
}
