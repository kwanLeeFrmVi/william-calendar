import React from "react";
import { ViewabilityConfig, VirtualizedList } from "react-native";
import { CalendarRow } from "./row";
import { dayStore, IDayData } from "./state/days";
import { CalendarContainerProps, ItemRenderFn } from "./types";

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

/**
 * A high-performance, infinitely-scrolling calendar grid that supports arbitrary date jumps.
 * This component is designed for efficiency by rendering only the visible items.
 *
 * @param {CalendarContainerProps} props - The component props.
 * @returns {React.ReactElement} The rendered calendar container.
 */
function CalendarContainerFn({
  daysPerRow = 7,
  nOfRows = 5,
  itemRender,
  startOfTheWeek = 0,
  initialDate,
  rowHeight,
  keyExtractor,
  style,
}: CalendarContainerProps) {
  const { days: storeDays, scrollToTimestamp, fetchDaysData } = dayStore();

  const YEAR_RANGE = 100;
  const DAY_SECONDS = 86400;

  const totalDays = YEAR_RANGE * 2 * 365;
  const totalRows = Math.ceil(totalDays / daysPerRow);
  const initialIndex = Math.floor(totalRows / 2);

  const [initDate] = React.useState(
    () => initialDate ?? Math.floor(Date.now() / 1000)
  );

  /**
   * The timestamp of the very first day in the initial row.
   * This is used as a stable anchor for all date calculations.
   */
  const initialRowTimestamp = React.useMemo(() => {
    const offsetInRow =
      daysPerRow === 7
        ? (new Date(initDate * 1000).getDay() - startOfTheWeek + 7) % 7
        : 0;
    return initDate - offsetInRow * DAY_SECONDS;
  }, [initDate, daysPerRow, startOfTheWeek]);

  const listRef = React.useRef<VirtualizedList<IDayData[]>>(null);

  /**
   * Effect to handle scrolling to a specific date when `scrollToTimestamp` changes in the store.
   */
  React.useEffect(() => {
    if (scrollToTimestamp) {
      const deltaDays = Math.ceil(
        (scrollToTimestamp - initialRowTimestamp) / DAY_SECONDS
      );
      const rowIndex = initialIndex + Math.floor(deltaDays / daysPerRow);
      listRef.current?.scrollToIndex({ index: rowIndex, animated: true });
    }
  }, [scrollToTimestamp, initialRowTimestamp, initialIndex, daysPerRow]);

  /**
   * Generates the data for a given row index.
   * If a day's data is not in the store, it's created and added.
   */
  const getRow = React.useCallback(
    (_: any, index: number): IDayData[] => {
      const startTs =
        initialRowTimestamp + (index - initialIndex) * daysPerRow * DAY_SECONDS;
      const row: IDayData[] = [];
      for (let i = 0; i < daysPerRow; i++) {
        const ts = startTs + i * DAY_SECONDS;
        let dayData = storeDays.get(ts);
        if (!dayData) {
          dayData = { date: ts };
          dayStore.getState().addDay(ts, dayData);
        }
        row.push(dayData);
      }
      return row;
    },
    [initialRowTimestamp, initialIndex, daysPerRow, storeDays]
  );

  /**
   * Returns the total number of rows in the list.
   */
  const getItemCount = React.useCallback(() => totalRows, [totalRows]);

  const [containerHeight, setContainerHeight] = React.useState(0);

  /**
   * Calculates the height of each row, either from props or by dividing the container height.
   */
  const computedRowHeight = React.useMemo(
    () => (rowHeight ? rowHeight : containerHeight > 0 ? containerHeight / nOfRows : 0),
    [rowHeight, containerHeight, nOfRows]
  );

  /**
   * Provides the layout information for each item, which is essential for `VirtualizedList` performance.
   */
  const getItemLayout = React.useCallback(
    (_: IDayData[][] | null, index: number) => ({
      length: computedRowHeight,
      offset: computedRowHeight * index,
      index,
    }),
    [computedRowHeight]
  );

  /**
   * Renders a single row of the calendar.
   */
  const renderRow = React.useCallback(
    ({ item }: { item: IDayData[] }) => (
      <CalendarRow
        days={item}
        itemRender={itemRender as ItemRenderFn}
        style={{ height: computedRowHeight }}
      />
    ),
    [itemRender, computedRowHeight]
  );

  /**
   * Extracts a unique key for each row.
   */
  const keyExtractorCb = React.useCallback(
    (item: IDayData[]) => String(item[0]?.date),
    []
  );

  /**
   * Callback for when the viewable items change, used to fetch data for the visible date range.
   */
  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems }: { viewableItems: Array<any> }) => {
      if (viewableItems.length > 0) {
        const firstVisible = viewableItems[0];
        const lastVisible = viewableItems[viewableItems.length - 1];

        if (firstVisible.item && lastVisible.item) {
          const startTs = firstVisible.item[0].date;
          const endTs = lastVisible.item[lastVisible.item.length - 1].date;
          fetchDaysData(startTs, endTs);
        }
      }
    },
    [fetchDaysData]
  );

  return (
    <React.Fragment>
      <VirtualizedList
        ref={listRef}
        data={null}
        initialNumToRender={nOfRows}
        windowSize={21}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        renderItem={renderRow}
        keyExtractor={keyExtractor ?? keyExtractorCb}
        getItemCount={getItemCount}
        getItem={getRow}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndex}
        contentContainerStyle={[{ flexGrow: 1 }, style]}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        removeClippedSubviews={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </React.Fragment>
  );
}

export const CalendarContainer = CalendarContainerFn;
