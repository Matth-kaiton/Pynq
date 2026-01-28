import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { GetRemoteEvents } from "./GetCalandar";

export async function registerEvent() {
  // created_by: int8,
  // group_id: int8,
  // created_by: uuid,
  // members: uuid[],
  // type: text(max 20),
  // description: text(max 200),
  // place: text(max 20),
  // start_date: timestampz(with time zone),
  // end_date: timestampz (with time zone),
  // title: text(max 50),
  const { error } = await supabase.from("events").insert({
    title: "Test Event",
    start_date: new Date(2026, 0, 28, 9, 0).toISOString(),
    end_date: new Date(2026, 0, 28, 10, 30).toISOString(),
  });
  console.log(error);
}

export function ShowCalendar() {
  const [calendarEvent, setCalendarData] = useState<any[]>([]);

  useEffect(() => {
    // Load remote events when component mounts
    GetRemoteEvents().then((events) => {
      setCalendarData(events);
    });
  }, []);

  async function handleRefresh() {
    // Create new local event
    const newEvent = {
      title: "Nouveau Test " + new Date().getSeconds(),
      start: new Date(2026, 0, 28, 9, 0),
      end: new Date(2026, 0, 28, 10, 30),
    };

    // Register event to database
    await registerEvent();

    // Refresh events from remote
    const updatedEvents = await GetRemoteEvents();
    setCalendarData(updatedEvents);
    console.log("Événements mis à jour");
  }

  return (
    <View style={styles.container}>
      <Calendar
        events={calendarEvent}
        height={600}
        mode="3days"
        swipeEnabled={true}
        onPressEvent={(e) => console.log(e)}
      />
      <Button title="Create Event" onPress={handleRefresh} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 50,
  },
});
