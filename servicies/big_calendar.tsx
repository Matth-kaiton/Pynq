import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-big-calendar";

export let event = [
  {
    title: "",
    start: new Date(),
    end: new Date(),
  },
];

export function ShowCalendar() {
  const [calendarEvent, setCalendarData] = useState(event);

  useFocusEffect(
    useCallback(() => {
      setCalendarData([...event]);
    }, []),
  );
  return (
    <View style={styles.container}>
      <Calendar
        events={calendarEvent}
        height={600}
        mode="3days"
        swipeEnabled={true}
        onPressEvent={(e) => console.log(e)}
      />
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
