import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import SplashScreen from "./splashScreen";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useEffect hook to set loading to false after 3 seconds
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      router.push("/welcome"); 
    }, 3000);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
