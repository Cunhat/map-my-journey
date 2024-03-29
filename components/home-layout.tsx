import { PropsWithChildren } from "react";
import { ImageBackground, SafeAreaView, View } from "react-native";

export const HomeLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const staticImg = require("../assets/images/grainy.png");

  return (
    <ImageBackground source={staticImg} resizeMode="repeat" style={{ flex: 1 }}>
      <SafeAreaView className="h-full">
        <View className=" px-4">{children}</View>
      </SafeAreaView>
    </ImageBackground>
  );
};
