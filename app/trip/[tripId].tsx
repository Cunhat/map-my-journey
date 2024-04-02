import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View, Text, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Search } from "lucide-react-native";

const Trip = () => {
  const [tripPoints, setTripPoints] = React.useState<
    {
      latitude: number;
      longitude: number;
    }[]
  >([
    { latitude: 38.86124450717146, longitude: -9.068422347763722 },
    { latitude: 38.83506147920597, longitude: -9.089607688955462 },
    { latitude: 38.738104537272854, longitude: -9.135876346756614 },
    { latitude: 38.73061238499506, longitude: -9.164889641914634 },
    { latitude: 38.723530524210524, longitude: -9.129684102531302 },
    { latitude: 38.73212833242504, longitude: -9.114989379236548 },
  ]);
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
        <View className="h-full p-2">
          <GooglePlacesAutocomplete
            placeholder="Search your point of interest..."
            textInputProps={{
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
                color: "#6b7280",
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
        </View>
      </BottomSheet>
    </View>
  );
};

export default Trip;
