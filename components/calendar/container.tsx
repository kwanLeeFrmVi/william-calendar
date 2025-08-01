import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ListRenderItemInfo,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  VirtualizedList,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CalendarRow } from "./row";
import { CalendarContainerProps, IDayData } from "./types";

// Constants
const MONTH_RANGE = 2;
const DAY_SECONDS = 86400;
const DEFAULT_ITEM_RENDER = (day: IDayData) => <Text>{String(day.date)}</Text>;

/**
 * A high-performance, infinitely-scrolling calendar grid that supports arbitrary date jumps.
 * This component is designed for efficiency by rendering only the visible items.
 */
export default function CalendarContainer({
  daysPerRow = 7,
  nOfRows = 5, // This prop is not used by VirtualizedList directly
  itemRender = DEFAULT_ITEM_RENDER,
  startOfTheWeek = 0,
  initialDate,
  rowHeight,
  keyExtractor,
  style,
  isDayDisabled,
  separatorType,
  yearRange = MONTH_RANGE,
  scrollToTimestamp,
}: CalendarContainerProps) {
  // Store and refs
  const listRef = useRef<VirtualizedList<any>>(null);
  const [daysBefore, setDaysBefore] = useState(yearRange * 30);
  const [daysAfter, setDaysAfter] = useState(yearRange * 30);

  // Computed values
  const totalDays = useMemo(
    () => daysBefore + daysAfter,
    [daysBefore, daysAfter]
  );
  const totalRows = useMemo(
    () => Math.ceil(totalDays / daysPerRow),
    [totalDays, daysPerRow]
  );

  const initialIndex = useMemo(
    () => Math.ceil(daysBefore / daysPerRow),
    [daysBefore, daysPerRow]
  );

  const [initDate, setInitDate] = useState(
    initialDate ?? Math.floor(Date.now() / 1000)
  );

  /**
   * The timestamp of the very first day in the initial row.
   * This serves as a stable anchor for all date calculations.
   */
  const initialRowTimestamp = useMemo(() => {
    const offsetInRow =
      daysPerRow === 7
        ? (new Date(initDate * 1000).getDay() - startOfTheWeek + 7) % 7
        : 0;
    return initDate - offsetInRow * DAY_SECONDS;
  }, [initDate, daysPerRow, startOfTheWeek]);

  // Handle scrolling to specific timestamp
  useEffect(() => {
    if (scrollToTimestamp && listRef.current) {
      setInitDate(scrollToTimestamp);
      listRef.current?.scrollToIndex?.({
        index: initialIndex,
        animated: true,
      });
    }
  }, [scrollToTimestamp, initialRowTimestamp, initialIndex]);

  // Row height calculation
  const computedRowHeight = useMemo(() => {
    return rowHeight || 0; // Simplified - container height calculation removed as it's not used
  }, [rowHeight]);

  /**
   * Generates row data for a given index.
   * This function is pure and generates data on the fly.
   */
  const getItem = useCallback(
    (_: any, index: number): IDayData[] => {
      const rowStartTimestamp =
        initialRowTimestamp + (index - initialIndex) * daysPerRow * DAY_SECONDS;
      const row: IDayData[] = [];

      for (let dayIndex = 0; dayIndex < daysPerRow; dayIndex++) {
        const dayTimestamp = rowStartTimestamp + dayIndex * DAY_SECONDS;
        const dateObj = new Date(dayTimestamp * 1000);
        const dayData: IDayData = {
          date: dayTimestamp,
          isStartOfWeek: dateObj.getDay() === startOfTheWeek,
          isStartOfMonth: dateObj.getDate() === 1,
          isStartOfYear: dateObj.getMonth() === 0 && dateObj.getDate() === 1,
        };
        row.push(dayData);
      }
      return row;
    },
    [initialRowTimestamp, initialIndex, daysPerRow, startOfTheWeek]
  );

  // Simple getter functions
  const getItemCount = useCallback(() => totalRows, [totalRows]);

  /**
   * Provides layout information for virtualized list performance optimization.
   */
  const getItemLayout = useCallback(
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
  const renderItem = useCallback(
    ({ item, index, separators }: ListRenderItemInfo<IDayData[]>) => {
      const enhancedDays = item.map((day) => ({
        ...day,
        isDisabled: isDayDisabled?.(day.date),
      }));

      return (
        <CalendarRow
          days={enhancedDays}
          itemRender={(day) => itemRender({ ...day, separatorType, index })}
          style={{ height: computedRowHeight }}
        />
      );
    },
    [itemRender, computedRowHeight, isDayDisabled, separatorType]
  );

  /**
   * Extracts unique key for each row based on first day's timestamp.
   */
  const keyExtractorCb = useCallback(
    (item: IDayData[]) => String(item[0]?.date || Date.now()),
    []
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, style]}>
        <VirtualizedList
          ref={listRef}
          renderItem={renderItem}
          keyExtractor={keyExtractor ?? keyExtractorCb}
          getItemCount={getItemCount}
          getItem={getItem}
          getItemLayout={getItemLayout}
          initialScrollIndex={initialIndex}
          initialNumToRender={nOfRows}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            setDaysAfter(daysAfter + MONTH_RANGE * 30);
          }}
          onStartReachedThreshold={0.0}
          onStartReached={() => {
            const newDaysBefore = daysBefore + MONTH_RANGE * 30;
            const newRowsPrepended =
              Math.ceil(newDaysBefore / daysPerRow) -
              Math.ceil(daysBefore / daysPerRow);
            setDaysBefore(newDaysBefore);

            // Adjust scroll position to keep view stable
            if (listRef.current && newRowsPrepended > 0) {
              listRef.current.scrollToIndex({
                index: newRowsPrepended,
                animated: false,
              });
            }
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    width: "100%",
  },
});
