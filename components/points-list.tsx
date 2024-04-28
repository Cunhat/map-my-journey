import React, { PropsWithChildren } from "react";
import { View, Text, ScrollView } from "react-native";
import {
  Search,
  Plus,
  Home,
  UtensilsCrossed,
  icons,
} from "lucide-react-native";
import Calendar from "@/assets/svg/calendar";
import { Tables } from "@/lib/types/supabase";

export const PointsList: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ScrollView
      contentContainerStyle={{ gap: 12 }}
      showsVerticalScrollIndicator={false}
      className="h-auto bg-gray-100 rounded-xl p-2"
    >
      {children}
    </ScrollView>
  );
};

type PointsListItemProps = {
  point: Tables<"point">;
};

export const PointsListItem: React.FC<PointsListItemProps> = ({ point }) => {
  const Icon = icons[point.category.icon as keyof typeof icons];

  const location = point.name.split(", ");
  const mainLocation = location[0];
  location.shift();
  const subLocation = location.join(", ");

  return (
    <View style={{ gap: 12 }} className="flex-row items-center p-2">
      <View
        style={{ backgroundColor: point.category.color }}
        className="rounded-full h-10 w-10 items-center justify-center"
      >
        <Icon height={"50%"} width={"50%"} className="text-white" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-500 font-bold text-base">
          {mainLocation}
        </Text>
        <Text className="text-gray-500">{subLocation}</Text>
      </View>
      <View style={{ gap: 0 }} className="w-14 items-center justify-center">
        <Calendar height={32} width={32} />
        <Text className="text-gray-500 font-bold text-xs">{point.day}</Text>
      </View>
    </View>
  );
};

export const PointsListSeparator = () => {
  return <View className="h-[0.5px] bg-gray-300"></View>;
};
