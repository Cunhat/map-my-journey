import { View, Text, SafeAreaView } from "react-native";
import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
        <Stack.Screen
          name="trip/[tripId]/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="trip/[tripId]/createCategory"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen name="(auth)/signIn" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
