import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import { DataProvider } from "@/context/dataContext";
import { ThemeProvider } from "@/context/themeContext";



export default function RootLayout() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <DataProvider>
      <Stack screenOptions={{ contentStyle: { backgroundColor: '#353540' } }}>
      <Stack.Screen name="index" options={{ title: "chatgpt",headerShown: false}}/> 
      <Stack.Screen name="splashScreen" options={{ title: "Splash screen",headerShown: false}}/>
      <Stack.Screen name="welcome" options={{ title: "Welcome", headerShown : false}}/>
      <Stack.Screen name="welcome2" options={{ title: "welcome2", headerShown : false}}/>
      <Stack.Screen name="welcome3" options={{ title: "welcome3", headerShown : false}}/>
      <Stack.Screen name="chat" options={{ title: "chat", headerShown : false}}/>
      <Stack.Screen name="dashboard" options={{ title: "dashboard", headerShown : false}}/>
      <Stack.Screen name="login" options={{ title: "login", headerShown : false}}/>
      <Stack.Screen name="signUp" options={{ title: "login", headerShown : false}}/>
      </Stack>
    </DataProvider>
    </AuthProvider>
    </ThemeProvider>
  )
  
}
