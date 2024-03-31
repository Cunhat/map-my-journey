import { useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { View, Text, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";

const Trip = () => {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = React.useMemo(() => ["25%", "50%", "90%"], []);

  console.log(tripId);

  const markers = [
    { latitude: 38.86124450717146, longitude: -9.068422347763722 },
    { latitude: 38.83506147920597, longitude: -9.089607688955462 },
    { latitude: 38.738104537272854, longitude: -9.135876346756614 },
    { latitude: 38.73061238499506, longitude: -9.164889641914634 },
    { latitude: 38.723530524210524, longitude: -9.129684102531302 },
    { latitude: 38.73212833242504, longitude: -9.114989379236548 },
  ];

  return (
    <View className="flex-1">
      <MapView
        className="h-[90%]"
        showsUserLocation
        zoomEnabled
        showsMyLocationButton
        provider="google"
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          />
        ))}
      </MapView>
      <BottomSheet ref={sheetRef} snapPoints={snapPoints}>
        <View className="h-full p-2">
          <TextInput></TextInput>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Trip;
