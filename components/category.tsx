import { Plus } from "lucide-react-native";
import React, { ReactNode } from "react";
import { View, Text } from "react-native";

type CategoryProps = {
  name: string;
  icon: ReactNode;
  backgroundColor: string;
};

export const Category: React.FC<CategoryProps> = ({
  name,
  icon,
  backgroundColor,
}) => {
  return (
    <View className="flex flex-col items-center">
      <View
        style={{ backgroundColor: backgroundColor }}
        className="h-14 w-14 rounded-full justify-center items-center"
      >
        {icon}
      </View>
      <Text className="text-center text-base mt-1 text-gray-500">{name}</Text>
    </View>
  );
};
