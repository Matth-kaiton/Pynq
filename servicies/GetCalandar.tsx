import { supabase } from "@/lib/supabase";

let calendarList: string[] = []; // Initialisé vide
const user = "quentinreinette@gmail.com";

export async function GetRemoteEvents() {
  // 1. Récupérer l'ID de l'utilisateur actuel (Essentiel)
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const userId = authUser?.id;

  if (!userId) return [];

  // 2. Trouver le groupe
  let { data: groups } = await supabase
    .from("groups")
    .select("id")
    .contains("members", [userId]);

  if (!groups || groups.length === 0) return [];
  let group = groups[0].id;

  // 3. Récupérer les événements
  let { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("group_id", group);

  if (error || !events) return [];

  // 4. MERGE : Convertir pour react-native-big-calendar (Indispensable)
  return events.map((e) => ({
    ...e,
    start: new Date(e.start_date),
    end: new Date(e.end_date),
  }));
}
