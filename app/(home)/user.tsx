import Mail from "@/assets/svg/mail";
import UserCard from "@/assets/svg/user";
import { DeleteAccount } from "@/components/delete-account";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { LogOut } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const User = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ gap: 12, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sky-500 pl-3 text-xl">Account Info</Text>
        <View>
          <View className="border-[0.5px] border-gray-300" />
          <View className="flex flex-row justify-between p-6">
            <View style={{ gap: 4 }} className="flex flex-row items-center">
              <UserCard height={24} width={24} />
              <Text className="text-gray-500 text-base">Name:</Text>
            </View>
            <Text className="text-gray-500 text-base">
              {user?.fullName ?? ""}
            </Text>
          </View>
          <View className="border-[0.5px] border-gray-300" />
          <View className="flex flex-row justify-between p-6">
            <View style={{ gap: 4 }} className="flex flex-row items-center">
              <Mail height={24} width={24} />
              <Text className="text-gray-500 text-base">Email:</Text>
            </View>
            <Text className="text-gray-500 text-base">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </Text>
          </View>
          <View className="border-[0.5px] border-gray-300" />
        </View>
      </ScrollView>
      <View style={{ gap: 12 }} className="pb-3 px-2">
        <DeleteAccount />
        <Button
          icon={<LogOut className="text-white" height={20} width={20} />}
          title="Log out"
          type="primary"
          onPress={() => signOut()}
        />
      </View>
    </View>
  );
};

export default User;
