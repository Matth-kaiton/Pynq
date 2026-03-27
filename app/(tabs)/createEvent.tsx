import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getUserGroups, registerEvent } from "@/servicies/db_queries"; // Import de la fonction Supabase
import { styles } from "@/style/style";
import base from "@/style/theme.json";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarClock } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CreateEventProps {
  initialDate: Date;
}

export function CreateEvent({
  initialDate,
  onSuccess,
}: CreateEventProps & { onSuccess: () => void }) {
  const [text, setText] = useState("");
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
  const [endDate, setEndDate] = useState(new Date(initialDate));
  const [isEndDate, setIsEndDate] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  useEffect(() => {
    async function fetchGroups() {
      const userGroups = await getUserGroups();
      setGroups(userGroups);
      if (userGroups.length > 0) {
        setSelectedGroup(userGroups[0]); // Default to first group
      }
    }
    fetchGroups();
  }, []);

  const handleSubmit = async () => {
    if (!text || !selectedGroup) {
      Alert.alert("Erreur", "Veuillez remplir les informations de début.");
      return;
    }

    let finalStart = new Date(selectedDate);
    let finalEnd = new Date(endDate);

    if (allDay) {
      finalStart.setHours(0, 0, 0, 0);
      finalEnd.setHours(23, 59, 59, 999);
    }

    const result = await registerEvent(
      text,
      finalStart,
      finalEnd,
      selectedGroup.id,
    );

    if (result?.success) {
      Alert.alert("Succès", "Événement enregistré dans le cloud !");
      onSuccess();
    } else {
      Alert.alert("Erreur", "Impossible de sauvegarder l'événement.");
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    // Si l'utilisateur a cliqué sur "Annuler"
    if (event.type === "dismissed") {
      setShow(false);
      setMode("date"); // On reset pour la prochaine fois
      return;
    }

    if (selectedDate) {
      const currentDate = selectedDate;

      if (isEndDate) {
        setEndDate(currentDate);
        reversecheckDate(currentDate);
        setShow(false);
        setMode("date");
        console.log("Date et Heure finales :", currentDate);
      } else if (mode === "date") {
        setSelectedDate(currentDate);
        checkDate(currentDate);
        setMode("time");
        setShow(true);
      } else {
        setSelectedDate(currentDate);
        checkDate(currentDate);
        setShow(false);
        setMode("date");
        console.log("Date et Heure finales :", currentDate);
      }
    }

    setIsEndDate(false);
  };

  const checkDate = (newStart: Date) => {
    if (newStart > endDate) {
      setEndDate(newStart);
    }
  };
  const reversecheckDate = (newEnd: Date) => {
    if (newEnd < selectedDate) {
      setSelectedDate(newEnd);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#fff" }}
      contentContainerStyle={styles.scrollContainer}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Nouvel Événement
        </ThemedText>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Titre</ThemedText>

          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Réunion, Sport, Sortie..."
          />
          {show && (
            <DateTimePicker
              value={selectedDate}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View>

        {/* SECTION DEBUT */}
        <View style={styles.card}>
          <ThemedText style={styles.label}>DÉBUT</ThemedText>
          <View style={styles.row}>
            <ThemedText style={styles.label}>
              {allDay
                ? selectedDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })
                : selectedDate.toLocaleTimeString([], {
                    weekday: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </ThemedText>
            <Pressable style={styles.button} onPress={() => setShow(true)}>
              <CalendarClock color={base.colors.text} />
            </Pressable>
          </View>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Toute la journée</ThemedText>
            <Switch
              trackColor={{ false: "#767577", true: base.colors.primary }} // Couleur quand c'est ON
              thumbColor={allDay ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setAllDay((previousState) => !previousState);
                setEndDate(selectedDate);
              }}
              value={allDay}
            />
            {!allDay && (
              <View>
                <ThemedText style={styles.label}>
                  {endDate.toLocaleTimeString([], {
                    weekday: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </ThemedText>
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    setIsEndDate(true);
                    setMode("time");
                    setShow(true);
                  }}
                >
                  <CalendarClock color={base.colors.text} />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Groupe de destination</ThemedText>
          <TouchableOpacity
            style={[
              styles.input,
              { justifyContent: "center", paddingHorizontal: 15 },
            ]}
            onPress={() => setIsModalVisible(true)}
          >
            <ThemedText style={{ color: selectedGroup ? "#000" : "#ffffff" }}>
              {selectedGroup ? `📍 ${selectedGroup.name}` : "Choisir un groupe"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* SIMPLE MODAL FOR GROUP SELECTION */}
        <Modal
          visible={isModalVisible}
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
                data={groups}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      paddingVertical: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#ffffff",
                    }}
                    onPress={() => {
                      setSelectedGroup(item);
                      setIsModalVisible(false);
                    }}
                  >
                    <ThemedText>{item.name}</ThemedText>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={{ marginTop: 15, alignItems: "center" }}
              >
                <ThemedText style={{ color: "red" }}>Annuler</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <ThemedText style={styles.title}>Enregistrer l'événement</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}
