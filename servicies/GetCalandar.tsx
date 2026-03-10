import { supabase } from "@/lib/supabase";

export async function getUserGroups() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: groups, error } = await supabase
      .from("groups")
      .select("id, name, description")
      .contains("members", [user.id]);

    if (error || !groups) return [];
    return groups;
  } catch (error) {
    console.error("Erreur getUserGroups:", error);
    return [];
  }
}

export async function registerEvent(title: string, start: Date, end: Date) {
  try {

    // 1. Récupérer les groupes
    const groups = await getUserGroups();

    if (/*groupError ||*/ !groups || groups.length === 0) {
      throw new Error("Aucun groupe trouvé");
    }

    // 2. Insertion
    const { error: insertError } = await supabase.from("events").insert([
      {
        title: title,
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        group_id: groups[0].id,
      },
    ]);

    if (insertError) throw insertError;
    return { success: true };
  } catch (error) {
    console.error("Erreur registerEvent:", error);
    return { success: false, error };
  }
}

export async function getRemoteEvents() {
  try {
    const groups = await getUserGroups();

    if (!groups?.[0]) return [];

    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("group_id", groups[0].id);

    if (error || !events) return [];

    return events.map((e) => ({
      ...e,
      title: e.title || "Sans titre",
      start: new Date(e.start_date),
      end: new Date(e.end_date),
    }));
  } catch (error) {
    console.error("Erreur getRemoteEvents:", error);
    return [];
  }
}
