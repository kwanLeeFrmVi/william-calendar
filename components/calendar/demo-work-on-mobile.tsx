import React, { useMemo } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CalendarContainerProps } from "./types";

const _24HInMiliSeconds = 24 * 60 * 60 * 1000;

interface IDayData {
  date: number;
  income: number;
}

interface IDayRowData {
  [key: number]: IDayData[];
}
/**
 * A reusable, high-performance grid of items, designed for the calendar view.
 * This component is responsible for rendering the virtualized list.
 *
 * @param {CalendarGridProps} props - The component props.
 * @returns {React.ReactElement} The rendered grid.
 */
export const Calendar = ({}: CalendarContainerProps): React.ReactElement => {
  const { daysPerRow = 3, nOfRows = 4 } = {};
  const initDate = useMemo(() => Date.now(), []);
  const [days, setDays] = React.useState<IDayRowData>({
    [initDate]: [
      { date: initDate, income: 0 },
      { date: initDate + _24HInMiliSeconds, income: 0 },
      { date: initDate + _24HInMiliSeconds * 2, income: 0 },
    ],
    [initDate + _24HInMiliSeconds * 3]: [
      { date: initDate + _24HInMiliSeconds * 3, income: 0 },
      { date: initDate + _24HInMiliSeconds * 4, income: 0 },
      { date: initDate + _24HInMiliSeconds * 5, income: 0 },
    ],
    [initDate + _24HInMiliSeconds * 6]: [
      { date: initDate + _24HInMiliSeconds * 6, income: 0 },
      { date: initDate + _24HInMiliSeconds * 7, income: 0 },
      { date: initDate + _24HInMiliSeconds * 8, income: 0 },
    ],
  });

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
      return (
        <View key={key} style={styles.row}>
          {item.map((day) => (
            <View
              key={day.date}
              style={[styles.dayCell, { width: `${100 / daysPerRow}%` }]}
            >
              <Text>{new Date(day.date).toLocaleDateString()}</Text>
              <Text>{day.income}</Text>
            </View>
          ))}
        </View>
      );
    },
    []
  );

  // const getItem = (_data: unknown, index: number): ItemData => ({
  //   id: Math.random().toString(12).substring(0),
  //   title: `Item ${index + 1}`,
  // });

  const getItemCount = React.useCallback(() => 300, []);
  const getItem = React.useCallback(
    (_: any, index: number) => {
      let theDay = days[initDate + _24HInMiliSeconds * index];
      if (!theDay) {
        theDay = [];
        for (let i = 0; i < daysPerRow; i++) {
          theDay.push({
            date: initDate + _24HInMiliSeconds * index + i,
            income: 0,
          });
        }
        setDays((prev) => ({
          ...prev,
          [initDate + _24HInMiliSeconds * index]: theDay,
        }));
      }
      console.log("🚀 ~ theDay:", theDay);
      return theDay;
    },
    [days, daysPerRow, initDate]
  );
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <VirtualizedList
          initialNumToRender={3}
          data={days}
          renderItem={renderRow}
          keyExtractor={(item) => item[0].date.toString()}
          getItemCount={getItemCount}
          getItem={getItem}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    width: "100%",
  },
  dayCell: {
    backgroundColor: "#f9c2ff",
    height: 150,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 2,
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
});
