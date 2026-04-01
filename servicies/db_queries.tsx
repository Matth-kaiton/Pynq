import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";

export async function getEmailByUsername(username: string) {
  try {
    const { data, error } = await supabase
      .from("profiles") // Replace with your profiles table name if different
      .select("email")  // Assumes you have an email column in profiles to reverse-lookup
      .eq("username", username)
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }
    
    return data[0].email;
  } catch (error) {
    console.error("Catch error getting email by username:", error);
    return null;
  }
}

export async function isUsernameTaken(username: string) {
  try {
    const { data, error } = await supabase
      .from("profiles") // Replace with your users or profiles table name
      .select("username")
      .eq("username", username)
      .limit(1);

    if (error) {
      console.error("Error checking username:", error);
      return true; // Assuming not taken if we can't verify, or true to be safe
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Catch error checking username:", error);
    return true;
  }
}

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

export async function getGroupInviteId(groupId: string) {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("invite_id")
      .eq("id", groupId)
      .single();

    if (error || !data) {
      console.error("Erreur getGroupInviteId:", error);
      return null;
    }

    return data.invite_id;
  } catch (error) {
    console.error("Erreur getGroupInviteId:", error);
    return null;
  }
}

export async function createGroup(name: string, description: string) {
  if (!name.trim()) {
    Alert.alert("Champ vide", "Le nom du groupe est requis");
    return { success: false, error: new Error("Le nom du groupe est requis") };
  }
  console.log(
    "createGroup called with name:",
    name,
    "description:",
    description,
  );

  try {
    const user = await getUser();

    const { data: createdGroup, error: insertError } = await supabase
      .from("groups")
      .insert([
        {
          name,
          description,
          members: [user.id],
          owner_id: user.id,
          admins: [user.id],
        },
      ])
      .select("id")
      .single();

    if (insertError || !createdGroup?.id)
      throw insertError ?? new Error("Création du groupe échouée");

    const normalizedName = name.trim().toLowerCase().replace(/\s+/g, "-");
    const inviteId = `${normalizedName}-${Math.floor(Math.random() * 10000)}`;

    const { error: updateError } = await supabase
      .from("groups")
      .update({
        invite_id: inviteId,
      })
      .eq("id", createdGroup.id);

    if (updateError) throw updateError;
    Alert.alert("Succès", "Groupe créé avec succès !");
    console.log(
      "Groupe créé avec ID:",
      createdGroup.id,
      "Invite ID:",
      inviteId,
    );
    return { success: true, id: createdGroup.id };
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

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("id")
    .eq("invite_id", inviteId)
    .single();

  if (groupError || !group) {
    Alert.alert("Erreur", "Groupe introuvable.");
    return {
      success: false,
      error: groupError ?? new Error("Groupe introuvable"),
    };
  }

  const userGroups = await getUserGroups();
  if (userGroups.some((g) => g.id === group.id)) {
    Alert.alert("Déjà membre", "Vous êtes déjà membre de ce groupe");
    return { success: false, error: new Error("Déjà membre") };
  }

  try {
    const { error } = await supabase.rpc("add_member_to_group", {
      inviteid: inviteId,
    });
    if (error) {
      Alert.alert("Erreur", "Impossible de rejoindre le groupe.");
      throw error;
    }
    Alert.alert("Succès", "Vous avez rejoint le groupe !");
    return { success: true, id: group.id };
  } catch (error) {
    Alert.alert("Erreur", "Impossible de rejoindre le groupe.");
    return { success: false, error };
  }
}

export async function registerEvent(
  title: string,
  description: string,
  start: Date,
  end: Date,
  groupId: string,
) {
  try {
    // 1. Récupérer les groupes
    const groups = await getUserGroups();

    if (!groups || groups.length === 0) {
      Alert.alert(
        "Aucun groupe",
        "Vous devez être membre d'un groupe pour créer un événement.",
      );
      return { success: false, error: new Error("Aucun groupe trouvé") };
    }

    // 2. Insertion
    const { error: insertError } = await supabase.from("events").insert([
      {
        title: title,
        description: description,
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        group_id: groupId,
      },
    ]);

    if (insertError) throw insertError;
    return { success: true };
  } catch (error) {
    Alert.alert("Erreur", "Impossible de sauvegarder l'événement.");
    return { success: false, error };
  }
}

export async function getRemoteEvents(groupId?: string) {
  try {
    const groups = await getUserGroups();
    let eventsGrp: any[] = [];

    if (!groups) return [];

    for (let index = 0; index < groups.length; index++) {
      if (!groups[index] || groups[index].id !== groupId) continue;
      const element = groups[index];
      const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .eq("group_id", element.id);

      if (error || !events) return [];

      eventsGrp.push(events);
    }

    eventsGrp = eventsGrp.flat();
    return eventsGrp.map((e) => ({
      ...e,
      title: e.title || "Sans titre",
      description: e.description || "Aucune description disponible.",
      start: new Date(e.start_date),
      end: new Date(e.end_date),
    }));
  } catch (error) {
    Alert.alert("Erreur", "Impossible de récupérer les événements.");
    return [];
  }
}

export async function leaveGroup(groupId?: string) {
  if (!groupId) {
    Alert.alert("Erreur", "Identifiant de groupe manquant.");
    return { success: false, error: new Error("Group ID manquant") };
  }

  try {
    const user = await getUser();

    const { error } = await supabase.rpc("remove_member_from_group", {
      group_id: groupId,
      user_id: user.id,
    });

    if (error) throw error;
    Alert.alert("Succès", "Vous avez quitté le groupe.");
    return { success: true };
  } catch (error) {
    console.log(error);
    Alert.alert("Erreur", "Impossible de quitter le groupe.");
    return { success: false, error };
  }
}
