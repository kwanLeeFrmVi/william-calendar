import React from "react";
import { VirtualizedList } from "react-native";
import { CalendarItem } from "./item";
import { CalendarRow } from "./row";
import { dayStore, IDayData } from "./state/days";

/**
 * High performance calendar container with infinite scroll
 * and ability to jump to arbitrary date.
 */
function CalendarContainerFn(
  {
    daysPerRow = 1,
    nOfRows = 7,
    itemRender = CalendarItem,
    startOfTheWeek = 0,
    initialDate,
    rowHeight,
    keyExtractor,
  }: CalendarContainerProps,
  ref: React.ForwardedRef<CalendarContainerRef>
) {
  const { days: storeDays } = dayStore();

  const YEAR_RANGE = 100;
  const DAY_SECONDS = 86400;

  const totalDays = YEAR_RANGE * 2 * 365;
  const totalRows = Math.ceil(totalDays / daysPerRow);
  const initialIndex = Math.floor(totalRows / 2);

  const [initDate] = React.useState(
    () => initialDate ?? Math.floor(Date.now() / 1000)
  );
  const initialRowTimestamp = React.useMemo(() => {
    const offsetInRow =
      daysPerRow === 7
        ? (new Date(initDate * 1000).getDay() - startOfTheWeek + 7) % 7
        : 0;
    return initDate - offsetInRow * DAY_SECONDS;
  }, [initDate, daysPerRow, startOfTheWeek]);

  const listRef = React.useRef<VirtualizedList<IDayData[]>>(null);

  React.useImperativeHandle(ref, () => ({
    scrollToDate: (dateTimestamp: number) => {
      const deltaDays = Math.ceil(
        (dateTimestamp - initialRowTimestamp) / DAY_SECONDS
      );
      const rowIndex = initialIndex + Math.floor(deltaDays / daysPerRow);
      listRef.current?.scrollToIndex({ index: rowIndex, animated: true });
    },
  }));

  const getRow = React.useCallback(
    (_: any, index: number): IDayData[] => {
      const startTs =
        initialRowTimestamp +
        (index - initialIndex) * daysPerRow * DAY_SECONDS;
      const row: IDayData[] = [];
      for (let i = 0; i < daysPerRow; i++) {
        const ts = startTs + i * DAY_SECONDS;
        // Always create a stable object reference for each day
        // This ensures the day data is consistent even if it's not in the store
        const existingData = storeDays.get(ts);
        const dayData = existingData ? { ...existingData } : { date: ts } as IDayData;
        row.push(dayData);
      }
      return row;
    },
    [initialRowTimestamp, initialIndex, daysPerRow, storeDays]
  );

  const getItemCount = React.useCallback(() => totalRows, [totalRows]);

  // Compute per-row height: either provided or divide container height by visible rows
  const [containerHeight, setContainerHeight] = React.useState(0);
  const computedRowHeight = React.useMemo(
    () => (rowHeight ?? (containerHeight > 0 ? containerHeight / nOfRows : 0)),
    [rowHeight, containerHeight, nOfRows]
  );

  const getItemLayout = React.useCallback(
    (_: IDayData[][] | null, index: number) => ({
      length: computedRowHeight,
      offset: computedRowHeight * index,
      index,
    }),
    [computedRowHeight]
  );

  const renderRow = React.useCallback(
    ({ item }: { item: IDayData[] }) => (
      <CalendarRow
        days={item}
        itemRender={itemRender}
        style={{ height: computedRowHeight }}
      />
    ),
    [itemRender, computedRowHeight]
  );

  const keyExtractorCb = React.useCallback(
    (item: IDayData[]) => String(item[0]?.date),
    []
  );

  return (
    <React.Fragment>
      <VirtualizedList
        ref={listRef}
        data={null}
        initialNumToRender={nOfRows}
        windowSize={21} /* Increase window size to prevent recycling too aggressively */
        maxToRenderPerBatch={10} /* Render more items per batch */
        updateCellsBatchingPeriod={50} /* More frequent updates */
        renderItem={renderRow}
        keyExtractor={keyExtractor ?? keyExtractorCb}
        getItemCount={getItemCount}
        getItem={getRow}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndex}
        contentContainerStyle={{ flexGrow: 1 }}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        /* Ensure stable rendering */
        removeClippedSubviews={false}
      />
    </React.Fragment>
  );
}

/**
 * Props for CalendarContainer
 */
interface CalendarContainerProps {
  /** number of days per row */
  daysPerRow?: number;
  /** number of rows visible at start */
  nOfRows?: number;
  /** custom renderer for day item */
  itemRender?: (day: IDayData) => React.ReactNode;
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
}

/**
 * Methods exposed via ref
 */
export type CalendarContainerRef = {
  /** scroll to the given date (timestamp seconds) */
  scrollToDate: (dateTimestamp: number) => void;
};

export const CalendarContainer = React.forwardRef<
  CalendarContainerRef,
  CalendarContainerProps
>(CalendarContainerFn);
