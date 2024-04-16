import { Map } from "lucide-react-native";
import React, { useEffect } from "react";
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
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { isPending, error, data, isSuccess, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await supabase.from("user").select("*");
    },
  });

  useEffect(() => {
    if (isSuccess) {
      console.log("data", data);
    }
  }, [isSuccess]);

  if (isFetching) return <Text>Loading...</Text>;

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
      <TouchableOpacity>
        <Text>Call</Text>
      </TouchableOpacity>
    </HomeLayout>
  );
};

export default Home;
