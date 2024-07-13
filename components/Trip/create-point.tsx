import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { supabaseClient } from "@/lib/supabase";
import { Database, Tables } from "@/lib/types/supabase";
import { createDaysArray, getDates } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-expo";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Pin, Tag, X } from "lucide-react-native";
import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { DynamicBottomSheet } from "../ui/dynamic-bottom-sheet";
import { LocationTitle } from "../ui/location-title";
import { SelectBottomSheet, SelectDataType } from "../ui/select-bottom-sheet";
import { CategoryIcon } from "../ui/category-icon";
import Calendar from "@/assets/svg/calendar";

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
  startDate: string;
  endDate: string;
};

export const CreatePoint: React.FC<CreatePointProps> = ({
  addPointBottomSheet,
  setAddPointBottomSheet,
  point,
  categories,
  numberOfDays,
  tripId,
  closeModelAndClearCurrentMarker,
  startDate,
  endDate,
}) => {
  const addPointRef = useRef<BottomSheet>(null);
  const [selectedCategory, setSelectedCategory] =
    React.useState<SelectDataType>();
  const [selectedDay, setSelectedDay] = React.useState<SelectDataType>();

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
          date: point.date,
          day: 1,
          user_id: userId!,
          latitude: point.latitude,
          longitude: point.longitude,
          trip_id: point.trip_id,
          category_id: point.category_id,
        })
        .select();

      console.log("resp", resp);

      return resp;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTripPoints", tripId],
      });
      closeModal();
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const closeModal = () => {
    setSelectedCategory(undefined);
    setSelectedDay(undefined);
    closeModelAndClearCurrentMarker();
  };

  if (!addPointBottomSheet || !isLoaded) return null;

  const handleSubmit = () => {
    console.log("selectedDay", selectedDay);
    createTripPointMutation.mutate({
      name: point.name,
      // day: selectedDay?.value ?? 0,
      date: selectedDay?.value ?? 0,
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
            onPress={() => closeModal()}
          >
            <X className="text-gray-500" height={24} width={24}></X>
          </TouchableOpacity>
        </View>

        <SelectBottomSheet
          inputIcon={<Tag className="text-gray-600" height={20} width={20} />}
          inputPlaceholder="Select the category..."
          bottomSheetTitle="Select the category"
          data={
            categories?.map((item) => {
              return {
                label: item.name,
                id: item.id,
                value: item.name,
                icon: (
                  <CategoryIcon
                    category={{ icon: item.icon, color: item.color }}
                  />
                ),
              };
            }) ?? []
          }
          onSelect={(value) => setSelectedCategory(value)}
          value={selectedCategory}
        />
        <SelectBottomSheet
          inputIcon={
            <Calendar height={24} width={24} /> // <CalendarDays className="text-gray-500" height={20} width={20} />
          }
          inputPlaceholder="Select date..."
          bottomSheetTitle="Select date"
          data={getDates(startDate, endDate)}
          onSelect={(value) => setSelectedDay(value)}
          value={selectedDay}
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
