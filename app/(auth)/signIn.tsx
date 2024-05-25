import { Button } from "@/components/ui/button";
import { CustomTextInput } from "@/components/ui/text-input";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Redirect, router, useRouter } from "expo-router";
import { useAuth } from "@/provider/authProvider";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

const SignIn = () => {
  useWarmUpBrowser();

  const router = useRouter();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: "oauth_facebook",
  });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.push("/(home)");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View
        style={{ gap: 24 }}
        className="flex-1 p-3 justify-center items-center bg-white"
      >
        <Text className="text-4xl text-sky-500 font-bold">Sign in</Text>
        <Text className="text-xl text-sky-500">
          What did you use to access your account?
        </Text>
        <TouchableOpacity
          onPress={() => onSelectAuth(Strategy.Apple)}
          className="flex-row items-center justify-center h-12 px-4 py-2 rounded-2xl text-lg font-medium bg-black w-full"
        >
          <Text className="text-white text-xl">Sign in with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelectAuth(Strategy.Facebook)}
          className="flex-row items-center justify-center h-12 px-4 py-2 rounded-2xl text-lg font-medium bg-blue-500 w-full"
        >
          <Text className="text-white text-xl">Sign in with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelectAuth(Strategy.Google)}
          className="flex-row items-center justify-center h-12 px-4 py-2 rounded-2xl text-lg font-medium bg-white w-full border"
        >
          <Text className="text-black text-xl">Sign in with Gmail</Text>
        </TouchableOpacity>
        <View
          style={{ gap: 12 }}
          className="flex flex-row justify-center items-center"
        >
          <View className="h-[1px] bg-gray-300 flex-1"></View>
          <Text className="text-base text-sky-500">Or</Text>
          <View className="h-[1px] bg-gray-300 flex-1"></View>
        </View>
        <Button
          onPress={() => router.push("/(home)")}
          title="Sign up"
          fullWidth
        ></Button>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
