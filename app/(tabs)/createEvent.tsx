import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { event } from "@/servicies/big_calendar";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";

export default function CreateEvent() {
  const [text, setText] = useState(String);
  const [year, setYear] = useState(Number);
  const [month, setMonth] = useState(Number);
  const [day, setDay] = useState(Number);
  const [startT, setStartT] = useState(Number);
  const [startTM, setStartTM] = useState(Number);
  const [endT, setEndT] = useState(Number);
  const [endTM, setEndTM] = useState(Number);

  async function createEvent() {
    event.push({
      title: text,
      start: new Date(year, month - 1, day, startT, startTM),
      end: new Date(year, month - 1, day, endT, endTM),
    });
    console.log(year, month, day, startT, startTM, endT, endTM);
    console.log("Événement ajouté dans le tableau");
  }

  const handleSubmit = () => {
    Alert.alert("Soumission", `Le nom soumis est : ${text}`);
    createEvent();
    router.replace("/(tabs)");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold">Nom de l'événement :</ThemedText>

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Entrez un nom d'évènement..."
      />

      <TextInput
        style={styles.input}
        value={year}
        onChangeText={setYear}
        placeholder="Entrez une année..."
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={month}
        onChangeText={setMonth}
        placeholder="Entrez un mois..."
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={day}
        onChangeText={setDay}
        placeholder="Entrez une journée..."
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={startT}
        onChangeText={setStartT}
        placeholder="Entrez une heure de départ..."
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={startTM}
        onChangeText={setStartTM}
        placeholder="Entrez les minutes de départ..."
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={endT}
        onChangeText={setEndT}
        placeholder="Entrez une heure de fin..."
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={endTM}
        onChangeText={setEndTM}
        placeholder="Entrez les minutes de fin..."
        keyboardType="numeric"
      />

      <Button title="Submit" onPress={handleSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 15,
    color: "#000",
    backgroundColor: "#fff",
  },
});
