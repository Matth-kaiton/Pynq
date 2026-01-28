import { supabase } from "@/lib/supabase";
import * as Calendar from "expo-calendar";

/* list and user to find need to */
let calendarList: string[] = [""];
const user = "quentinreinette@gmail.com";
let userId: string;

/* fonction qui permet de récupéré les event du calendrier cibler */
export async function getEvent() {
  try {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT,
    );
    userId = await supabase.auth.getUser().then(({ data: { user } }) => {
      return user?.id || "";
    });
    console.log("User ID:", userId);
    for (const calendar of calendars) {
      /* vérification pour ajouter seulement le calandrier lier au mail de l'utilisateur mail qui nous intérèsse */
      if (calendar.ownerAccount == user) {
        calendarList.push(calendar.id);
      }
      console.log(calendar.name);
    }
  } catch (err) {
    console.error("Get calendar fail", err);
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const event = await Calendar.getEventsAsync(calendarList, startDate, endDate);
  console.log(`Here the event since ${startDate} to ${endDate}`);
  console.log(event);
}

export async function GetRemoteEvents() {
  let groups = (await supabase
    .from("groups")
    .select("id")
    .contains("members", [userId])
    .then(({ data, error }) => {
      console.log("TEST");
      if (error) {
        console.error("Error fetching groups:", error);
        return [];
      }
      return data;
    })) || [{ id: 0 }];

  console.log("Groups for user:", groups);

  let group = groups[0].id;
  console.log(group);
  let events = await supabase
    .from("events")
    .select("*")
    .eq("group_id", group)
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching events:", error);
        return [];
      }
      return data;
    });
  console.log("Events for user's group:", events);
  return events;
}
