import { View, Text } from "react-native";
import React from "react";

export const LocationTitle: React.FC<{ title: string }> = ({ title }) => {
  const mainLocation = title?.split(", ")[0];
  const location = title?.split(", ");
  location?.shift();
  const secondaryLocation = location?.join(", ");

  return (
    <View className="flex-1">
      <Text className="text-lg text-gray-500 font-bold">{mainLocation}</Text>
      <Text className="text-sm text-gray-500">{secondaryLocation}</Text>
    </View>
  );
};
