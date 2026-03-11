import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#800020" />
    </View>
  );
}
