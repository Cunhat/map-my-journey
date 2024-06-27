import React from "react";
import { Text, View } from "react-native";

export const CategoryIcon: React.FC<{
  category: { icon: string; color: string };
}> = ({ category }) => {
  return (
    <View
      style={{ backgroundColor: category.color }}
      className="rounded-full h-8 w-8 items-center justify-center"
    >
      <Text className="text-xl">{category.icon}</Text>
    </View>
  );
};
