import { View, Text } from "react-native";
import { Slot } from "expo-router";
import { Icons } from "@/components/ui/icons";
import { Plus, Map, User } from "lucide-react-native";
import { Dimensions } from "react-native";

export default function HomeLayout() {
  const width = Dimensions.get("window").width / 2 - 34;
  return (
    <View className="bg-white h-full flex flex-col">
      <View className="flex-1">
        <Slot />
      </View>
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: -1,
            height: -1,
          },
          shadowOpacity: 0.05,
          shadowRadius: 1,

          elevation: 2,
        }}
        className="bg-white h-14 flex flex-row relative"
      >
        <View
          style={{
            left: width,
            elevation: 5,
          }}
          className="absolute -top-5 rounded-full bg-white border border-gray-100 h-[68px] w-[68px] justify-center items-center"
        >
          <View className="rounded-full h-[60px] w-[60px] bg-sky-500 flex justify-center items-center">
            <Plus
              strokeWidth={2.7}
              height={44}
              width={44}
              className="text-white"
            />
          </View>
        </View>
        <View className="flex-1 flex justify-center items-center">
          <Map className="text-gray-300" height={32} width={32} />
        </View>
        <View className="flex-1 flex justify-center items-center">
          <User className="text-gray-300" height={32} width={32} />
        </View>
      </View>
    </View>
  );
}
