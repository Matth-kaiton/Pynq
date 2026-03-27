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
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        Alert.alert("Success", "Check your email to confirm your account!");
      } else {
        await signIn(email, password);
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
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
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={[styles.label, { fontSize: 30 }]}>
        {isSignUp ? "Inscription" : "Connexion"}
      </ThemedText>

      <View style={[styles.card, { width: "100%", height: "25%" }]}>
        <TextInput
          style={[
            styles.input,
            { color: "#000", backgroundColor: "rgba(0,0,0,0)" },
          ]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[
            styles.input,
            { color: "#000", backgroundColor: "rgba(0,0,0,0)" },
          ]}
          placeholder="Mot de passe"
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
