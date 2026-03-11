import "react-native-reanimated";

import { useAuth } from "@/components/AuthContext";
import GroupModal from "@/components/GroupModal";
import { ThemedText } from "@/components/themed-text";
import { ShowCalendar } from "@/servicies/big_calendar";
import { getGroupInviteId, getUserGroups } from "@/servicies/db_queries";
import { styles } from "@/style/style";
import * as Calendar from "expo-calendar";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function deleteExpoCalendars() {
  try {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT,
    );
    let deletedCount = 0;
    for (const calendar of calendars) {
      if (calendar.title === "Expo Calendar") {
        await Calendar.deleteCalendarAsync(calendar.id);
        console.log(`Deleted calendar with id: ${calendar.id}`);
        deletedCount++;
      }
    }
    console.log(`Deleted ${deletedCount} calendars.`);
  } catch (err) {
    console.error("deleteCalendars failed", err);
  }
}

async function createCalendar() {
  try {
    let source;
    if (Platform.OS === "ios") {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      source = defaultCalendar?.source ?? {
        name: "Expo Calendar",
        isLocalAccount: true,
      };
    } else {
      source = { isLocalAccount: true, name: "Expo Calendar" };
    }

    const calendarParams: any = {
      title: "Expo Calendar",
      color: "blue",
      entityType: Calendar.EntityTypes.EVENT,
      name: "internalCalendarName",
      source,
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER, // required
    };

    if (Platform.OS === "ios") {
      if (source && typeof (source as any).id !== "undefined") {
        calendarParams.sourceId = (source as any).id;
      }
      calendarParams.ownerAccount = "personal";
    }

    const newCalendarID = await Calendar.createCalendarAsync(calendarParams);
    console.log(`Your new calendar ID is: ${newCalendarID}`);
  } catch (err) {
    console.error("createCalendar failed", err);
  }
}

export default function CalendarScreen() {
  const { signOut, user } = useAuth();
  const [groupsCalendar, setGroupsCalendar] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedGroupCalendar, setSelectedGroupCalendar] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isModalVisibleCalendar, setIsModalVisibleCalendar] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User signed out");
      router.replace("../login");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  const handleShareGroup = async () => {
    if (!selectedGroupCalendar) {
      Alert.alert("Erreur", "Aucun groupe sélectionné");
      return;
    }

    try {
      const inviteId = await getGroupInviteId(selectedGroupCalendar.id);
      if (!inviteId) {
        Alert.alert("Erreur", "Impossible de récupérer le code d'invitation");
        return;
      }

      await Share.share({
        message: `Rejoins mon groupe "${selectedGroupCalendar.name}" sur Pynq avec le code: ${inviteId}`,
        title: `Invitation - ${selectedGroupCalendar.name}`,
      });
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };

  useEffect(() => {
    async function fetchGroups() {
      const userGroups = await getUserGroups();
      setGroupsCalendar(userGroups);
      if (userGroups.length > 0) {
        console.log(userGroups[0]);
        setSelectedGroupCalendar(userGroups[0]); // Default to first group
      }
    }
    fetchGroups();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.calendar, { flex: 1 }]}>
        <ShowCalendar selectedGroupId={selectedGroupCalendar?.id} />
      </View>
      <Text style={styles.label}>
        User: {user ? user.email : "No user signed in"}
      </Text>
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Groupe de destination</ThemedText>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[
              styles.card,
              { flex: 1, justifyContent: "center", paddingHorizontal: 15 },
            ]}
            onPress={() => setIsModalVisibleCalendar(true)}
          >
            <ThemedText
              style={{ color: selectedGroupCalendar ? "#000" : "#ffffff" }}
            >
              {selectedGroupCalendar
                ? `📍 ${selectedGroupCalendar.name}`
                : "Choisir un groupe"}
            </ThemedText>
          </TouchableOpacity>
          {selectedGroupCalendar && (
            <TouchableOpacity
              style={[
                styles.card,
                { justifyContent: "center", paddingHorizontal: 15 },
              ]}
              onPress={handleShareGroup}
            >
              <ThemedText style={{ fontSize: 20 }}>🔗</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* SIMPLE MODAL FOR GROUP SELECTION */}
      <Modal
        visible={isModalVisibleCalendar}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "50%",
            }}
          >
            <ThemedText
              style={[styles.label, { fontSize: 18, marginBottom: 15 }]}
            >
              Sélectionner un groupe
            </ThemedText>
            <FlatList
              data={groupsCalendar}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#ffffff",
                  }}
                  onPress={() => {
                    setSelectedGroupCalendar(item);
                    setIsModalVisibleCalendar(false);
                  }}
                >
                  <ThemedText style={{ color: "#000" }}>{item.name}</ThemedText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setIsModalVisibleCalendar(false)}
              style={{ marginTop: 15, alignItems: "center" }}
            >
              <ThemedText style={{ color: "red" }}>Annuler</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <GroupModal />
      {/*
      <Pressable style={styles.button} onPress={() => createCalendar()}>
        <Text style={styles.title}>Create a new calendar</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => deleteExpoCalendars()}>
        <Text style={styles.title}>Delete Expo Calendars</Text>
      </Pressable> */}
    </View>
  );
}
