import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { registerEvent } from "@/servicies/GetCalandar"; // Import de la fonction Supabase
import { styles } from "@/style/style";
import base from "@/style/theme.json";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarClock } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
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

  // States pour les dates (initialisés vides)
  // const [startYear, setStartYear] = useState("");
  // const [endYear, setEndYear] = useState("");
  // const [startMonth, setStartMonth] = useState("");
  // const [endMonth, setEndMonth] = useState("");
  // const [startDay, setStartDay] = useState("");
  // const [endDay, setEndDay] = useState("");
  // const [startT, setStartT] = useState("");
  // const [endT, setEndT] = useState("");
  // const [startTM, setStartTM] = useState("");
  // const [endTM, setEndTM] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
  const [endDate, setEndDate] = useState(new Date(initialDate));
  const [isEndDate, setIsEndDate] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const handleSubmit = async () => {
    //old
    // Vérification basique
    // if (!text || !startYear || !startDay || !startMonth) {
    //   Alert.alert("Erreur", "Veuillez remplir les informations de début.");
    //   return;
    // }

    // // 1. Création des objets Date (Attention : mois - 1 en JS)
    // const startDate = new Date(
    //   parseInt(startYear),
    //   parseInt(startMonth) - 1,
    //   parseInt(startDay),
    //   parseInt(startT) || 0,
    //   parseInt(startTM) || 0,
    // );

    // const endDate = new Date(
    //   parseInt(endYear) || parseInt(startYear),
    //   parseInt(endMonth) - 1 || parseInt(startMonth) - 1,
    //   parseInt(endDay) || parseInt(startDay),
    //   parseInt(endT) || 0,
    //   parseInt(endTM) || 0,
    // );

    // 2. Envoi vers Supabase

    let finalStart = new Date(selectedDate);
    let finalEnd = new Date(endDate);

    if (allDay) {
      finalStart.setHours(0, 0, 0, 0);
      finalEnd.setHours(23, 59, 59, 999);
    }

    const result = await registerEvent(text, finalStart, finalEnd);

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
            {/* <TextInput
              style={[styles.input, { flex: 1.5 }]}
              placeholder="JJ"
              keyboardType="numeric"
              onChangeText={setStartDay}
            />
            <TextInput
              style={[styles.input, { flex: 1.5 }]}
              placeholder="MM"
              keyboardType="numeric"
              onChangeText={setStartMonth}
            />
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="AAAA"
              keyboardType="numeric"
              onChangeText={setStartYear}
            /> */}
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
            {/* <TextInput
              style={styles.input}
              placeholder="HH"
              keyboardType="numeric"
              onChangeText={setStartT}
            />
            <ThemedText style={styles.separator}>:</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="mm"
              keyboardType="numeric"
              onChangeText={setStartTM}
            /> */}
          </View>
        </View>

        {/* <View style={styles.card}>
          <ThemedText style={styles.label}>FIN</ThemedText>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1.5 }]}
              placeholder="JJ"
              keyboardType="numeric"
              onChangeText={setEndDay}
            />
            <TextInput
              style={[styles.input, { flex: 1.5 }]}
              placeholder="MM"
              keyboardType="numeric"
              onChangeText={setEndMonth}
            />
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="AAAA"
              keyboardType="numeric"
              onChangeText={setEndYear}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="HH"
              keyboardType="numeric"
              onChangeText={setEndT}
            />
            <ThemedText style={styles.separator}>:</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="mm"
              keyboardType="numeric"
              onChangeText={setEndTM}
            />
          </View>
        </View> */}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <ThemedText style={styles.title}>Enregistrer l'événement</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}
