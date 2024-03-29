import { Link } from "expo-router";
import React from "react";
import { View, Text, Pressable, SafeAreaView } from "react-native";
import { User as UserIcon } from "lucide-react-native";
import { HomeLayout } from "@/components/home-layout";

const User = () => {
  return (
    <HomeLayout>
      <View className="flex flex-row gap-2">
        <UserIcon
          strokeWidth={1.2}
          className="text-sky-500"
          height={32}
          width={32}
        />
        <Text className="font-bold text-sky-500 text-2xl">User</Text>
      </View>
    </HomeLayout>
  );
};

export default User;
