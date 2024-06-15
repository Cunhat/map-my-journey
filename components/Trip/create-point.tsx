import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { supabaseClient } from "@/lib/supabase";
import { Database, Tables } from "@/lib/types/supabase";
import { createDaysArray } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-expo";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Pin, Tag, X } from "lucide-react-native";
import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { DynamicBottomSheet } from "../ui/dynamic-bottom-sheet";
import { LocationTitle } from "../ui/location-title";

type CreatePointProps = {
  addPointBottomSheet: boolean;
  setAddPointBottomSheet: (value: boolean) => void;
  categories: Array<Tables<"category">>;
  numberOfDays: number;
  point: {
    name: string;
    latitude: number;
    longitude: number;
  };
  tripId: string;
  closeModelAndClearCurrentMarker: () => void;
};

export const CreatePoint: React.FC<CreatePointProps> = ({
  addPointBottomSheet,
  setAddPointBottomSheet,
  point,
  categories,
  numberOfDays,
  tripId,
  closeModelAndClearCurrentMarker,
}) => {
  const addPointRef = useRef<BottomSheet>(null);
  const [selectedCategory, setSelectedCategory] =
    React.useState<Tables<"category"> | null>(null);
  const [selectedDay, setSelectedDay] = React.useState<{ title: number }>();
  const snapPointsBottom = React.useMemo(() => ["50%"], []);
  const { getToken, userId, isLoaded } = useAuth();
  const queryClient = useQueryClient();

  const createTripPointMutation = useMutation({
    mutationFn: async (
      point: Omit<Database["public"]["Tables"]["point"]["Insert"], "user_id">
    ) => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token!);

      const resp = await supabase
        .from("point")
        .insert({
          name: point.name,
          day: point.day,
          user_id: userId!,
          latitude: point.latitude,
          longitude: point.longitude,
          trip_id: point.trip_id,
          category_id: point.category_id,
        })
        .select();

      return resp;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTripPoints", tripId],
      });
      closeModelAndClearCurrentMarker();
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  if (!addPointBottomSheet || !isLoaded) return null;

  const handleSubmit = () => {
    createTripPointMutation.mutate({
      name: point.name,
      day: selectedDay?.title ?? 0,
      category_id: selectedCategory?.id ?? 0,
      latitude: point?.latitude,
      longitude: point?.longitude,
      trip_id: parseInt(tripId),
    });
  };

  return (
    <DynamicBottomSheet ref={addPointRef}>
      <View style={{ gap: 24 }} className="flex-1 px-3 pb-3">
        <View style={{ gap: 16 }} className="flex-row items-center ">
          <LocationTitle title={point?.name} />
          <TouchableOpacity
            className=" rounded-full p-1 bg-gray-100 items-center justify-center"
            onPress={() => closeModelAndClearCurrentMarker()}
          >
            <X className="text-gray-500" height={24} width={24}></X>
          </TouchableOpacity>
        </View>

        <Select
          placeholder="Select category..."
          decorationIcon={
            <Tag className="text-gray-500" height={20} width={20} />
          }
          data={categories?.map((item) => {
            return {
              title: item.name,
              id: item.id,
              icon: {
                color: item.color,
                icon: item.icon,
                isCategory: true,
              },
            };
          })}
          onSelect={(value) => setSelectedCategory(value)}
        />
        <Select
          decorationIcon={
            <CalendarDays className="text-gray-500" height={20} width={20} />
          }
          placeholder="Select the day you want to visit..."
          data={createDaysArray(numberOfDays)}
          onSelect={(value) => setSelectedDay(value)}
        />
        <Button
          title="Add Point"
          type="primary"
          fullWidth
          disabled={
            !selectedCategory ||
            !selectedDay ||
            createTripPointMutation.isPending
          }
          onPress={handleSubmit}
          icon={<Pin className="text-white" height={20} width={20} />}
        />
      </View>
    </DynamicBottomSheet>
  );
};
