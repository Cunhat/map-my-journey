import { View, Text, Pressable } from "react-native";
import { Link, Slot } from "expo-router";
import { Icons } from "@/components/ui/icons";
import { Plus, Map, User } from "lucide-react-native";
import { usePathname } from "expo-router";
import { cva } from "class-variance-authority";
import { Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          headerTitle: "",
          tabBarIcon: ({ color }) => (
            <Map className="text-gray-300 mt-3" height={32} width={32} />
          ),
          tabBarLabel: ({ focused }) => <Text>Trips</Text>,
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
          tabBarIcon: ({ color }) => (
            <User className="text-gray-300 mt-3" height={32} width={32} />
          ),
        }}
      />
    </Tabs>
  );
}

const NavItemStyles = cva("flex-1 flex justify-center items-center", {
  variants: {
    active: {
      true: "text-sky-500",
      false: "text-gray-300",
    },
  },
});

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  path: string;
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, path }) => {
  const pathname = usePathname();
  console.log(pathname === path);
  return (
    <Link href={path} asChild>
      <Pressable className={NavItemStyles({ active: pathname === path })}>
        {icon}
      </Pressable>
    </Link>
  );
};

// <View
//         style={{
//           shadowColor: "#000",
//           shadowOffset: {
//             width: -1,
//             height: -1,
//           },
//           shadowOpacity: 0.05,
//           shadowRadius: 1,

//           elevation: 2,
//         }}
//         className="bg-white h-14 flex flex-row relative"
//       >
//         <View className="flex-1 flex justify-center items-center">
//           <Map className="text-sky-400" height={32} width={32} />
//         </View>
//         <View>
//           <View className=" p-1 -mt-3 rounded-full bg-white border border-gray-100 h-[68px] w-[68px] justify-center items-center">
//             <View className="rounded-full h-full w-full bg-sky-400 flex justify-center items-center">
//               <Plus
//                 strokeWidth={2.7}
//                 height={44}
//                 width={44}
//                 className="text-white"
//               />
//             </View>
//           </View>
//         </View>
//         {/* <NavItem
//           path="/"
//           icon={<User className="text-inherit" height={32} width={32} />}
//         ></NavItem> */}
//       </View>
