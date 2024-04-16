import { PropsWithChildren } from "react";
import { ImageBackground, SafeAreaView, View } from "react-native";

export const HomeLayout: React.FC<PropsWithChildren> = ({ children }) => {
  // const staticImg = require("../assets/images/grainy.png");

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View style={{ gap: 12 }} className="flex-1 px-4">
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};
