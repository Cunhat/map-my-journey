import { Tables } from "@/lib/types/supabase";
import { CurrentMarker } from "@/lib/types/types";
import { Check, icons } from "lucide-react-native";
import React, { useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { Text, View } from "react-native";

type TripMapProps = {
  points: Array<Tables<"point"> & { category: Tables<"category"> }>;
  currentMarker?: CurrentMarker;
  tripLocation: {
    latitude: number;
    longitude: number;
  };
  onPointPress: (
    point: Tables<"point"> & { category: Tables<"category"> }
  ) => void;
};

export const TripMap = React.forwardRef<MapView, TripMapProps>(
  ({ points, currentMarker, tripLocation, onPointPress }, ref) => {
    return (
      <MapView
        className="h-full"
        showsUserLocation
        zoomEnabled
        initialRegion={{
          latitude: tripLocation?.latitude,
          longitude: tripLocation?.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        // provider="google"
        ref={ref}
      >
        {points?.map((marker, index) => {
          return (
            <Marker
              key={marker.id}
              style={{
                backgroundColor: marker?.category?.color,
                borderRadius: 20,
              }}
              className="h-10 w-10 items-center justify-center"
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              onPress={() => onPointPress(marker)}
            >
              <Text className="text-2xl">{marker.category.icon}</Text>
              {marker.visited && (
                <View className="absolute -bottom-1 -right-1 rounded-full bg-green-600 p-1 items-center justify-center">
                  <Check className="text-white" height={10} width={10} />
                </View>
              )}
            </Marker>
          );
        })}
        {currentMarker && (
          <Marker
            icon={34}
            key={"currentMarker"}
            coordinate={{
              latitude: currentMarker.latitude,
              longitude: currentMarker.longitude,
            }}
          />
        )}
      </MapView>
    );
  }
);
