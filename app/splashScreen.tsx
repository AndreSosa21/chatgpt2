import { View, Image, ActivityIndicator } from "react-native";
import React from "react";

export default function SplashScreen() {
  // Main view of the splash screen
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#353540",
      }}
    >
      <Image
        source={require("../assets/images/chatgpt.png")}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
    </View>
  );
}
