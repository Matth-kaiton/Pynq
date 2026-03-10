import { supabase } from "@/lib/supabase";

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
  try {
    const user = await getUser();

    const { data, error } = await supabase.from("groups").insert([
      {
        name,
        description,
        members: [user.id],
        owner_id: user.id,
        admins: [user.id]
      },
    ]).select("id");

    const inviteId = name + data?.[0]?.id;
    const { error } = await supabase.from("groups").update({
      invite_id: inviteId,
    }).eq("id", data?.[0]?.id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Erreur createGroup:", error);
    return { success: false, error };
  }
}

export async function joinGroup(groupId: number) {
  try {
    const user = await getUser();

    const { error: insertError } = await supabase.from("groups").update({
      members: supabase.rpc('array_append', {arr: "members", value: user.id}),
    }).eq("id", groupId);
    if (insertError) throw insertError;
    return { success: true };
  } catch (error) {
    console.error("Erreur joinGroup:", error);
    return { success: false, error };
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
