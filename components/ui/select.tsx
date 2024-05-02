import { ChevronDown, ChevronUp, icons } from "lucide-react-native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

type SelectProps = {
  data: Array<{
    title: string;
    icon?: { isCategory?: boolean; icon: string; color: string };
  }>;
  placeholder: string;
  decorationIcon: React.ReactNode;
  onSelect: (value: any) => void;
  defaultValue?: any;
};

const CategoryIcon: React.FC<{ category: { icon: string; color: string } }> = ({
  category,
}) => {
  const SelectedIcon = icons[category.icon as keyof typeof icons];
  return (
    <View
      style={{ backgroundColor: category.color }}
      className="h-6 w-6 rounded-full justify-center items-center"
    >
      <SelectedIcon height={"50%"} width={"50%"} className="text-white" />
    </View>
  );
};

const Icon: React.FC<{
  icon?: { icon: string; color: string };
  isCategory?: boolean;
}> = ({ icon, isCategory }) => {
  if (!icon) return null;

  if (isCategory) return <CategoryIcon category={icon} />;

  const SelectedIcon = icons[icon.icon as keyof typeof icons];

  return <SelectedIcon height={"50%"} width={"50%"} className="text-white" />;
};

export const Select: React.FC<SelectProps> = ({
  data,
  placeholder,
  decorationIcon,
  onSelect,
  defaultValue,
}) => {
  return (
    <SelectDropdown
      data={data}
      defaultValue={defaultValue}
      onSelect={(selectedItem) => {
        console.log(selectedItem, "selectedItem");
        onSelect(selectedItem);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            {decorationIcon}
            <Icon
              icon={selectedItem?.icon}
              isCategory={selectedItem?.icon?.isCategory}
            />
            <Text
              style={{
                ...styles.dropdownButtonTxtStyle,
                ...(!(selectedItem && selectedItem.title) && {
                  color: "#d1d5db",
                }),
              }}
            >
              {(selectedItem && selectedItem.title) || placeholder}
            </Text>
            {isOpened ? (
              <ChevronUp className="text-gray-500" height={20} width={20} />
            ) : (
              <ChevronDown className="text-gray-500" height={20} width={20} />
            )}
          </View>
        );
      }}
      renderItem={(item, _, isSelected) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: "#e5e7eb" }),
            }}
          >
            <Icon icon={item?.icon} isCategory={item?.icon?.isCategory} />
            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: 44,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
    color: "#6b7280",
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingTop: 12,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
