import Apple from "@/assets/svg/apple";
import Facebook from "@/assets/svg/facebook";
import Google from "@/assets/svg/google";
import { Button } from "@/components/ui/button";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  const data = [
    {
      title: "Create your journey",
      text: "Add destinations, the amount of days you want to travel, save your favorite spots, and start planning your trip!",
      illustration: "",
      isAuth: false,
    },
    {
      title: "Visit your favorite spots",
      text: "Create your journey map and visit your spots using your favorite navigation app.",
      illustration: "",
      isAuth: false,
    },
    {
      title: "Create your journey",
      text: "Add destinations, the amount of days you want to travel, save your favorite spots, and start planning your trip!",
      illustration: "",
      isAuth: true,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        // className="w-full"
        pagingEnabled
        renderItem={({ item }) => {
          if (item.isAuth)
            return (
              <View
                style={{ gap: 24 }}
                className="flex-1 w-screen p-3 justify-center items-center bg-white"
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
                  <Text className="text-white text-xl">
                    Sign in with Facebook
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSelectAuth(Strategy.Google)}
                  style={{ gap: 8 }}
                  className="flex-row items-center justify-center h-12 px-4 py-2 rounded-2xl text-lg font-medium bg-white w-full border"
                >
                  <Google height={24} width={24} />
                  <Text className="text-black text-xl">Sign in with Gmail</Text>
                </TouchableOpacity>
              </View>
            );

          return (
            <View className="flex-1 w-screen bg-white justify-center items-center">
              <Text>{item.title}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default SignIn;
