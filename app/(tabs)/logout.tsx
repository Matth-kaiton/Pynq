import { useAuth } from "@/components/AuthContext"; // Importe ton hook ici
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function LogoutScreen() {
  const { signOut } = useAuth(); // Récupère la fonction signOut du contexte
  const router = useRouter();

  useEffect(() => {
    signOut();
    router.replace("/login");
  });

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#800020" />
    </View>
  );
}
