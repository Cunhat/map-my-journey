import { Map } from "lucide-react-native";
import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { HomeLayout } from "../../components/home-layout";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { err } from "react-native-svg";

const Home = () => {
  const call = async () => {
    let { data: category, error } = await supabase.from("user").select("*");
    console.log("user", category);
    console.log("error", error);
  };

  return (
    <HomeLayout>
      <View className="flex-row gap-2 items-center">
        <Map
          strokeWidth={1.2}
          className="text-sky-500"
          height={32}
          width={32}
        />
        <Text className="font-bold text-sky-500 text-2xl">Trips</Text>
      </View>
      <Link href={"/trip/32424dadasd"} asChild>
        <TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: "500" }}>Sign up</Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity onPress={call}>
        <Text>Call</Text>
      </TouchableOpacity>
    </HomeLayout>
  );
};

export default Home;
