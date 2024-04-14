import { cva } from "class-variance-authority";
import React, { PropsWithChildren } from "react";
import { TouchableOpacity, View, Text } from "react-native";

const TabItemStyle = cva("p-2 text-base rounded-3xl", {
  variants: {
    active: {
      true: "bg-sky-500 text-white",
      false: "text-gray-500",
    },
  },
});

export const Tabs: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <View className="flex-row border border-gray-300 rounded-3xl p-[2px]">
      {children}
    </View>
  );
};

type TabsProps = {
  onTabChange: (index: number) => void;
  tabIndex: number;
  currentTab: number;
  label: string;
};

export const TabItem: React.FC<TabsProps> = ({
  onTabChange,
  tabIndex,
  currentTab,
  label,
}) => {
  const isActive = tabIndex === currentTab;

  return (
    <TouchableOpacity
      onPress={() => onTabChange(tabIndex)}
      className={TabItemStyle({ active: isActive })}
    >
      <Text style={{ color: isActive ? "white" : "#6b7280" }}>{label}</Text>
    </TouchableOpacity>
  );
};
