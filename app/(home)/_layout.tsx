import { cva } from "class-variance-authority";
import { Tabs } from "expo-router";
import { Map, Plus, User } from "lucide-react-native";
import { View } from "react-native";

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
            <Map
              strokeWidth={1.2}
              className={IconsStyles({ focused })}
              height={32}
              width={32}
            />
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
            <User
              strokeWidth={1.2}
              className={IconsStyles({ focused })}
              height={32}
              width={32}
            />
          ),
        }}
      />
    </Tabs>
  );
}
