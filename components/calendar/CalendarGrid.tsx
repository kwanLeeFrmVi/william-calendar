import React from "react";
import { ViewabilityConfig, VirtualizedList } from "react-native";
import { IDayData } from "./state/days";
import { CalendarGridProps } from "./types";

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

/**
 * A reusable, high-performance grid of items, designed for the calendar view.
 * This component is responsible for rendering the virtualized list.
 *
 * @param {CalendarGridProps} props - The component props.
 * @returns {React.ReactElement} The rendered grid.
 */
export const CalendarGrid = ({
  renderRow,
  nOfRows,
  keyExtractor,
  getItemCount,
  getRow,
  getItemLayout,
  initialScrollIndex,
  onViewableItemsChanged,
  style,
  ref: forwardedRef,
}: CalendarGridProps) => {
  const listRef = React.useRef<VirtualizedList<IDayData[]>>(null);
  const ref = forwardedRef || listRef;

  return (
    <VirtualizedList
      ref={ref}
      data={null}
      initialNumToRender={nOfRows}
      windowSize={21}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      renderItem={renderRow}
      keyExtractor={keyExtractor}
      getItemCount={getItemCount}
      getItem={getRow}
      getItemLayout={getItemLayout}
      initialScrollIndex={initialScrollIndex}
      contentContainerStyle={[{ flexGrow: 1 }, style]}
      removeClippedSubviews={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
};
