import { CalendarContainer } from "@/components/calendar/container";
import { IDayData } from "@/components/calendar/state/days";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SFSymbol } from "expo-symbols";
import React, { useCallback, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const TransactionRow = ({
  amount,
  icon,
  color,
}: {
  amount: number;
  icon: SFSymbol;
  color: string;
}) => (
  <View style={CalendarCellStyles.transactionRow}>
    <IconSymbol name={icon} size={16} color={color} />
    <ThemedText style={[CalendarCellStyles.transactionText, { color }]}>
      ${amount.toLocaleString()}
    </ThemedText>
  </View>
);

export const CalendarCell = ({ day }: { day: IDayData }) => {
  const dayOfMonth = new Date(day.date * 1000).toLocaleDateString();
  const hasTransaction = day.income || day.expenses;
  const dayOfWeek = new Date(day.date * 1000).toLocaleDateString("en-US", {
    weekday: "short",
  });
  return (
    <View style={CalendarCellStyles.cellContainer}>
      <ThemedText style={CalendarCellStyles.dayNumber}>
        {dayOfWeek} {String(dayOfMonth).padStart(2, "0")}
      </ThemedText>
      {hasTransaction ? (
        <View style={CalendarCellStyles.transactionsContainer}>
          {/* {Object.entries(MOCK_DATA).map(([amount, { icon, color }]) => (
            <TransactionRow key={amount} amount={Number(amount)} icon={icon} color={color} />
          ))} */}
          {day.income && (
            <TransactionRow amount={day.income} icon='arrow.up' color='green' />
          )}
          {day.expenses && (
            <TransactionRow
              amount={day.expenses}
              icon='arrow.down'
              color='red'
            />
          )}
        </View>
      ) : (
        <View style={CalendarCellStyles.noTransactionContainer}>
          <IconSymbol name='doc.text' size={24} color='#a0a0a0' />
          <ThemedText style={CalendarCellStyles.noTransactionText}>
            No Transaction
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const CalendarCellStyles = StyleSheet.create({
  cellContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 4,
    padding: 8,
    justifyContent: "space-between",
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1D3D47",
    alignSelf: "flex-start",
  },
  transactionsContainer: {
    marginTop: 8,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  transactionText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "500",
  },
  noTransactionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  noTransactionText: {
    fontSize: 10,
    color: "#a0a0a0",
    marginTop: 4,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
  },
  calendarContainer: {
    height: 600, // 5 rows * 120px height per row
  },
});

export default function Demo2Screen() {
  const [activeTab, setActiveTab] = useState("Calendar");
  const [containerHeight, setContainerHeight] = useState(0);

  const onContainerLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height);
  }, []);

  const cellHeight = useMemo(() => containerHeight / 3 - 20, [containerHeight]);
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <ThemedText style={styles.headerText}>Hey, Ollie</ThemedText>
          <View style={styles.headerIcons}>
            <IconSymbol name='magnifyingglass' size={24} color='white' />
            <IconSymbol
              name='bell'
              size={24}
              color='white'
              style={{ marginLeft: 16 }}
            />
          </View>
        </View>
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder='Have a Question?'
            placeholderTextColor='#888'
            style={styles.searchBar}
          />
          <IconSymbol
            name='magnifyingglass'
            size={20}
            color='#888'
            style={styles.searchIcon}
          />
        </View>
        <View style={styles.tabsContainer}>
          {["AI Facts", "Calendar", "Balances"].map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </ThemedView>

      <View style={styles.contentContainer} onLayout={onContainerLayout}>
        <ThemedText style={styles.contentTitle}>Calendar View</ThemedText>

        <CalendarContainer
          daysPerRow={3}
          nOfRows={3}
          rowHeight={cellHeight}
          itemRender={(itemProps) => <CalendarCell day={itemProps} />}
          style={styles.calendarContainer}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  header: {
    backgroundColor: "#1D3D47",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerIcons: {
    flexDirection: "row",
  },
  searchBarContainer: {
    marginTop: 20,
    position: "relative",
  },
  searchBar: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 40, // Space for the icon
    fontSize: 16,
  },
  searchIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "white",
  },
  tabText: {
    color: "white",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#1D3D47",
  },
  contentContainer: {
    padding: 20,
    height: "100%",
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1D3D47",
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
  },
  calendarContainer: {
    height: 600, // 5 rows * 120px height per row
  },
});
