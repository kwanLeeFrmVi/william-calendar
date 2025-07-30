import {
  CalendarContainer,
  CalendarContainerRef,
} from "@/components/calendar/container";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * Calendar tab showing an infinite-scroll calendar grid.
 */
export default function CalendarScreen() {
  const calendarRef = useRef<CalendarContainerRef>(null);

  return (
    <View style={styles.container}>
      <CalendarContainer
        ref={calendarRef}
        daysPerRow={7}
        nOfRows={5}
        rowHeight={60}
        startOfTheWeek={1}
        initialDate={Math.floor(Date.now() / 1000)}
        itemRender={(day) => (
          <View style={styles.dayCell}>
            <Text>{new Date(day.date * 1000).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
