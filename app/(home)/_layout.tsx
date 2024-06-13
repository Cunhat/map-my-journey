import { cva } from "class-variance-authority";
import { Tabs, router } from "expo-router";
import { Map, Plus, Settings, User, UserIcon } from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";

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
          headerShown: true,
          headerShadowVisible: false,
          headerTitle: () => (
            <View className="flex-row items-center justify-between w-full">
              <View style={{ gap: 8 }} className="flex-row items-center">
                <Map
                  strokeWidth={1.2}
                  className="text-sky-500"
                  height={32}
                  width={32}
                />
                <Text className="text-sky-500 text-2xl">My Trips</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  router.push("/trip/newTrip");
                }}
              >
                <Plus
                  height={32}
                  width={32}
                  strokeWidth={1.2}
                  className="text-sky-500"
                />
              </TouchableOpacity>
            </View>
          ),
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
        name="user"
        options={{
          tabBarShowLabel: false,
          headerShown: true,
          headerShadowVisible: false,
          headerTitle: () => (
            <View className="flex-row w-screen ">
              <UserIcon
                strokeWidth={1.2}
                className="text-sky-500"
                height={32}
                width={32}
              />
              <Text className=" text-sky-500 text-2xl">User</Text>
            </View>
          ),
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
