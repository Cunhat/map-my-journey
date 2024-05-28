import {
  Calendar,
  CalendarDays,
  Map,
  MapPin,
  Pin,
  PinIcon,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { HomeLayout } from "../../components/home-layout";
import { Link, router } from "expo-router";
import { supabaseClient } from "@/lib/supabase";
import { err } from "react-native-svg";
import { useQuery } from "@tanstack/react-query";
import { FullPageLoading } from "@/components/ui/loading";
import { TripSchema } from "@/lib/types/trips";
import { TripCard } from "@/components/trip-card";
import NoTrips from "@/assets/svg/notrips";
import { useAuth, useUser } from "@clerk/clerk-expo";

const Home = () => {
  const { getToken, userId, isLoaded } = useAuth();

  const { data, isPending, error, isSuccess } = useQuery({
    queryKey: ["getTrips"],
    queryFn: async () => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token);

      const resp = await supabase
        .from("trip")
        .select("*, point(*)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      return resp.data;
    },
  });

  if (isPending || !isLoaded) return <FullPageLoading />;

  if (data?.length === 0)
    return (
      <View className="flex-1 items-center justify-center">
        <NoTrips width={"80%"} height={"80%"} />
        <Text className="text-xl text-sky-500">No trips yet...</Text>
      </View>
    );

  return (
    <HomeLayout>
      <View style={{ gap: 8 }} className="flex-row items-center">
        <Map
          strokeWidth={1.2}
          className="text-sky-500"
          height={32}
          width={32}
        />
        <Text className="font-bold text-sky-500 text-2xl">Trips</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {isSuccess &&
          data?.map((trip) => <TripCard key={trip.id} tripInfo={trip} />)}
      </ScrollView>
    </HomeLayout>
  );
};

export default Home;
