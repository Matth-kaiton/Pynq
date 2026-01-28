import { StyleSheet } from "react-native";
import base from "./theme.json";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: base.colors.backgroundDark,
  },
  title: {
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: base.colors.primaryContainer,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: base.colors.primary,
  },
  button: {
    backgroundColor: base.colors.secondaryContainer,
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
    alignItems: "center",
  },
});
