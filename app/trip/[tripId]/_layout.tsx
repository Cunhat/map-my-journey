import { cva } from "class-variance-authority";
import { Tabs } from "expo-router";
import { Map, Plus, User, View } from "lucide-react-native";

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
          header: () => null,
        }}
      />
    </Tabs>
  );
}
