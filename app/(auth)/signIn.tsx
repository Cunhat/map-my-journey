import Apple from "@/assets/svg/apple";
import Facebook from "@/assets/svg/facebook";
import Google from "@/assets/svg/google";
import { Button } from "@/components/ui/button";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

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
    <SafeAreaView className="flex-1 bg-white">
      <View
        style={{ gap: 24 }}
        className="flex-1 p-3 justify-center items-center bg-white"
      >
        <Text className="text-4xl text-sky-500 font-bold">Sign in</Text>
        <Text className="text-xl text-sky-500">
          What did you use to access your account?
        </Text>
        <TouchableOpacity
          style={{ gap: 8 }}
          onPress={() => onSelectAuth(Strategy.Apple)}
          className="flex-row items-center justify-center h-12 px-4 py-2 rounded-2xl text-lg font-medium bg-black w-full"
        >
          <Apple height={24} width={24} />
          <Text className="text-white text-xl">Sign in with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ gap: 8 }}
          onPress={() => onSelectAuth(Strategy.Facebook)}
          className="flex-row items-center justify-center h-12 px-4 py-2 rounded-2xl text-lg font-medium bg-[#1877F2] w-full"
        >
          <Facebook height={24} width={24} />
          <Text className="text-white text-xl">Sign in with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelectAuth(Strategy.Google)}
          style={{ gap: 8 }}
          className="flex-row items-center justify-center h-12 px-4 py-2 rounded-2xl text-lg font-medium bg-white w-full border"
        >
          <Google height={24} width={24} />
          <Text className="text-black text-xl">Sign in with Gmail</Text>
        </TouchableOpacity>
        {/* <View
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
        ></Button> */}
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
