import React from "react";
import { View, Text } from "react-native";

type InfoFieldProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number | React.ReactNode;
};

export const InfoField: React.FC<InfoFieldProps> = ({ icon, label, value }) => {
  return (
    <View className="flex flex-row justify-between p-6">
      <View style={{ gap: 4 }} className="flex flex-row items-center">
        {icon}
        <Text className="text-gray-500 text-base">{label}</Text>
      </View>
      {typeof value === "string" || typeof value === "number" ? (
        <Text className="text-gray-500 text-base">{value}</Text>
      ) : (
        value
      )}
    </View>
  );
};

export const InfoFieldSeparator = () => {
  return <View className="h-[0.5px] bg-gray-300"></View>;
};
