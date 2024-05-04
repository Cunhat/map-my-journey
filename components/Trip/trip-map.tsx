import { Tables } from "@/lib/types/supabase";
import { CurrentMarker } from "@/lib/types/types";
import { icons } from "lucide-react-native";
import React, { useRef } from "react";
import MapView, { Marker } from "react-native-maps";

type TripMapProps = {
  points: Array<Tables<"point"> & { category: Tables<"category"> }>;
  currentMarker?: CurrentMarker;
  tripLocation: {
    latitude: number;
    longitude: number;
  };
};

export const TripMap = React.forwardRef<MapView, TripMapProps>(
  ({ points, currentMarker, tripLocation }, ref) => {
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
          const Icon = icons[marker?.category?.icon as keyof typeof icons];

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
            >
              <Icon className="text-white" />
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
