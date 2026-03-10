import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { event } from "@/servicies/big_calendar";
import { styles } from "@/style/style";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateEvent() {
  const [text, setText] = useState(String);

  const [startYear, setStartYear] = useState(Number);
  const [endYear, setEndYear] = useState(Number);

  const [startMonth, setStartMonth] = useState(Number);
  const [endMonth, setEndMonth] = useState(Number);

  const [startDay, setStartDay] = useState(Number);
  const [endDay, setEndDay] = useState(Number);

  const [startT, setStartT] = useState(Number);
  const [endT, setEndT] = useState(Number);

  const [startTM, setStartTM] = useState(Number);
  const [endTM, setEndTM] = useState(Number);

  async function createEvent() {
    event.push({
      title: text,
      start: new Date(startYear, startMonth - 1, startDay, startT, startTM),
      end: new Date(endYear, endMonth - 1, endDay, endT, endTM),
    });
    console.log(
      startYear,
      endYear,
      startMonth,
      endMonth,
      startDay,
      endDay,
      startT,
      startTM,
      endT,
      endTM,
    );
    console.log("Événement ajouté dans le tableau");
  }

  const handleSubmit = () => {
    Alert.alert("Soumission", `Le nom soumis est : ${text}`);
    createEvent();
    router.replace("/(tabs)");
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
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.label}>DÉBUT</ThemedText>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1.5 }]}
              placeholder="JJ"
              keyboardType="numeric"
              maxLength={2}
              onChangeText={setStartDay}
            />
            <TextInput
              style={[styles.input, { flex: 1.5 }]}
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              onChangeText={setStartMonth}
            />
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="AAAA"
              keyboardType="numeric"
              maxLength={4}
              onChangeText={setStartYear}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Heure"
              keyboardType="numeric"
              maxLength={2}
              onChangeText={setStartT}
            />
            <ThemedText style={styles.separator}>:</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Min"
              keyboardType="numeric"
              maxLength={2}
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
              maxLength={2}
              onChangeText={setEndDay}
            />
            <TextInput
              style={[styles.input, { flex: 1.5 }]}
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              onChangeText={setEndMonth}
            />
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="AAAA"
              keyboardType="numeric"
              maxLength={4}
              onChangeText={setEndYear}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Heure"
              keyboardType="numeric"
              maxLength={2}
              onChangeText={setEndT}
            />
            <ThemedText style={styles.separator}>:</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Min"
              keyboardType="numeric"
              maxLength={2}
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
