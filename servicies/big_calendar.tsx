import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { GetRemoteEvents } from "./GetCalandar";

export let event = [
  {
    title: "",
    start: new Date(),
    end: new Date(),
  },
];

export async function registerEvent() {
  // 1. Récupérer l'ID et le groupe pour l'insertion (Minimum requis)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: groups } = await supabase
    .from("groups")
    .select("id")
    .contains("members", [user?.id]);

  if (!user || !groups?.[0]) return;
}

export function ShowCalendar() {
  const [calendarEvent, setCalendarData] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      registerEvent();
      const events = GetRemoteEvents();
      setCalendarData([...events]);
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
