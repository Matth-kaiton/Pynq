import { useAuth } from "@/components/AuthContext";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { styles } from "@/style/style";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInAsGuest } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (isSignUp) {
      if (password.length < 8) {
        Alert.alert(
          "Mot de passe faible",
          "Le mot de passe doit contenir au moins 8 caractères.",
        );
        return;
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        Alert.alert(
          "Mot de passe faible",
          "Le mot de passe doit contenir au moins une lettre majuscule.",
        );
        return;
      }
      if (!/(?=.*[a-z])/.test(password)) {
        Alert.alert(
          "Mot de passe faible",
          "Le mot de passe doit contenir au moins une lettre minuscule.",
        );
        return;
      }
      if (!/(?=.*\d)/.test(password)) {
        Alert.alert(
          "Mot de passe faible",
          "Le mot de passe doit contenir au moins un chiffre.",
        );
        return;
      }
      if (!/(?=.*[\W_])/.test(password)) {
        Alert.alert(
          "Mot de passe faible",
          "Le mot de passe doit contenir au moins un caractère spécial.",
        );
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        Alert.alert(
          "Succès",
          "Vérifiez votre email pour confirmer votre compte!",
        );
      } else {
        await signIn(email, password);
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      await signInAsGuest();
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={[styles.label, { fontSize: 30 }]}>
        {isSignUp ? "Inscription" : "Connexion"}
      </ThemedText>

      <View style={[styles.card, { width: "100%", height: "31%" }]}>
        <Text style={{ color: "#000", fontWeight: "normal", fontSize: 20 }}>
          Email
        </Text>
        <TextInput
          style={[
            styles.input,
            { color: "#000", backgroundColor: "rgba(0,0,0,0)" },
          ]}
          placeholder="email@exemple.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={{ color: "#000", fontWeight: "normal", fontSize: 20 }}>
          Mot de passe
        </Text>
        <TextInput
          style={[
            styles.input,
            { color: "#000", backgroundColor: "rgba(0,0,0,0)" },
          ]}
          placeholder="MotDePasse@123"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Pressable style={styles.button} onPress={handleAuth} disabled={loading}>
        <Text style={styles.title}>
          {loading ? "Chargement..." : isSignUp ? "Inscription" : "Connexion"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.title}>
          {isSignUp
            ? "Déjà un compte ? Se connecter"
            : "Pas de compte ? S'inscrire"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleGuest}>
        <Text style={styles.title}>Continuer en tant qu&apos;invité</Text>
      </Pressable>
    </ThemedView>
  );
}
