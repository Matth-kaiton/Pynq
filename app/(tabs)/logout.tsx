import { useAuth } from "@/components/AuthContext";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function LogoutScreen() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, [signOut]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#800020" />
    </View>
  );
}
