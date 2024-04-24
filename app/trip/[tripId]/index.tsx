import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import {
  Search,
  Plus,
  Home,
  UtensilsCrossed,
  icons,
  ChevronLeft,
  X,
  Tag,
  CalendarDays,
  Beer,
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
import { useHeaderHeight } from "@react-navigation/elements";
import { createDecrementArray, getDeviceHeaderHeight } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CreatePoint } from "@/components/Trip/create-point";

const Trip = () => {
  const [tripPoints, setTripPoints] = React.useState<Point[]>([]);
  const mapRef = useRef<MapView>(null);
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const sheetRef = useRef<BottomSheet>(null);
  const addPointRef = useRef<BottomSheet>(null);
  const [addPointBottomSheet, setAddPointBottomSheet] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const { getUser } = useGetUser();
  const [currentMarker, setCurrentMarker] = React.useState<{
    details: GooglePlaceDetail;
    data: GooglePlaceData;
    latitude: number;
    longitude: number;
  }>();
  const headerHeight = getDeviceHeaderHeight() as number;

  const snapPoints = React.useMemo(() => ["25%", "50%", "90%"], []);
  const snapPointsBottom = React.useMemo(() => ["35%"], []);

  const trip = useQuery({
    queryKey: ["getTrip", tripId],
    queryFn: async () => {
      // const user = await getUser();

      const resp = await supabase
        .from("trip")
        .select("*")
        .eq("id", tripId)
        .maybeSingle();

      return resp.data;
    },
  });

  const categories = useQuery({
    queryKey: ["getTripCategories", tripId],
    queryFn: async () => {
      // const user = await getUser();

      const resp = await supabase
        .from("category")
        .select("*")
        .eq("tripId", tripId)
        .order("created_at", { ascending: false });

      return resp.data;
    },
  });

  const points = useQuery({
    queryKey: ["getTripPoints", tripId],
    queryFn: async () => {
      const user = await getUser();

      const resp = await supabase
        .from("point")
        .select(`*, category("*")`)
        .eq("trip_id", tripId);

      console.log("POINTSSSS", resp.data);

      return resp.data;
    },
  });

  if (categories.isPending || trip.isPending || points.isPending)
    return <FullPageLoading />;

  return (
    <View className="flex-1">
      <TouchableOpacity
        style={{ top: headerHeight, left: 10 }}
        className="absolute z-10 rounded-full p-1 bg-white border border-gray-200 flex items-center justify-center"
        onPress={() => router.push("/")}
      >
        <X className="text-gray-500" height={24} width={24}></X>
      </TouchableOpacity>
      <MapView
        className="h-[90%]"
        showsUserLocation
        zoomEnabled
        // provider="google"
        ref={mapRef}
      >
        {tripPoints.map((marker, index) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          />
        ))}
        {currentMarker && (
          <Marker
            icon={34}
            key={"curentMarker"}
            coordinate={{
              latitude: currentMarker.latitude,
              longitude: currentMarker.longitude,
            }}
          />
        )}
      </MapView>
      {!addPointBottomSheet && (
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
              onPress={(data, details) => {
                const { lat, lng } = details?.geometry?.location;

                console.log(data, details);

                setCurrentMarker({
                  latitude: lat,
                  longitude: lng,
                  data,
                  details,
                });
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
                setAddPointBottomSheet(!addPointBottomSheet);
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
                  const SelectedIcon =
                    icons[category.icon as keyof typeof icons];
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
                      key={category.id}
                    />
                  );
                })}
              </ScrollView>
            </View>
            <View style={{ gap: 12 }} className="flex flex-col">
              <Text className="text-sky-500 text-xl">Points</Text>
              <PointsList>
                {points.data &&
                  points?.data?.map((point, index) => (
                    <>
                      <PointsListItem point={point}></PointsListItem>
                      {index < points?.data?.length! - 1 && (
                        <PointsListSeparator></PointsListSeparator>
                      )}
                    </>
                  ))}
              </PointsList>
            </View>
          </View>
        </BottomSheet>
      )}
      <CreatePoint
        addPointBottomSheet={addPointBottomSheet}
        setAddPointBottomSheet={setAddPointBottomSheet}
        point={{
          name: currentMarker?.data?.description ?? "",
          latitude: currentMarker?.latitude ?? 0,
          longitude: currentMarker?.longitude ?? 0,
        }}
        tripId={tripId}
        categories={categories?.data ?? []}
        numberOfDays={trip?.data?.days ?? 0}
      />
    </View>
  );
};

export default Trip;
