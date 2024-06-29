import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/ui/category-icon";
import { FullPageLoading } from "@/components/ui/loading";
import { LocationTitle } from "@/components/ui/location-title";
import { Select } from "@/components/ui/select";
import {
  SelectBottomSheet,
  SelectDataType,
} from "@/components/ui/select-bottom-sheet";
import { supabaseClient } from "@/lib/supabase";

import { Database, Tables } from "@/lib/types/supabase";
import { createDaysArray } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-expo";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { CalendarDays, Save, Tag, X } from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity, View, Text, SafeAreaView } from "react-native";

const EditPoint: React.FC = () => {
  const { tripId, id } = useLocalSearchParams<{ tripId: string; id: string }>();
  const { getToken, userId, isLoaded } = useAuth();
  const [selectedDay, setSelectedDay] = React.useState<SelectDataType>();
  const [selectedCategory, setSelectedCategory] =
    React.useState<SelectDataType>();
  const queryClient = useQueryClient();

  const categories = useQuery({
    queryKey: ["getCategories", id],
    queryFn: async () => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token!);

      const resp = await supabase
        .from("category")
        .select("*")
        .eq("tripId", tripId);

      return resp.data;
    },
  });

  const trip = useQuery({
    queryKey: ["getNumberOfDays", id],
    queryFn: async () => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token!);

      const resp = await supabase
        .from("trip")
        .select("*")
        .eq("id", tripId)
        .single();

      return resp.data;
    },
  });

  const point = useQuery({
    queryKey: ["getPoint", id],
    queryFn: async () => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token!);

      const resp = await supabase
        .from("point")
        .select(`*, category("*")`)
        .eq("id", id)
        .returns<Array<Tables<"point"> & { category: Tables<"category"> }>>();

      return resp.data;
    },
  });

  useEffect(() => {
    if (point.isSuccess && point.data) {
      setSelectedCategory({
        label: point?.data[0]?.category?.name,
        id: point?.data[0]?.category?.id,
        value: point?.data[0]?.category?.name,
        icon: (
          <CategoryIcon
            category={{
              icon: point?.data[0]?.category?.icon,
              color: point?.data[0]?.category?.color,
            }}
          />
        ),
      });
      const days = createDaysArray(trip?.data?.days ?? 0);
      setSelectedDay(
        days.find((day) => day.value === point?.data[0]?.day?.toString())
      );
    }
  }, [point.isSuccess]);

  const updateTripPointMutation = useMutation({
    mutationFn: async (
      point: Omit<
        Database["public"]["Tables"]["point"]["Update"],
        "user_id" | "id" | "trip_id"
      >
    ) => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token!);

      return await supabase
        .from("point")
        .update({
          day: point.day,
          category_id: point.category_id,
        })
        .eq("id", id)
        .select();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTripPoints", tripId],
      });
      router.navigate("/trip/" + tripId);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  if (categories.isPending || point.isPending) return <FullPageLoading />;

  const handleSubmit = () => {
    updateTripPointMutation.mutate({
      day: parseInt(selectedDay?.label ?? "0"),
      category_id: selectedCategory?.id ?? 0,
    });
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View style={{ gap: 24 }} className="flex-1 p-3 bg-white">
        <View className="flex-row items-center">
          <LocationTitle title={point?.data[0]?.name} />
          <TouchableOpacity
            className=" rounded-full p-1 bg-gray-100 items-center justify-center"
            onPress={() => router.navigate("/trip/" + tripId)}
          >
            <X className="text-gray-500" height={24} width={24}></X>
          </TouchableOpacity>
        </View>
        <View className="justify-between flex-1">
          <View style={{ gap: 24 }}>
            <SelectBottomSheet
              inputIcon={
                <CalendarDays
                  className="text-gray-500"
                  height={20}
                  width={20}
                />
              }
              inputPlaceholder="Select the category..."
              bottomSheetTitle="Select the category"
              data={createDaysArray(trip?.data?.days ?? 0)}
              onSelect={(value) => setSelectedDay(value)}
              value={selectedDay}
            />
            <SelectBottomSheet
              inputIcon={
                <Tag className="text-gray-600" height={20} width={20} />
              }
              inputPlaceholder="Select the category..."
              bottomSheetTitle="Select the category"
              data={
                categories?.data?.map((item) => {
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
          </View>
        </View>
        <View className="h-auto pb-10">
          <Button
            title="Update"
            type="primary"
            fullWidth
            onPress={handleSubmit}
            icon={<Save className="text-white" height={20} width={20} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditPoint;
