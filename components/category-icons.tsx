import { icons } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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
      <Icons
        selectedIcon={selectedIcon}
        setSelectedIcon={setSelectedIcon}
        arrayOfIcons={mostPopularIcons}
      />
      <Text className="text-base text-gray-500">Travel</Text>
      <Icons
        selectedIcon={selectedIcon}
        setSelectedIcon={setSelectedIcon}
        arrayOfIcons={travelIcons}
      />
    </ScrollView>
  );
};

const Icons: React.FC<{
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  arrayOfIcons: Array<string>;
}> = ({ selectedIcon, setSelectedIcon, arrayOfIcons }) => {
  return (
    <View style={{ gap: 24 }} className="flex-row flex-wrap">
      {arrayOfIcons.map((name) => {
        const LucideIcon = icons[name as keyof typeof icons];

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
  );
};

export const CategoryIcons = React.memo(CategoryIconsMemo);
