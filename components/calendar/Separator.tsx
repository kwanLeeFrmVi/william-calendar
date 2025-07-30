import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SeparatorProps {
  date: number;
  type: 'week' | 'month' | 'year';
}

/**
 * Renders a separator for the calendar, displaying the week, month, or year.
 *
 * @param {SeparatorProps} props - The component props.
 * @returns {React.ReactElement} The rendered separator.
 */
export const Separator = ({ date, type }: SeparatorProps) => {
  const dateObj = new Date(date * 1000);
  let text = "";

  if (type === "week") {
    const weekOfMonth = Math.ceil(dateObj.getDate() / 7);
    text = `Week ${weekOfMonth}`;
  } else if (type === "month") {
    text = dateObj.toLocaleString("default", { month: "long" });
  } else if (type === "year") {
    text = dateObj.getFullYear().toString();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontWeight: 'bold',
  },
});