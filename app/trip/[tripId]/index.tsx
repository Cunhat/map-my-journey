import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  Search,
  Plus,
  Home,
  UtensilsCrossed,
  icons,
} from "lucide-react-native";
import { Point } from "@/lib/types/types";
import { Category } from "@/components/category";
import {
  PointsList,
  PointsListItem,
  PointsListSeparator,
} from "@/components/points-list";
import { useQuery } from "@tanstack/react-query";
import { useGetUser } from "@/hooks/useGetUser";
import { supabase } from "@/lib/supabase";
import { FullPageLoading } from "@/components/ui/loading";

const Trip = () => {
  const [tripPoints, setTripPoints] = React.useState<Point[]>([]);
  const mapRef = useRef<MapView>(null);
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const sheetRef = useRef<BottomSheet>(null);
  const [index, setIndex] = React.useState(0);
  const { getUser } = useGetUser();

  const snapPoints = React.useMemo(() => ["25%", "50%", "90%"], []);

  const categories = useQuery({
    queryKey: ["getTripCategories", tripId],
    queryFn: async () => {
      const user = await getUser();

      const resp = await supabase
        .from("category")
        .select("*")
        .eq("tripId", tripId)
        .order("created_at", { ascending: false });

      return resp.data;
    },
  });

  if (categories.isPending) return <FullPageLoading />;

  return (
    <View className="flex-1">
      <MapView
        className="h-[90%]"
        showsUserLocation
        zoomEnabled
        // showsMyLocationButton
        // provider="google"
        ref={mapRef}
      >
        {tripPoints.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          />
        ))}
      </MapView>
      <BottomSheet
        animateOnMount
        ref={sheetRef}
        index={index}
        snapPoints={snapPoints}
        handleIndicatorStyle={{
          backgroundColor: "#6b7280",
          width: 40,
        }}
      >
        <View style={{ gap: 16 }} className="flex-1 p-2">
          <GooglePlacesAutocomplete
            placeholder="Search your point of interest..."
            textInputProps={{
              placeholderTextColor: "#d1d5db",
              onFocus: () => {
                setIndex(2);
              },
            }}
            onPress={(data, details = null) => {
              const { lat, lng } = details?.geometry.location;

              mapRef.current?.animateCamera(
                {
                  center: {
                    latitude: lat,
                    longitude: lng,
                  },
                  zoom: 15,
                  altitude: 3000,
                },
                { duration: 1000 }
              );
              setIndex(0);
            }}
            renderLeftButton={() => (
              <View className="absolute z-10 left-1.5 top-2.5 ">
                <Search className="text-gray-500" height={20} width={20} />
              </View>
            )}
            styles={{
              container: {
                flex: 0,
              },
              textInput: {
                backgroundColor: "#f3f4f6",
                borderRadius: 12,
                paddingLeft: 35,
                color: "#4b5563",
                height: 40,
              },
              textInputContainer: {
                backgroundColor: "white",
                padding: 0,
              },
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
              language: "en",
            }}
            fetchDetails
            enablePoweredByContainer={false}
            renderRow={(data) => (
              <Text className="text-gray-500">{data.description}</Text>
            )}
          />
          <View className="flex flex-col gap-2">
            <Text className="text-sky-500 text-xl">Categories</Text>
            <ScrollView
              horizontal
              contentContainerStyle={{ gap: 12, paddingRight: 20 }}
              showsHorizontalScrollIndicator={false}
              className="h-auto p-3 bg-gray-100 rounded-xl flex flex-row "
            >
              <Category
                url={`/trip/${tripId}/createCategory`}
                icon={
                  <Plus height={"50%"} width={"50%"} className="text-white" />
                }
                name="Add"
                backgroundColor="#0ea5e9"
              />
              {categories?.data?.map((category) => {
                const SelectedIcon = icons[category.icon as keyof typeof icons];
                return (
                  <Category
                    url="/"
                    icon={
                      <SelectedIcon
                        height={"50%"}
                        width={"50%"}
                        className="text-white"
                      />
                    }
                    name={category.name}
                    backgroundColor={category.color}
                  />
                );
              })}
            </ScrollView>
          </View>
          <View style={{ gap: 12 }} className="flex flex-col">
            <Text className="text-sky-500 text-xl">Points</Text>
            <PointsList>
              <PointsListItem></PointsListItem>
              <PointsListSeparator></PointsListSeparator>
              <PointsListItem></PointsListItem>
              <PointsListSeparator></PointsListSeparator>
              <PointsListItem></PointsListItem>
              <PointsListSeparator></PointsListSeparator>
              <PointsListItem></PointsListItem>
            </PointsList>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Trip;
