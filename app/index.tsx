import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import SplashScreen from "./splashScreen"; // Importa la pantalla de Splash

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      router.push("/welcome"); // Redirige a la pantalla de bienvenida
    }, 3000); // 3 segundos de espera
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
