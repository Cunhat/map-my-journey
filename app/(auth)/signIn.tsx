import Apple from "@/assets/svg/apple";
import Facebook from "@/assets/svg/facebook";
import Google from "@/assets/svg/google";
import Navigate from "@/assets/svg/navigate";
import PlanTrip from "@/assets/svg/plan-trip";
import { Button } from "@/components/ui/button";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

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

  const [paginationIndex, setPaginationIndex] = React.useState(0);

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
      illustration: <PlanTrip width={"100%"} height={"100%"} />,
      isAuth: false,
    },
    {
      title: "Visit your favorite spots",
      text: "Create your journey map and visit your spots using your favorite navigation app.",
      illustration: <Navigate width={"100%"} height={"100%"} />,
      isAuth: false,
    },
    {
      title: "Create your journey",
      text: "Add destinations, the amount of days you want to travel, save your favorite spots, and start planning your trip!",
      // illustration: "",
      isAuth: true,
    },
  ];

  const width = Dimensions.get("window").width;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (
      viewableItems[0].index !== undefined &&
      viewableItems[0].index !== null
    ) {
      setPaginationIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
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
            <View className="flex-1 w-screen bg-white">
              <View className="h-[70%] justify-center items-center ">
                {item.illustration}
              </View>
              <View
                style={{ gap: 12 }}
                className="flex-1 px-6  items-center text-center "
              >
                <Text className="text-3xl text-sky-500 font-bold">
                  {item.title}
                </Text>
                <Text className="text-xl text-black text-center">
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
      />
      <View
        style={{ gap: 4 }}
        className="flex-row h-16 justify-center items-center"
      >
        {data.map((_, index) => {
          // const pagAnimationStyle = useAnimatedStyle(() => {
          //   const dotWidth = interpolate(
          //     scrollX.valueOf,
          //     [(index - 1) * width, index * width, (index + 1) * width],
          //     [8, 20, 8],
          //     Extrapolation.CLAMP
          //   );
          //   return {
          //     width: dotWidth,
          //   };)

          // });

          return (
            <Animated.View
              key={index}
              className="bg-gray-300 h-2 w-2 rounded-lg"
              style={{
                backgroundColor:
                  paginationIndex === index ? "#0ea5e9" : "#d1d5db",
              }}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
