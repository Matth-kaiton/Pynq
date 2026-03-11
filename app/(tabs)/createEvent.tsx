import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { registerEvent } from "@/servicies/db_queries"; // Import de la fonction Supabase
import { styles } from "@/style/style";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function CreateEvent() {
  const [text, setText] = useState("");

  // States pour les dates (initialisés vides)
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [startT, setStartT] = useState("");
  const [endT, setEndT] = useState("");
  const [startTM, setStartTM] = useState("");
  const [endTM, setEndTM] = useState("");

  const handleSubmit = async () => {
    // Vérification basique
    if (!text || !startYear || !startDay || !startMonth) {
      Alert.alert("Erreur", "Veuillez remplir les informations de début.");
      return;
    }

    // 1. Création des objets Date (Attention : mois - 1 en JS)
    const startDate = new Date(
      parseInt(startYear),
      parseInt(startMonth) - 1,
      parseInt(startDay),
      parseInt(startT) || 0,
      parseInt(startTM) || 0,
    );

    const endDate = new Date(
      parseInt(endYear) || parseInt(startYear),
      parseInt(endMonth) - 1 || parseInt(startMonth) - 1,
      parseInt(endDay) || parseInt(startDay),
      parseInt(endT) || 0,
      parseInt(endTM) || 0,
    );

    // 2. Envoi vers Supabase
    const result = await registerEvent(text, startDate, endDate);

    if (result?.success) {
      Alert.alert("Succès", "Événement enregistré dans le cloud !");
      router.replace("/(tabs)"); // Redirection vers le calendrier
    } else {
      Alert.alert("Erreur", "Impossible de sauvegarder l'événement.");
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
        </View>

        {/* SECTION DEBUT */}
        <View style={styles.card}>
          <ThemedText style={styles.label}>DÉBUT</ThemedText>
          <View style={styles.row}>
            <TextInput
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
            />
          </View>
          <View style={styles.row}>
            <TextInput
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
            />
          </View>
        </View>

        <View style={styles.card}>
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
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <ThemedText style={styles.title}>Enregistrer l'événement</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   scrollContainer: { paddingBottom: 40 },
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   mainTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 25,
//     marginTop: 20,
//     color: "#1a1a1a",
//   },
//   label: { fontSize: 14, color: "#666", marginBottom: 8, fontWeight: "600" },
//   inputGroup: { marginBottom: 20 },
//   inputFull: {
//     height: 50,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: "#eee",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#f0f0f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   cardTitle: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: "#666",
//     marginBottom: 15,
//     letterSpacing: 1,
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     marginBottom: 12,
//   },
//   input: {
//     flex: 1,
//     height: 45,
//     backgroundColor: "#f9f9f9",
//     borderRadius: 8,
//     textAlign: "center",
//     fontSize: 15,
//     borderWidth: 1,
//     borderColor: "#eee",
//   },
//   separator: { fontSize: 20, fontWeight: "bold", color: "#ccc" },
//   submitBtn: {
//     backgroundColor: "#000",
//     height: 55,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
// });
