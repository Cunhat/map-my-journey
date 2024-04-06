import React, { PropsWithChildren } from "react";
import { View, Text } from "react-native";
import { Search, Plus, Home, UtensilsCrossed } from "lucide-react-native";

export const PointsList: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <View style={{ gap: 12 }} className="h-auto bg-gray-100 rounded-xl p-2">
      {children}
    </View>
  );
};

export const PointsListItem = () => {
  return (
    <View style={{ gap: 12 }} className="flex-row items-center p-2">
      <View className="rounded-full h-10 w-10 bg-[#eab308] items-center justify-center">
        <Home height={"50%"} width={"50%"} className="text-white" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-500 font-bold text-base">Vialonga</Text>
        <Text className="text-gray-500">Lisboa</Text>
      </View>
    </View>
  );
};

export const PointsListSeparator = () => {
  return <View className="h-[0.5px] bg-gray-300"></View>;
};
