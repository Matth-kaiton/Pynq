import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";

export default function CreateEvent() {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    Alert.alert("Soumission", `Le nom soumis est : ${text}`);
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
