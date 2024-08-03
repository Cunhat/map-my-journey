import NoTrips from "@/assets/svg/notrips";
import { TripCard } from "@/components/trip-card";
import { FullPageLoading } from "@/components/ui/loading";
import { supabaseClient } from "@/lib/supabase";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { HomeLayout } from "../../components/home-layout";

const Home = () => {
  const { getToken, userId, isLoaded } = useAuth();

  const user = useUser();

  const { data, isPending, error, isSuccess } = useQuery({
    queryKey: ["getTrips", userId],
    queryFn: async () => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token);

      const resp = await supabase
        .from("trip")
        .select("*, point(*)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      // if (resp.error) throw new Error(resp.error.message);

      return resp.data;
    },
    retry: true,
  });

  if (isPending || !isLoaded) return <FullPageLoading />;

  if (data?.length === 0)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <NoTrips width={"80%"} height={"80%"} />
        <Text className="text-xl text-sky-500">No trips yet...</Text>
      </View>
    );

  return (
    <HomeLayout>
      <ScrollView
        contentContainerStyle={{ gap: 12, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {isSuccess &&
          data?.map((trip) => <TripCard key={trip.id} tripInfo={trip} />)}
      </ScrollView>
    </HomeLayout>
  );
};

export default Home;
