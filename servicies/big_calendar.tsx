import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { GetRemoteEvents } from "./GetCalandar";

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

  const { error } = await supabase.from("events").insert({
    title: "Test Event",
    start_date: new Date(2026, 0, 28, 9, 0).toISOString(),
    end_date: new Date(2026, 0, 28, 10, 30).toISOString(),
    created_by: user.id, // Ajouté pour la DB
    group_id: groups[0].id, // Ajouté pour la DB
  });
  if (error) console.error(error);
}

export function ShowCalendar() {
  const [calendarEvent, setCalendarData] = useState<any[]>([]);

  const fetchEvents = async () => {
    const events = await GetRemoteEvents();
    setCalendarData(events);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  async function handleRefresh() {
    // 1. Enregistrer en DB
    await registerEvent();
    // 2. Rafraîchir l'affichage (Merge la nouvelle donnée)
    await fetchEvents();
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
