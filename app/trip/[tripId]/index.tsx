import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Search, Plus, Home, UtensilsCrossed } from "lucide-react-native";
import { Point } from "@/lib/types/types";
import { Category } from "@/components/category";
import {
  PointsList,
  PointsListItem,
  PointsListSeparator,
} from "@/components/points-list";

const Trip = () => {
  const [tripPoints, setTripPoints] = React.useState<Point[]>([]);
  const mapRef = useRef<MapView>(null);
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const sheetRef = useRef<BottomSheet>(null);
  const [index, setIndex] = React.useState(0);

  const snapPoints = React.useMemo(() => ["25%", "50%", "90%"], []);

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

              console.log("data", data);

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
                url="/"
                icon={
                  <Home height={"50%"} width={"50%"} className="text-white" />
                }
                name="Home"
                backgroundColor="#eab308"
              />
              <Category
                url="/"
                icon={
                  <UtensilsCrossed
                    height={"50%"}
                    width={"50%"}
                    className="text-white"
                  />
                }
                name="Food"
                backgroundColor="#16a34a"
              />
              <Category
                url={`/trip/${tripId}/createCategory`}
                icon={
                  <Plus height={"50%"} width={"50%"} className="text-white" />
                }
                name="Add"
                backgroundColor="#0ea5e9"
              />
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
