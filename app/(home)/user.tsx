import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { User as UserIcon } from "lucide-react-native";
import { HomeLayout } from "@/components/home-layout";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/provider/authProvider";

const User = () => {
  const { session } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <HomeLayout>
      <View className="flex flex-row gap-2 items-center">
        <UserIcon
          strokeWidth={1.2}
          className="text-sky-500"
          height={32}
          width={32}
        />
        <Text className="font-bold text-sky-500 text-2xl">User</Text>
      </View>
      <Text className="text-xl text-sky-500">{session?.user.email}</Text>
      <TouchableOpacity
        onPress={signOut}
        className="flex flex-row gap-2 items-center"
      >
        <Text>Log out</Text>
      </TouchableOpacity>
    </HomeLayout>
  );
};

export default User;
