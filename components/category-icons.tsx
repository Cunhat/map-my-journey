import React, { memo } from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { icons } from "lucide-react-native";

const travelIcons = [
  "AlarmSmoke",
  "Backpack",
  "BaggageClaim",
  "Bath",
  "BookImage",
  "CableCar",
  "Caravan",
  "Cigarette",
  "CigaretteOff",
  "Compass",
  "ConciergeBell",
  "DoorClosed",
  "DoorOpen",
  "FireExtinguisher",
  "Heater",
  "Hospital",
  "Hotel",
  "Luggage",
  "MapPin",
  "MapPinOff",
  "MapPinned",
  "Plane",
  "PlaneLanding",
  "PlaneTakeoff",
  "Pyramid",
  "Receipt",
  "ReceiptCent",
  "ReceiptEuro",
  "Utensils",
  "UtensilsCrossed",
  "Vault",
  "WashingMachine",
];

const mostPopularIcons = [
  "Home",
  "UtensilsCrossed",
  "Beer",
  "Martini",
  "Coffee",
  "Bed",
  "SquareParking",
  "Camera",
  "Bike",
  "Star",
  "MapPin",
  "MapPinned",
  "Pin",
];

type CategoryIconsProps = {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
};

const CategoryIconsMemo: React.FC<CategoryIconsProps> = ({
  selectedIcon,
  setSelectedIcon,
}) => {
  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        flex: 1,
      }}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      className="h-full w-full flex-row flex-wrap"
    >
      <Text className="text-base text-gray-500">Most Popular</Text>
      <View style={{ gap: 24 }} className="flex-row flex-wrap">
        {mostPopularIcons.map((name) => {
          const LucideIcon = icons[name];

          return (
            <TouchableOpacity key={name} onPress={() => setSelectedIcon(name)}>
              <LucideIcon
                color={selectedIcon === name ? "#0ea5e9" : "black"}
                size={40}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <Text className="text-base text-gray-500">Travel</Text>
      <View style={{ gap: 24 }} className="flex-row flex-wrap">
        {travelIcons.map((name) => {
          const LucideIcon = icons[name];

          return (
            <TouchableOpacity key={name} onPress={() => setSelectedIcon(name)}>
              <LucideIcon
                color={selectedIcon === name ? "#0ea5e9" : "black"}
                size={40}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export const CategoryIcons = React.memo(CategoryIconsMemo);
