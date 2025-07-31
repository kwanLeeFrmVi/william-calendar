import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function DocsScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type='title' style={styles.title}>
          Calendar Components Documentation
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          A guide for developers on how to use the calendar components
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type='subtitle' style={styles.sectionTitle}>
          Overview
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          This documentation provides guidance on how to use the calendar
          components in your React Native application. The calendar system is
          composed of several reusable components that work together to create a
          high-performance, infinitely-scrolling calendar grid.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type='subtitle' style={styles.sectionTitle}>
          Core Components
        </ThemedText>

        <ThemedView style={styles.componentCard}>
          <ThemedText type='defaultSemiBold' style={styles.componentTitle}>
            CalendarContainer
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            The main component that renders the calendar grid. It handles the
            virtualization and infinite scrolling of calendar days.
          </ThemedText>
          <ThemedText style={styles.codeBlock}>
            {`<CalendarContainer
  daysPerRow={7}
  nOfRows={5}
  itemRender={(day) => <CalendarItem day={day} />}
  initialDate={Math.floor(Date.now() / 1000)}
/>`}
          </ThemedText>
          <ThemedText style={styles.paragraph}>Key props:</ThemedText>
          <ThemedText style={styles.listItem}>
            • daysPerRow: Number of days per row (default: 7)
          </ThemedText>
          <ThemedText style={styles.listItem}>
            • nOfRows: Number of visible rows (default: 5)
          </ThemedText>
          <ThemedText style={styles.listItem}>
            • itemRender: Function to render each day
          </ThemedText>
          <ThemedText style={styles.listItem}>
            • initialDate: Starting date as Unix timestamp
          </ThemedText>
          <ThemedText style={styles.listItem}>
            • rowHeight: Fixed height for each row
          </ThemedText>
          <ThemedText style={styles.listItem}>
            • isDayDisabled: Function to disable specific days
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.componentCard}>
          <ThemedText type='defaultSemiBold' style={styles.componentTitle}>
            CalendarItem
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            The default renderer for individual day cells. Handles selection
            state and displays the day of the month.
          </ThemedText>
          <ThemedText style={styles.codeBlock}>
            {`<CalendarItem day={dayData} />`}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.componentCard}>
          <ThemedText type='defaultSemiBold' style={styles.componentTitle}>
            WilliamItem
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            An enhanced day cell renderer that can display additional data like
            income and expenses.
          </ThemedText>
          <ThemedText style={styles.codeBlock}>
            {`<WilliamItem day={dayData} />`}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type='subtitle' style={styles.sectionTitle}>
          State Management
        </ThemedText>

        <ThemedView style={styles.componentCard}>
          <ThemedText type='defaultSemiBold' style={styles.componentTitle}>
            selectionStore
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            A Zustand store for managing date selection state.
          </ThemedText>
          <ThemedText style={styles.codeBlock}>
            {`import { selectionStore } from '@/components/calendar/state/selection';

const selectedDate = selectionStore(state => state.selectedDate);
const setSelectedDate = selectionStore(state => state.setSelectedDate);`}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.componentCard}>
          <ThemedText type='defaultSemiBold' style={styles.componentTitle}>
            dayStore
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            A Zustand store for managing calendar day data and scrolling.
          </ThemedText>
          <ThemedText style={styles.codeBlock}>
            {`import { dayStore } from '@/components/calendar/state/days';

const { days, addDay, setScrollToTimestamp } = dayStore();`}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type='subtitle' style={styles.sectionTitle}>
          Usage Examples
        </ThemedText>

        <ThemedView style={styles.componentCard}>
          <ThemedText type='defaultSemiBold' style={styles.componentTitle}>
            Basic Calendar
          </ThemedText>
          <ThemedText style={styles.codeBlock}>
            {`import { CalendarContainer } from '@/components/calendar/container';
import { CalendarItem } from '@/components/calendar/item';

<CalendarContainer
  itemRender={(day) => <CalendarItem day={day} />}
/>`}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.componentCard}>
          <ThemedText type='defaultSemiBold' style={styles.componentTitle}>
            Custom Day Renderer
          </ThemedText>
          <ThemedText style={styles.codeBlock}>
            {`<CalendarContainer
  itemRender={(day) => (
    <WilliamItem day={day} />
  )}
/>`}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.componentCard}>
          <ThemedText type='defaultSemiBold' style={styles.componentTitle}>
            Jump to Date
          </ThemedText>
          <ThemedText style={styles.codeBlock}>
            {`import { dayStore } from '@/components/calendar/state/days';

const { setScrollToTimestamp } = dayStore();

const jumpToToday = () => {
  const today = Math.floor(Date.now() / 1000);
  setScrollToTimestamp(today);
};`}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type='subtitle' style={styles.sectionTitle}>
          Navigation
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Check out the other tabs to see the calendar components in action:
        </ThemedText>
        <ThemedText style={styles.listItem}>
          • Calendar: Basic calendar implementation
        </ThemedText>
        <ThemedText style={styles.listItem}>
          • Demo: UI example with calendar placeholder
        </ThemedText>
        <ThemedText style={styles.listItem}>
          • Demo2: Another example screen
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  paragraph: {
    marginBottom: 8,
  },
  componentCard: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  componentTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  codeBlock: {
    fontFamily: "monospace",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
    fontSize: 12,
  },
  listItem: {
    marginBottom: 4,
  },
});
