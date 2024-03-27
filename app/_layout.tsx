import { View, Text, SafeAreaView } from "react-native";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <SafeAreaView className="bg-white h-full">
      <Slot />
    </SafeAreaView>
  );
}
