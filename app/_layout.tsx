import { View, Text, SafeAreaView } from "react-native";
import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
