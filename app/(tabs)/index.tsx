import "react-native-reanimated";

import { useAuth } from "@/components/AuthContext";
import GroupModal from "@/components/GroupModal";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ShowCalendar } from "@/servicies/big_calendar";
import { getGroupInviteId, getUserGroups, leaveGroup } from "@/servicies/db_queries";
import { styles } from "@/style/style";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export let setGroups: React.Dispatch<
  React.SetStateAction<
    {
      id: string;
      name: string;
    }[]
  >
>;

export let selectGroup: React.Dispatch<
  React.SetStateAction<{
    id: string;
    name: string;
  } | null>
>;

async function leave(id?: string) {
  Alert.alert("Confirmer", "Êtes-vous sûr de vouloir quitter ce groupe ?", [
    { text: "Annuler" },
    {
      text: "Quitter",
      onPress: async () => {
        await leaveGroup(id);
      },
    },
  ]);
  const groups = await getUserGroups();
  setGroups(groups);
  selectGroup(groups[0]);
}

export default function CalendarScreen() {
  const { user } = useAuth();
  const [groupsCalendar, setGroupsCalendar] = useState<
    { id: string; name: string }[]
  >([]);
  setGroups = setGroupsCalendar;

  const [selectedGroupCalendar, setSelectedGroupCalendar] = useState<{
    id: string;
    name: string;
  } | null>(null);
  selectGroup = setSelectedGroupCalendar;

  const [isModalVisibleCalendar, setIsModalVisibleCalendar] = useState(false);

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
            <><TouchableOpacity
              style={[
                styles.card,
                { justifyContent: "center", paddingHorizontal: 15 },
              ]}
              onPress={handleShareGroup}
            >
              <ThemedText style={{ fontSize: 20 }}>🔗</ThemedText>
            </TouchableOpacity><TouchableOpacity
              style={[
                styles.card,
                { justifyContent: "center", paddingHorizontal: 15 },
              ]}
              onPress={() => {
                leave(selectedGroupCalendar?.id);
              } }
            >
                <IconSymbol
                  size={28}
                  name="rectangle.portrait.and.arrow.right"
                  color="red" />
              </TouchableOpacity></>
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
    </View>
  );
}
