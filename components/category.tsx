import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";

type CategoryProps = {
  name: string;
  icon: string | ReactNode;
  backgroundColor: string;
  url: string;
};

export const Category: React.FC<CategoryProps> = ({
  name,
  icon,
  backgroundColor,
  url,
}) => {
  return (
    <Link href={url} asChild>
      <Pressable className="flex flex-col items-center">
        <View
          style={{ backgroundColor: backgroundColor }}
          className="h-14 w-14 rounded-full justify-center items-center"
        >
          {typeof icon === "string" ? (
            <Text className="text-3xl">{icon}</Text>
          ) : (
            icon
          )}
        </View>
        <Text className="text-center text-base mt-1 text-gray-500">{name}</Text>
      </Pressable>
    </Link>
  );
};
