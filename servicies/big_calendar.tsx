import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { getRemoteEvents } from "./GetCalandar";

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
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        setLoading(true);
        const data = await getRemoteEvents();
        if (isActive) {
          setCalendarEvents(data);
          setLoading(false);
        }
      };

      loadData();
      return () => {
        isActive = false;
      };
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        events={calendarEvents}
        height={600}
        mode="3days"
        swipeEnabled={true}
        onPressEvent={(e) => console.log("Event:", e)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});
