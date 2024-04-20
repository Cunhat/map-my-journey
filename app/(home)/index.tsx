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
import { supabase } from "@/lib/supabase";
import { err } from "react-native-svg";
import { useQuery } from "@tanstack/react-query";
import { useGetUser } from "@/hooks/useGetUser";
import { FullPageLoading } from "@/components/ui/loading";
import { TripSchema } from "@/lib/types/trips";
import { TripCard } from "@/components/trip-card";

const Home = () => {
  const { getUser } = useGetUser();

  const { data, isPending, error, isSuccess } = useQuery({
    queryKey: ["getTrips"],
    queryFn: async () => {
      const user = await getUser();

      const resp = await supabase
        .from("trip")
        .select("*")
        .eq("userId", user?.id);

      return resp.data as TripSchema[];
    },
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (isPending) return <FullPageLoading />;

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
        style={{ gap: 12 }}
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
