import React from "react";
import { VirtualizedList } from "react-native";
import { CalendarItem } from "./item";
import { CalendarRow } from "./row";
import { dayStore, IDayData } from "./state/days";
import { CalendarContainerProps } from "./types";

/**
 * High performance calendar container with infinite scroll
 * and ability to jump to arbitrary date.
 */
function CalendarContainerFn({
  daysPerRow = 1,
  nOfRows = 7,
  itemRender = (day: IDayData) => <CalendarItem day={day} />,
  startOfTheWeek = 0,
  initialDate,
  rowHeight,
  keyExtractor,
  style,
}: CalendarContainerProps) {
  const { days: storeDays, scrollToTimestamp } = dayStore();

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

  React.useEffect(() => {
    if (scrollToTimestamp) {
      const deltaDays = Math.ceil(
        (scrollToTimestamp - initialRowTimestamp) / DAY_SECONDS
      );
      const rowIndex = initialIndex + Math.floor(deltaDays / daysPerRow);
      listRef.current?.scrollToIndex({ index: rowIndex, animated: true });
    }
  }, [scrollToTimestamp, initialRowTimestamp, initialIndex, daysPerRow]);

  const getRow = React.useCallback(
    (_: any, index: number): IDayData[] => {
      const startTs =
        initialRowTimestamp + (index - initialIndex) * daysPerRow * DAY_SECONDS;
      const row: IDayData[] = [];
      for (let i = 0; i < daysPerRow; i++) {
        const ts = startTs + i * DAY_SECONDS;
        // Always create a stable object reference for each day
        // This ensures the day data is consistent even if it's not in the store
        const existingData = storeDays.get(ts);
        const dayData = existingData
          ? { ...existingData }
          : ({ date: ts } as IDayData);
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
    () => rowHeight ?? (containerHeight > 0 ? containerHeight / nOfRows : 0),
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
        style={{ height: computedRowHeight, backgroundColor: "#00bb44" }}
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
        windowSize={
          21
        } /* Increase window size to prevent recycling too aggressively */
        maxToRenderPerBatch={10} /* Render more items per batch */
        updateCellsBatchingPeriod={50} /* More frequent updates */
        renderItem={renderRow}
        keyExtractor={keyExtractor ?? keyExtractorCb}
        getItemCount={getItemCount}
        getItem={getRow}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndex}
        contentContainerStyle={[{ flexGrow: 1 }, style]}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        /* Ensure stable rendering */
        removeClippedSubviews={false}
      />
    </React.Fragment>
  );
}

export const CalendarContainer = CalendarContainerFn;
