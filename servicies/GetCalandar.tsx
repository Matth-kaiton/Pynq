import { supabase } from "@/lib/supabase";

// Fonction pour ENREGISTRER un événement dans Supabase
export async function registerEvent(title: string, start: Date, end: Date) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non authentifié");

    // 1. Récupérer le groupe de l'utilisateur
    const { data: groups, error: groupError } = await supabase
      .from("groups")
      .select("id")
      .contains("members", [user.id]);

    if (groupError || !groups || groups.length === 0) {
      throw new Error("Aucun groupe trouvé pour cet utilisateur");
    }

    // 2. Insertion dans la table 'events'
    const { error: insertError } = await supabase.from("events").insert([
      {
        title: title,
        start_date: start.toISOString(), // Format ISO pour la DB
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

// Fonction pour RÉCUPÉRER les événements de Supabase
export async function getRemoteEvents() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    // 1. Trouver le groupe
    const { data: groups } = await supabase
      .from("groups")
      .select("id")
      .contains("members", [user.id]);

    if (!groups?.[0]) return [];

    // 2. Récupérer les événements liés au groupe
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("group_id", groups[0].id);

    if (error || !events) return [];

    // 3. Transformation des strings ISO en objets Date pour le calendrier
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
