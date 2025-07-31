import CalendarContainer from "@/components/calendar/container";
import { CalendarItem } from "@/components/calendar/item";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

dayjs.extend(customParseFormat);
/**
 * Calendar tab showing an infinite-scroll calendar grid.
 */
function getLocaleDatePlaceholder() {
  try {
    const locale =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language
        : undefined;
    const formatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    // Use a sample date to get the format string
    const parts = formatter.formatToParts(new Date(2000, 0, 2));
    return parts
      .map((part) => {
        switch (part.type) {
          case "year":
            return "YYYY";
          case "month":
            return "MM";
          case "day":
            return "DD";
          default:
            return part.value;
        }
      })
      .join("");
  } catch {
    return "YYYY-MM-DD";
  }
}

export default function CalendarScreen() {
  const [dateInput, setDateInput] = useState("");
  const [scrollToTimestamp, setScrollToTimestamp] = useState<number>();

  const handleJumpToDate = () => {
    const parsedDate = dayjs(dateInput, getLocaleDatePlaceholder());
    console.log("🚀 ~ handleJumpToDate ~ parsedDate:", parsedDate, dateInput);
    if (parsedDate.isValid()) {
      const timestamp = Math.floor(parsedDate.valueOf() / 1000);
      setScrollToTimestamp(timestamp);
    } else {
      Alert.alert(
        "Invalid Date",
        `Please enter a valid date format (e.g., ${getLocaleDatePlaceholder()}).`
      );
    }
  };

  const isDayDisabled = (date: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const dayMonth = new Date(date * 1000).getMonth();
    return currentMonth !== dayMonth;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={getLocaleDatePlaceholder()}
          value={dateInput}
          onChangeText={setDateInput}
        />
        <Button title='Jump to Date' onPress={handleJumpToDate} />
      </View>
      <View style={styles.calendarWrapper}>
        <CalendarContainer
          daysPerRow={3}
          nOfRows={3}
          rowHeight={80}
          startOfTheWeek={1}
          initialDate={Math.floor(Date.now() / 1000)}
          itemRender={(itemProps) => (
            <CalendarItem day={itemProps} style={styles.dayCell} />
          )}
          style={styles.calendarContainer}
          isDayDisabled={isDayDisabled}
          scrollToTimestamp={scrollToTimestamp}
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
