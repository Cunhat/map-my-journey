import { cva } from "class-variance-authority";
import { Tabs, router } from "expo-router";
import {
  ArrowLeft,
  Map,
  MapPin,
  Menu,
  Plus,
  User,
  View,
  X,
} from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";

const IconsStyles = cva("mt-3", {
  variants: {
    focused: {
      true: "text-sky-500",
      false: "text-gray-300",
    },
  },
});

export default function TripLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <MapPin
              strokeWidth={1.2}
              className={IconsStyles({ focused })}
              height={32}
              width={32}
            />
          ),
          tabBarLabelStyle: {},
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          tabBarShowLabel: false,
          headerShown: true,
          headerTitle: () => <Text className="text-xl text-sky-500">Menu</Text>,
          tabBarIcon: ({ focused }) => (
            <Menu
              strokeWidth={1.2}
              className={IconsStyles({ focused })}
              height={32}
              width={32}
            />
          ),
          headerLeft: () => (
            <TouchableOpacity
              className="rounded-full p-1 m-3  flex items-center justify-center"
              onPress={() => {
                router.push("/");
              }}
            >
              <ArrowLeft
                className="text-gray-500"
                height={24}
                width={24}
              ></ArrowLeft>
            </TouchableOpacity>
          ),
          tabBarLabelStyle: {},
          headerShadowVisible: false,
        }}
      />
    </Tabs>
  );
}
