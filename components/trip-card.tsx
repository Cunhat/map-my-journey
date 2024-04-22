import { Tables } from "@/lib/types/supabase";
import { TripSchema } from "@/lib/types/trips";
import { router } from "expo-router";
import { CalendarDays, MapPin } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";

type TripCardProps = {
  tripInfo: Tables<"trip">;
};

export const TripCard: React.FC<TripCardProps> = ({ tripInfo }) => {
  return (
    <TouchableOpacity
      key={tripInfo.id}
      onPress={() => router.push(`/trip/${tripInfo.id}`)}
      className="flex-row items-center rounded-xl h-48 w-full bg-black overflow-hidden"
    >
      <ImageBackground
        imageStyle={{ opacity: 0.8 }}
        source={{
          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${tripInfo.photo_url}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <View className="flex h-full w-full justify-between p-3">
          <View style={{ gap: 12 }} className="flex-row items-center">
            <View
              style={{ gap: 4 }}
              className="flex-row bg-white rounded-xl px-2 py-1 items-center"
            >
              <CalendarDays height={16} width={16} className="text-red-500" />
              <Text className="text-sm text-black">{tripInfo.days} days</Text>
            </View>
            <View
              style={{ gap: 4 }}
              className="flex-row bg-white rounded-xl px-2 py-1 items-center"
            >
              <MapPin height={16} width={16} className="text-red-500" />
              <Text className="text-sm text-black">
                {tripInfo?.points?.length ?? 0} points
              </Text>
            </View>
          </View>
          <View style={{ gap: 0 }} className="">
            <Text className="text-xl text-white font-bold">
              {tripInfo.name}
            </Text>
            <Text className="text-sm text-white">{tripInfo.city}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
