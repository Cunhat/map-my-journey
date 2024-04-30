import AuthProvider from "@/provider/authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
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
            <Stack.Screen
              name="trip/[tripId]/editCategory/[id]"
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="(auth)/signIn"
              options={{ headerShown: false }}
            />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
