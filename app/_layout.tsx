import AuthProvider from "@/provider/authProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native";

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
                name="category/create"
                options={{
                  headerShown: true,
                  presentation: "modal",
                  headerShadowVisible: false,
                  headerTitle: () => (
                    <Text className="text-xl text-sky-500">
                      Create Category
                    </Text>
                  ),
                }}
              />
              <Stack.Screen
                name="category/edit/[id]"
                options={{
                  headerShown: true,
                  presentation: "modal",
                  headerShadowVisible: false,
                  headerTitle: () => (
                    <Text className="text-xl text-sky-500">Edit Category</Text>
                  ),
                }}
              />
              <Stack.Screen
                name="point/edit/[id]"
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
