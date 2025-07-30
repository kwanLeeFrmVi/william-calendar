import { CalendarContainer } from "@/components/calendar/container";
import { CalendarItem } from "@/components/calendar/item";
import { dayStore } from "@/components/calendar/state/days";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  Platform,
} from "react-native";

/**
 * Calendar tab showing an infinite-scroll calendar grid.
 */
export default function CalendarScreen() {
  const [dateInput, setDateInput] = useState("");
  const { setScrollToTimestamp } = dayStore();

  const handleJumpToDate = () => {
    const parsedDate = new Date(dateInput);
    if (!isNaN(parsedDate.getTime())) {
      const timestamp = Math.floor(parsedDate.getTime() / 1000);
      setScrollToTimestamp(timestamp);
    } else {
      Alert.alert("Invalid Date", "Please enter a valid date format (e.g., YYYY-MM-DD).");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={dateInput}
          onChangeText={setDateInput}
        />
        <Button title="Jump to Date" onPress={handleJumpToDate} />
      </View>
      <View style={styles.calendarWrapper}>
        <CalendarContainer
          daysPerRow={7}
          nOfRows={5}
          rowHeight={60}
          startOfTheWeek={1}
          initialDate={Math.floor(Date.now() / 1000)}
          itemRender={(itemProps) => (
            <CalendarItem day={itemProps} style={styles.dayCell} />
          )}
          style={styles.calendarContainer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7ba1a3",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  inputContainer: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    backgroundColor: "white",
    width: 150,
  },
  calendarWrapper: {
    width: "90%",
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
    width: "100%",
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#fbcece",
  },
});
