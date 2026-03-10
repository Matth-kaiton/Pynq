import "react-native-reanimated";

import { useAuth } from "@/components/AuthContext";
import { ShowCalendar } from "@/servicies/big_calendar";
import * as Calendar from "expo-calendar";
import { router } from "expo-router";
import { useEffect } from "react";
import { Platform, Text, View, Pressable } from "react-native";
import { styles } from "@/style/style";

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function deleteExpoCalendars() {
  try {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT,
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

export default function CalendarScreen() {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User signed out");
      router.replace("../login");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
        console.log("Here are all event:");
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.calendar, { flex: 1 }]}>
        <ShowCalendar />
      </View>
      <Text style={styles.label}>
        User: {user ? user.email : "No user signed in"}
      </Text>
      <Pressable style={styles.button} onPress={() => handleSignOut()}>
        <Text style={styles.title}>Sign out</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => createCalendar()}>
        <Text style={styles.title}>Create a new calendar</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => deleteExpoCalendars()}>
        <Text style={styles.title}>Delete Expo Calendars</Text>
      </Pressable>
    </View>
  );
}
