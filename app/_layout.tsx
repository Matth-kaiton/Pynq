import "react-native-reanimated";

import * as Calendar from "expo-calendar";
import { useEffect, useState } from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        console.log("Here are all your calendars:");
        console.log({ calendars });
      }
    })();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const [selected, setSelected] = useState(today);

  const markedDates: any = {
    [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: "orange" },
  };

  return (
    <View style={styles.container}>
      <CalendarProvider date={selected}>
        <ExpandableCalendar
          initialPosition="open"
          onDayPress={(day) => setSelected(day.dateString)}
          markedDates={markedDates}
        />

      </CalendarProvider>

      <Text>Calendar Module Example</Text>
      <Button title="Create a new calendar" onPress={createCalendar} />
      <Button title="Delete Expo Calendars" onPress={deleteExpoCalendars} />
    </View>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function deleteExpoCalendars() {
  try {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    let deletedCount = 0;
    for (const calendar of calendars) {
      if (calendar.title === "Expo Calendar") {
        await Calendar.deleteCalendarAsync(calendar.id);
        console.log(`Deleted calendar with id: ${calendar.id}`);
        deletedCount++;
      }
    }
    console.log(`Deleted ${deletedCount} calendars.`);
  } catch (err) {
    console.error("deleteCalendars failed", err);
  }
}

async function createCalendar() {
  try {
    let source;
    if (Platform.OS === "ios") {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      source = defaultCalendar?.source ?? {
        name: "Expo Calendar",
        isLocalAccount: true,
      };
    } else {
      source = { isLocalAccount: true, name: "Expo Calendar" };
    }

    const calendarParams: any = {
      title: "Expo Calendar",
      color: "blue",
      entityType: Calendar.EntityTypes.EVENT,
      name: "internalCalendarName",
      source,
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER, // required
    };

    if (Platform.OS === "ios") {
      if (source && typeof (source as any).id !== "undefined") {
        calendarParams.sourceId = (source as any).id;
      }
      calendarParams.ownerAccount = "personal";
    }

    const newCalendarID = await Calendar.createCalendarAsync(calendarParams);
    console.log(`Your new calendar ID is: ${newCalendarID}`);
  } catch (err) {
    console.error("createCalendar failed", err);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
