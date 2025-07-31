import React from "react";
import { Text } from "react-native";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarRow } from "./row";
import { dayStore, IDayData } from "./state/days";
import { CalendarContainerProps } from "./types";

// Constants
const YEAR_RANGE = 100;
const DAY_SECONDS = 86400;
const DEFAULT_ITEM_RENDER = (day: IDayData) => <Text>{day.date}</Text>;

/**
 * A high-performance, infinitely-scrolling calendar grid that supports arbitrary date jumps.
 * This component is designed for efficiency by rendering only the visible items.
 */
function CalendarContainerFn({
  daysPerRow = 7,
  nOfRows = 5,
  itemRender = DEFAULT_ITEM_RENDER,
  startOfTheWeek = 0,
  initialDate,
  rowHeight,
  keyExtractor,
  style,
  isDayDisabled,
  separatorType,
  yearRange = YEAR_RANGE,
}: CalendarContainerProps) {
  // Store and refs
  const { days: storeDays, scrollToTimestamp, fetchDaysData } = dayStore();
  const listRef = React.useRef<any>(null);

  // Computed values
  const totalDays = yearRange * 2 * 365;
  const totalRows = Math.ceil(totalDays / daysPerRow);
  const initialIndex = Math.floor(totalRows / 2);

  // Initialize date - memoized to prevent unnecessary recalculations
  const initDate = React.useMemo(
    () => initialDate ?? Math.floor(Date.now() / 1000),
    [initialDate]
  );

  /**
   * The timestamp of the very first day in the initial row.
   * This serves as a stable anchor for all date calculations.
   */
  const initialRowTimestamp = React.useMemo(() => {
    const offsetInRow =
      daysPerRow === 7
        ? (new Date(initDate * 1000).getDay() - startOfTheWeek + 7) % 7
        : 0;
    return initDate - offsetInRow * DAY_SECONDS;
  }, [initDate, daysPerRow, startOfTheWeek]);

  // Handle scrolling to specific timestamp
  React.useEffect(() => {
    if (scrollToTimestamp && listRef.current) {
      const deltaDays = Math.ceil(
        (scrollToTimestamp - initialRowTimestamp) / DAY_SECONDS
      );
      const targetRowIndex = initialIndex + Math.floor(deltaDays / daysPerRow);
      listRef.current.scrollToIndex?.({
        index: targetRowIndex,
        animated: true,
      });
    }
  }, [scrollToTimestamp, initialRowTimestamp, initialIndex, daysPerRow]);

  // Row height calculation
  const computedRowHeight = React.useMemo(() => {
    return rowHeight || 0; // Simplified - container height calculation removed as it's not used
  }, [rowHeight]);

  /**
   * Generates row data for a given index.
   * Creates and caches day data if not already in store.
   */
  const getRow = React.useCallback(
    (_: any, index: number): IDayData[] => {
      const rowStartTimestamp =
        initialRowTimestamp + (index - initialIndex) * daysPerRow * DAY_SECONDS;
      const row: IDayData[] = [];

      for (let dayIndex = 0; dayIndex < daysPerRow; dayIndex++) {
        const dayTimestamp = rowStartTimestamp + dayIndex * DAY_SECONDS;
        let dayData = storeDays.get(dayTimestamp);

        if (!dayData) {
          const dateObj = new Date(dayTimestamp * 1000);
          dayData = {
            date: dayTimestamp,
            isStartOfWeek: dateObj.getDay() === startOfTheWeek,
            isStartOfMonth: dateObj.getDate() === 1,
            isStartOfYear: dateObj.getMonth() === 0 && dateObj.getDate() === 1,
          };
          dayStore.getState().addDay(dayTimestamp, dayData);
        }
        row.push(dayData);
      }
      return row;
    },
    [initialRowTimestamp, initialIndex, daysPerRow, storeDays, startOfTheWeek]
  );

  // Simple getter functions
  const getItemCount = React.useCallback(() => totalRows, [totalRows]);

  /**
   * Provides layout information for virtualized list performance optimization.
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
   * Renders a calendar row with enhanced day data.
   */
  const renderRow = React.useCallback(
    ({
      item,
      index,
      key,
    }: {
      item: IDayData[];
      index: number;
      key?: string;
    }) => {
      const enhancedDays = item.map((day) => ({
        ...day,
        isDisabled: isDayDisabled?.(day.date),
      }));

      return (
        <CalendarRow
          days={enhancedDays}
          itemRender={(day) => itemRender({ ...day, separatorType })}
          style={{ height: computedRowHeight }}
        />
      );
    },
    [itemRender, computedRowHeight, isDayDisabled, separatorType]
  );

  /**
   * Extracts unique key for each row based on first day's timestamp.
   */
  const keyExtractorCb = React.useCallback(
    (item: IDayData[]) => String(item[0]?.date || 0),
    []
  );

  /**
   * Handles viewable items change to fetch data for visible date range.
   */
  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length === 0) return;

      const firstVisible = viewableItems[0];
      const lastVisible = viewableItems[viewableItems.length - 1];

      if (firstVisible?.item && lastVisible?.item) {
        const startTimestamp = firstVisible.item[0]?.date;
        const endTimestamp =
          lastVisible.item[lastVisible.item.length - 1]?.date;

        if (startTimestamp && endTimestamp) {
          fetchDaysData(startTimestamp, endTimestamp);
        }
      }
    },
    [fetchDaysData]
  );

  return (
    <CalendarGrid
      ref={listRef}
      renderRow={renderRow}
      nOfRows={nOfRows}
      keyExtractor={keyExtractor ?? keyExtractorCb}
      getItemCount={getItemCount}
      getRow={getRow}
      getItemLayout={getItemLayout}
      initialScrollIndex={initialIndex}
      onViewableItemsChanged={onViewableItemsChanged}
      style={style}
    />
  );
}

export const CalendarContainer = CalendarContainerFn;
