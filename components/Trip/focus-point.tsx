import { Tables } from "@/lib/types/supabase";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Check, Navigation, X } from "lucide-react-native";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { showLocation } from "react-native-map-link";
import { useSharedValue } from "react-native-reanimated";
import { Button } from "../ui/button";
import { LocationTitle } from "../ui/location-title";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/clerk-expo";

type FocusPointProps = {
  point: Tables<"point"> & { category: Tables<"category"> };
  onModelClose: () => void;
};

export const FocusPoint = React.forwardRef<BottomSheetModal, FocusPointProps>(
  ({ point, onModelClose }, ref) => {
    const { getToken } = useAuth();

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

    const animatedContentHeight = useSharedValue(0);

    const queryClient = useQueryClient();

    const visitedPointMutation = useMutation({
      mutationFn: async (mutationData: {
        pointId: number;
        visited: boolean;
      }) => {
        const token = await getToken({ template: "routes-app-supabase" });

        const supabase = await supabaseClient(token!);

        const resp = await supabase
          .from("point")
          .update({
            visited: mutationData.visited,
          })
          .eq("id", mutationData.pointId)
          .select();

        return resp;
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getTripPoints", point.trip_id.toString()],
        });
      },
      onError: (err) => {
        console.log("err", err);
      },
    });

    return (
      <BottomSheetModal
        animateOnMount
        ref={ref}
        enableDynamicSizing
        contentHeight={animatedContentHeight}
        handleIndicatorStyle={{
          backgroundColor: "#6b7280",
          width: 40,
          height: 0,
        }}
        onDismiss={onModelClose}
      >
        <BottomSheetView>
          <View style={{ gap: 12 }} className="flex-1 pb-4">
            <View style={{ gap: 12 }} className="flex-row items-center px-3">
              <View
                style={{ backgroundColor: point?.category?.color }}
                className="h-10 w-10 rounded-full justify-center items-center"
              >
                <Text className="text-2xl">{point?.category?.icon}</Text>
              </View>
              <LocationTitle title={point?.name} />
              <View>
                <TouchableOpacity
                  className=" rounded-full p-1 bg-gray-100 items-center justify-center"
                  onPress={() => {
                    onModelClose();
                    ref?.current?.close();
                  }}
                >
                  <X className="text-gray-500" height={24} width={24}></X>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ gap: 12 }} className="flex-1 justify-center p-3">
              <Button
                icon={
                  !point?.visited ? (
                    <Check className="text-white" height={20} width={20} />
                  ) : (
                    <X className="text-white" height={20} width={20} />
                  )
                }
                title={point?.visited ? "Not visited" : "Visited"}
                onPress={() =>
                  visitedPointMutation.mutate({
                    pointId: point.id,
                    visited: !point?.visited,
                  })
                }
                type={!point?.visited ? "success" : "danger"}
                fullWidth
              />
              <Button
                icon={
                  <Navigation className="text-white" height={20} width={20} />
                }
                title="Directions"
                onPress={handleDirections}
                type="primary"
                fullWidth
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
