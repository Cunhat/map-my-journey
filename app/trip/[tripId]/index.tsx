import { CreatePoint } from "@/components/Trip/create-point";
import { DayView } from "@/components/Trip/day-view";
import { FocusPoint } from "@/components/Trip/focus-point";
import { Points } from "@/components/Trip/points";
import { TripMap } from "@/components/Trip/trip-map";
import { Category } from "@/components/category";
import { FullPageLoading } from "@/components/ui/loading";
import { supabaseClient } from "@/lib/supabase";
import { Tables } from "@/lib/types/supabase";
import { CurrentMarker } from "@/lib/types/types";
import { useAuth } from "@clerk/clerk-expo";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Plus, Search } from "lucide-react-native";
import React, { useLayoutEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView from "react-native-maps";

const Trip = () => {
  const navigation = useNavigation();

  const mapRef = useRef<MapView>(null);
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const sheetRef = useRef<BottomSheet>(null);
  const focusPointRef = useRef<BottomSheetModal>(null);
  const daySheetRef = useRef<BottomSheetModal>(null);
  const [focusPoint, setFocusPoint] = React.useState<number | undefined>();
  let colorScheme = useColorScheme();
  const [addPointBottomSheet, setAddPointBottomSheet] = React.useState(false);
  const [index, setIndex] = React.useState(1);
  const [selectedDay, setSelectedDay] = React.useState<number>(0);
  const [currentMarker, setCurrentMarker] = React.useState<CurrentMarker>();
  const { getToken, userId, isLoaded } = useAuth();

  const snapPoints = React.useMemo(() => ["10%", "30%", "88%"], []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          className="rounded-full p-1 bg-white border border-gray-200 flex items-center justify-center"
          onPress={() => {
            router.push("/");
            focusPointRef.current?.dismiss();
            daySheetRef.current?.dismiss();
          }}
        >
          <ArrowLeft
            className="text-gray-500"
            height={24}
            width={24}
          ></ArrowLeft>
        </TouchableOpacity>
      ),
      headerLeftContainerStyle: { paddingLeft: 20 },
    });
  }, []);

  const closeModelAndClearCurrentMarker = () => {
    setAddPointBottomSheet(false);
    sheetRef.current?.expand();
    setCurrentMarker(undefined);
  };

  const trip = useQuery({
    queryKey: ["getTrip", tripId],
    queryFn: async () => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token);

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
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token);

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
      const token = await getToken({ template: "routes-app-supabase" });
      const supabase = await supabaseClient(token);

      const resp = await supabase
        .from("point")
        .select(`*, category("*")`)
        .eq("trip_id", tripId)
        .order("created_at", { ascending: true })
        .returns<Array<Tables<"point"> & { category: Tables<"category"> }>>();

      return resp.data;
    },
  });

  if (categories.isPending || trip.isPending || points.isPending || !isLoaded)
    return <FullPageLoading />;

  const handleFocusPoint = (
    point: Tables<"point"> & { category: Tables<"category"> }
  ) => {
    sheetRef.current?.close();
    daySheetRef?.current?.close();
    setFocusPoint(point.id);
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: point.latitude,
          longitude: point.longitude,
        },
        zoom: 15,
        altitude: 3000,
      },
      { duration: 1000 }
    );
    focusPointRef.current?.present();
  };

  const onModelClose = () => {
    if (selectedDay === 0) sheetRef.current?.expand();
    else daySheetRef.current?.expand();
  };

  const onDayOpen = (day: number) => {
    setSelectedDay(day);
    sheetRef.current?.close();
    daySheetRef.current?.present();
  };

  const onDayClose = () => {
    daySheetRef.current?.close();
    sheetRef.current?.expand();
    setSelectedDay(0);
  };

  const filterMapPoints = () => {
    if (selectedDay > 0)
      return points.data?.filter((point) => point.day === selectedDay) ?? [];
    else return points.data ?? [];
  };

  return (
    <View className="flex-1">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <TripMap
        ref={mapRef}
        points={filterMapPoints()}
        currentMarker={currentMarker}
        tripLocation={{
          latitude: trip?.data?.latitude ?? 0,
          longitude: trip?.data?.longitude ?? 0,
        }}
        onPointPress={handleFocusPoint}
      />

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
        <View style={{ gap: 16, height: "90%" }} className="flex-1 p-2">
          <GooglePlacesAutocomplete
            placeholder="Search your point of interest..."
            textInputProps={{
              placeholderTextColor: "#d1d5db",
              onFocus: () => {
                // setIndex(2);
                sheetRef.current?.snapToIndex(2);
              },
            }}
            onPress={(data, details) => {
              const { lat, lng } = details?.geometry?.location;

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
              // setIndex(0);
              sheetRef.current?.collapse();
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
                url={`category/create?tripId=${tripId}`}
                icon={
                  <Plus height={"50%"} width={"50%"} className="text-white" />
                }
                name="Add"
                backgroundColor="#0ea5e9"
                key="AddCategory"
              />
              {categories?.data?.map((category) => {
                return (
                  <Category
                    url={`category/edit/${category.id}?tripId=${tripId}`}
                    icon={category.icon}
                    name={category.name}
                    backgroundColor={category.color}
                    key={category.id}
                  />
                );
              })}
            </ScrollView>
          </View>
          <Points
            tripDays={trip?.data?.days ?? 0}
            points={points?.data ?? []}
            focusPoint={handleFocusPoint}
            onDayOpen={onDayOpen}
          />
        </View>
      </BottomSheet>
      <DayView
        ref={daySheetRef}
        onDayClose={onDayClose}
        day={selectedDay}
        maxDays={trip?.data?.days ?? 0}
        points={points.data?.filter((point) => point.day === selectedDay) ?? []}
        changeDay={setSelectedDay}
        handleFocusPoint={handleFocusPoint}
      />
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
        closeModelAndClearCurrentMarker={closeModelAndClearCurrentMarker}
        startDate={trip?.data?.start_date ?? ""}
        endDate={trip?.data?.end_date ?? ""}
      />
      <FocusPoint
        ref={focusPointRef}
        point={points.data?.find((point) => point.id === focusPoint)!}
        onModelClose={onModelClose}
      />
    </View>
  );
};

export default Trip;
