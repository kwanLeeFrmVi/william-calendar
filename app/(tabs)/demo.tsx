import { CalendarContainer } from "@/components/calendar/container";
import { WilliamItem } from "@/components/calendar/william-item";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * A demo screen to showcase the calendar component with a custom configuration.
 */
export default function DemoScreen() {
  const isDayDisabled = (date: number) => {
    const dayOfWeek = new Date(date * 1000).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Disable Saturday and Sunday
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekend-Disabled Calendar</Text>
      <View style={styles.calendarWrapper}>
        <CalendarContainer
          daysPerRow={4}
          nOfRows={4}
          rowHeight={70}
          startOfTheWeek={1}
          initialDate={Math.floor(Date.now() / 1000)}
          itemRender={(itemProps) => (
            <WilliamItem day={itemProps} style={styles.dayCell} />
          )}
          style={styles.calendarContainer}
          isDayDisabled={isDayDisabled}
          // separatorType='week'
        />
      </View>
      <View style={{ height: 200 }} />
      <Text style={styles.title}>Monthly Separator Calendar</Text>
      <View style={styles.calendarWrapper}>
        <CalendarContainer
          daysPerRow={7}
          nOfRows={5}
          rowHeight={60}
          startOfTheWeek={1}
          initialDate={Math.floor(Date.now() / 1000)}
          itemRender={(itemProps) => (
            <WilliamItem day={itemProps} style={styles.dayCell} />
          )}
          style={styles.calendarContainer}
          separatorType='month'
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7ba1a3",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  calendarWrapper: {
    width: "90%",
    height: 400,
  },
  calendarContainer: {
    flex: 1,
    width: "100%",
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
