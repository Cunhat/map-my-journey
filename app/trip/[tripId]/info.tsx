import { Button } from "@/components/ui/button";
import { FullPageLoading } from "@/components/ui/loading";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import {
  CalendarDays,
  MapPin,
  Pin,
  Plane,
  Trash,
  Trash2,
} from "lucide-react-native";
import React from "react";
import { View, Text, SafeAreaView, TextInput } from "react-native";

const Info = () => {
  const { tripId } = useGlobalSearchParams<{ tripId: string }>();

  console.log("tripId", tripId);

  const { data, isPending } = useQuery({
    queryKey: ["getTrip", tripId],
    queryFn: async () => {
      const resp = await supabase
        .from("trip")
        .select("*")
        .eq("id", tripId)
        .maybeSingle();

      return resp.data;
    },
  });

  if (isPending) return <FullPageLoading />;

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View style={{ gap: 12 }} className="flex-1 p-3">
        <View className="relative">
          <Plane
            className="text-gray-500 absolute z-10 left-1.5 top-3.5 "
            height={20}
            width={20}
          />
          <TextInput
            placeholder={"What is the name of your trip?"}
            placeholderTextColor={"#d1d5db"}
            value={data?.name}
            style={{ paddingLeft: 35 }}
            // onChangeText={(text) => setName(text)}
            className="h-11 w-full text-base  p-2 bg-gray-100 rounded-xl text-gray-600"
          />
        </View>
        <View className="relative">
          <CalendarDays
            className="text-gray-500 absolute z-10 left-1.5 top-3.5 "
            height={20}
            width={20}
          />
          <TextInput
            placeholder={"How many days will you be there?"}
            placeholderTextColor={"#d1d5db"}
            value={data?.days.toString()}
            style={{ paddingLeft: 35 }}
            keyboardType={"number-pad"}
            // onChangeText={(text) => setDays(text)}
            className="h-11 w-full text-base p-2 bg-gray-100 rounded-xl text-gray-600  "
          />
        </View>
        <View className="relative">
          <MapPin
            className="text-gray-500 absolute z-10 left-1.5 top-3.5 "
            height={20}
            width={20}
          />
          <TextInput
            placeholder={"How many days will you be there?"}
            placeholderTextColor={"#d1d5db"}
            value={data?.city ?? ""}
            style={{ paddingLeft: 35 }}
            keyboardType={"number-pad"}
            // onChangeText={(text) => setDays(text)}
            className="h-11 w-full text-base p-2 bg-gray-100 rounded-xl text-gray-600  "
          />
        </View>
        <Button
          title="Delete"
          type="danger"
          icon={<Trash2 className="text-white" height={20} width={20} />}
          fullWidth
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default Info;
