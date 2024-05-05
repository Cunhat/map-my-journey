import AuthProvider from "@/provider/authProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
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
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen name="(home)" options={{ headerShown: false }} />
              <Stack.Screen
                name="trip/[tripId]"
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
              {/* <Stack.Screen
                name="trip/[tripId]/editCategory/[id]"
                options={{
                  headerShown: false,
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="trip/[tripId]/editPoint/[id]"
                options={{
                  headerShown: false,
                  presentation: "modal",
                }}
              /> */}
              <Stack.Screen
                name="(auth)/signIn"
                options={{ headerShown: false }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
