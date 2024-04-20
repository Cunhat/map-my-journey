import React from "react";
import { View, Text } from "react-native";

export const FullPageLoading = () => {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Text className="text-xl text-sky-500">Loading...</Text>
    </View>
  );
};
