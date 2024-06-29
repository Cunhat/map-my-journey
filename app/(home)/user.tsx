import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import {
  LogOut,
  Mail,
  MapPin,
  SquareUser,
  Trash,
  Trash2,
  User as UserIcon,
  UserRoundPlus,
} from "lucide-react-native";
import { HomeLayout } from "@/components/home-layout";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Button } from "@/components/ui/button";

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
              <SquareUser className="text-gray-500" height={20} width={20} />
              <Text className="text-gray-500 text-base">Name:</Text>
            </View>
            <Text className="text-gray-500 text-base">
              {user?.fullName ?? ""}
            </Text>
          </View>
          <View className="border-[0.5px] border-gray-300" />
          <View className="flex flex-row justify-between p-6">
            <View style={{ gap: 4 }} className="flex flex-row items-center">
              <Mail className="text-gray-500" height={20} width={20} />
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
        <Button
          icon={<Trash2 className="text-white" height={20} width={20} />}
          title="Delete account"
          type="danger"
          onPress={() => user?.delete()}
        />
        <Button
          icon={<LogOut className="text-white" height={20} width={20} />}
          title="Log out"
          type="primary"
          onPress={() => signOut()}
        />
      </View>
      {/* <View className="flex flex-row gap-2 items-center">
        <UserIcon
          strokeWidth={1.2}
          className="text-sky-500"
          height={32}
          width={32}
        />
        <Text className="font-bold text-sky-500 text-2xl">User</Text>
      </View> */}
    </View>
  );
};

export default User;
