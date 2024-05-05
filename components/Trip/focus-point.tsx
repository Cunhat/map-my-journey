import { Tables } from "@/lib/types/supabase";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { X, icons } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "../ui/button";
import { showLocation } from "react-native-map-link";

type FocusPointProps = {
  point: Tables<"point"> & { category: Tables<"category"> };
  onModelClose: () => void;
};

export const FocusPoint = React.forwardRef<BottomSheetModal, FocusPointProps>(
  ({ point, onModelClose }, ref) => {
    const snapPointsBottom = React.useMemo(() => ["25%"], []);
    const LucideIcon = icons[point?.category?.icon as keyof typeof icons];

    const handleDirections = () => {
      showLocation({
        latitude: point?.latitude ?? 0,
        longitude: point?.longitude ?? 0,
        // sourceLatitude: -8.0870631, // optionally specify starting location for directions
        // sourceLongitude: -34.8941619, // not optional if sourceLatitude is specified
        title: "Open Directions", // optional
        googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
        // googlePlaceId: "ChIJGVtI4by3t4kRr51d_Qm_x58", // optionally specify the google-place-id
        alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
        dialogTitle: "Navigate to your point", // optional (default: 'Open in Maps')
        // dialogMessage: "This is the amazing dialog Message", // optional (default: 'What app would you like to use?')
        cancelText: "Cancel", // optional (default: 'Cancel')
        // appsWhiteList: ["apple-maps", "google-maps", "citymapper", "waze"], // optionally you can set which apps to show (default: will show all supported apps installed on device)
        naverCallerName: "com.example.myapp", // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
        // appTitles: { citymapper: "My custom Google Maps title" }, // optionally you can override default app titles
        // app: "citymapper", // optionally specify specific app to use
        // directionsMode: "walk", // optional, accepted values are 'car', 'walk', 'public-transport' or 'bike'
      });
    };

    return (
      <BottomSheetModal
        animateOnMount
        ref={ref}
        snapPoints={snapPointsBottom}
        handleIndicatorStyle={{
          backgroundColor: "#6b7280",
          width: 40,
        }}
        onDismiss={onModelClose}
      >
        <View className="flex-1">
          <View style={{ gap: 12 }} className="flex-row items-center py-1 px-3">
            <View
              style={{ backgroundColor: point?.category?.color }}
              className="h-10 w-10 rounded-full justify-center items-center"
            >
              <LucideIcon
                strokeWidth={1.2}
                className="text-white"
                height={"50%"}
                width={"50%"}
              />
            </View>
            <View className="flex-1">
              <Text className="text-xl text-gray-500 ">{point?.name}</Text>
            </View>
          </View>
          <View className="flex-1 justify-center p-3">
            <Button
              title="Directions"
              onPress={handleDirections}
              type="primary"
              fullWidth
            />
          </View>
        </View>
      </BottomSheetModal>
    );
  }
);
