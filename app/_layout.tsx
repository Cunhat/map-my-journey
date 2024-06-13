import AuthProvider from "@/provider/authProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SplashScreen,
  Stack,
  useNavigation,
  usePathname,
  useRouter,
} from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, View } from "react-native";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // mon: require("../assets/fonts/Montserrat-Regular.ttf"),
    // "mon-sb": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    // "mon-b": require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const { isLoaded, isSignedIn, sessionId } = useAuth();
  const router = useRouter();

  // Automatically open login if user is not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/(auth)/signIn");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
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
              name="trip/newTrip"
              options={{
                headerShown: true,
                headerShadowVisible: false,
                presentation: "modal",
                headerTitle: () => (
                  <View className="flex-row items-center">
                    <Text className="text-xl text-sky-500 ml-auto">
                      Create a new trip
                    </Text>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="category/create"
              options={{
                headerShown: true,
                presentation: "modal",
                headerShadowVisible: false,
                headerTitle: () => (
                  <Text className="text-xl text-sky-500">Create Category</Text>
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
            <Stack.Screen
              name="(auth)/signIn"
              options={{ headerShown: false }}
            />
          </Stack>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
