# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Calendar Container Component

Add a performant, infinite-scrolling calendar grid to your app.

### Usage

```tsx
import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarContainer, CalendarContainerRef } from './components/calendar/container';

export default function CalendarScreen() {
  const calendarRef = useRef<CalendarContainerRef>(null);

  return (
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
  );
}

const styles = StyleSheet.create({
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### Props

| Prop           | Type                         | Default        | Description                                                 |
| -------------- | ---------------------------- | -------------- | ----------------------------------------------------------- |
| daysPerRow     | number                       | `1`            | Number of days per row.                                     |
| nOfRows        | number                       | `7`            | Number of rows to render initially.                         |
| rowHeight      | number                       | auto           | Pixel height of each row. If omitted, computed as containerHeight / nOfRows. |
| startOfTheWeek | number                       | `0`            | First day of week for 7-day rows (0=Sunday).                |
| initialDate    | number                       | now            | Center scroll position date (timestamp in seconds).         |
| itemRender     | (day: IDayData) => ReactNode | `CalendarItem` | Custom renderer for each day cell.                          |
| keyExtractor   | (item: IDayData[]) => string   | first date   | Custom key extractor for rows; defaults to using the first item's date timestamp.

### Imperative Methods

Access the following method via ref:

```ts
calendarRef.current?.scrollToDate(targetTimestampInSeconds);
```
