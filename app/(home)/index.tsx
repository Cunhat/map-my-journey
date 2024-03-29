import { Map } from "lucide-react-native";
import React from "react";
import { ImageBackground, SafeAreaView, Text, View, Image } from "react-native";
import { HomeLayout } from "../../components/home-layout";

const Home = () => {
  return (
    <HomeLayout>
      <View className="flex-row gap-2">
        <Map
          strokeWidth={1.2}
          className="text-sky-500"
          height={32}
          width={32}
          style={{ width: 400, height: 350 }}
        />
        <Text className="font-bold text-sky-500 text-2xl">Trips</Text>
      </View>
    </HomeLayout>
  );
};

export default Home;
