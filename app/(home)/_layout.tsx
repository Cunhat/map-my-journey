import { View, Text, Pressable } from "react-native";
import { Link, Slot } from "expo-router";
import { Icons } from "@/components/ui/icons";
import { Plus, Map, User } from "lucide-react-native";
import { usePathname } from "expo-router";
import { cva } from "class-variance-authority";
import { Tabs } from "expo-router";

const IconsStyles = cva("mt-3", {
  variants: {
    focused: {
      true: "text-sky-500",
      false: "text-gray-300",
    },
  },
});

export default function HomeLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          headerTitle: "",
          tabBarIcon: ({ focused }) => (
            <Map className={IconsStyles({ focused })} height={32} width={32} />
          ),
          tabBarLabelStyle: {},
        }}
      />
      <Tabs.Screen
        name="newTrip"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: () => (
            <View className=" p-1 -mt-3 rounded-full bg-white border border-gray-100 h-[68px] w-[68px] justify-center items-center">
              <View className="rounded-full h-full w-full bg-sky-400 flex justify-center items-center">
                <Plus
                  strokeWidth={2.7}
                  height={44}
                  width={44}
                  className="text-white"
                />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          headerTitleContainerStyle: {},
          tabBarIcon: ({ focused }) => (
            <User className={IconsStyles({ focused })} height={32} width={32} />
          ),
        }}
      />
    </Tabs>
  );
}
