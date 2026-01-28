import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-big-calendar";

export let event = [
  {
    title: "Meeting",
    start: new Date(2025, 11, 2, 10, 0),
    end: new Date(2025, 11, 2, 10, 30),
  },
  {
    title: "Test",
    start: new Date(2026, 0, 28, 10, 0),
    end: new Date(2026, 0, 28, 11, 30),
  },
];

export async function createEvent() {
  event.push({
    title: "Nouveau Test " + new Date().getSeconds(),
    start: new Date(2026, 0, 28, 9, 0),
    end: new Date(2026, 0, 28, 10, 30),
  });
  console.log("Événement ajouté dans le tableau");
}

export function ShowCalendar() {
  const [calendarEvent, setCalendarData] = useState(event);

  function handleRefresh() {
    createEvent();
    setCalendarData([...event]);
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
      {/* <Button title="Create Event" onPress={handleRefresh} /> */}
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
