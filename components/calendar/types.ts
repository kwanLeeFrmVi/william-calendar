import { StyleProp, ViewProps, ViewStyle } from "react-native";
import { IDayData } from "./state/days";

export type ItemProps = {
  day: IDayData;
} & ViewProps;

export type ItemRenderFn = (day: IDayData) => React.ReactNode;

/**
 * Props for CalendarContainer
 */
export interface CalendarContainerProps {
  /** number of days per row */
  daysPerRow?: number;
  /** number of rows visible at start */
  nOfRows?: number;
  /** custom renderer for day item */
  itemRender?: ItemRenderFn;
  /** start day of week (0=Sunday) when daysPerRow is 7 */
  startOfTheWeek?: number;
  /** initial date (timestamp seconds) to center on */
  initialDate?: number;
  /** fixed height of each row in pixels; auto-calculated as containerHeight/nOfRows if omitted */
  rowHeight?: number;
  /**
   * Optional custom key extractor for each row.
   * Defaults to using the first day's timestamp.
   */
  keyExtractor?: (item: IDayData[]) => string;

  style?: StyleProp<ViewStyle>;
}
