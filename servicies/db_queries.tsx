import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Utilisateur non authentifié");
  return user;
}

export async function getUserGroups() {
  try {
    const user = await getUser();

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

export async function createGroup(name: string, description: string) {
  if (!name.trim()) {
    Alert.alert("Champ vide", "Le nom du groupe est requis");
    return { success: false, error: new Error("Le nom du groupe est requis") };
  }

  try {
    const user = await getUser();
    const inviteId = name + "-" + Math.round(Math.random() * 1000);

    const { error: insertError } = await supabase
      .from("groups")
      .insert([
        {
          name,
          description,
          members: [user.id],
          owner_id: user.id,
          admins: [user.id],
          invite_id: inviteId,
        },
      ])

    if (insertError) throw insertError;

    return { success: true };
  } catch (error) {
    Alert.alert("Erreur", "Impossible de créer le groupe.");
    return { success: false, error };
  }
}

export async function joinGroup(inviteId: string) {
  if (!inviteId.trim()) {
    Alert.alert("Champ vide", "Le code d'invitation est requis");
    return { success: false, error: new Error("Invite ID est requis") };
  }
  console.log("joinGroup called with inviteId:", inviteId);

  const user = await getUser();
  
  const groupId = await supabase
  .from("groups")
  .select("id")
  .eq("invite_id", inviteId)
  .single();
  
  (await getUserGroups()).forEach((g) => {
    if (g.id === groupId.data?.id) {
      Alert.alert("Déjà membre", "Vous êtes déjà membre de ce groupe");
      return { success: false, error: new Error("Déjà membre") };
    }
  });
  
  try {
    const { error } = await supabase.rpc("add_member_to_group", {
      inviteid: inviteId,
      userid: user.id,
    });
    if (error) {
      Alert.alert("Erreur", "Impossible de rejoindre le groupe.");
      throw error;
    }
    return { success: true };
  } catch (error) {
    Alert.alert("Erreur", "Impossible de rejoindre le groupe.");
    return { success: false, error };
  }
}

export async function registerEvent(title: string, start: Date, end: Date) {
  try {
    // 1. Récupérer les groupes
    const groups = await getUserGroups();

    if (!groups || groups.length === 0) {
      Alert.alert("Aucun groupe", "Vous devez être membre d'un groupe pour créer un événement.");
      return { success: false, error: new Error("Aucun groupe trouvé") };
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
    Alert.alert("Erreur", "Impossible de sauvegarder l'événement.");
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
    Alert.alert("Erreur", "Impossible de récupérer les événements.");
    return [];
  }
}
