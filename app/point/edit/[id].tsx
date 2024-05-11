import { Button } from "@/components/ui/button";
import { FullPageLoading } from "@/components/ui/loading";
import { Select } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Database, Tables } from "@/lib/types/supabase";
import { createDecrementArray } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { CalendarDays, Save, Tag, X } from "lucide-react-native";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const EditPoint: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<{
    title: string;
    icon?: { isCategory?: boolean; icon: string; color: string };
    id: number;
  }>();
  const [selectedDay, setSelectedDay] = React.useState<{ title: string }>();
  const { tripId, id } = useLocalSearchParams<{ tripId: string; id: string }>();

  const queryClient = useQueryClient();

  const categories = useQuery({
    queryKey: ["getCategories", id],
    queryFn: async () => {
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
        title: point?.data[0]?.category?.name,
        id: point?.data[0]?.category?.id,
        icon: {
          color: point?.data[0]?.category?.color,
          icon: point?.data[0]?.category?.icon,
          isCategory: true,
        },
      });
      setSelectedDay({ title: point?.data[0]?.day?.toString() });
    }
  }, [point.isSuccess]);

  const updateTripPointMutation = useMutation({
    mutationFn: async (
      point: Omit<
        Database["public"]["Tables"]["point"]["Update"],
        "user_id" | "id" | "trip_id"
      >
    ) => {
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
      day: parseInt(selectedDay?.title ?? "0"),
      category_id: selectedCategory?.id ?? 0,
    });
  };

  return (
    <View style={{ gap: 24 }} className="flex-1 p-3 bg-white">
      <View className="flex-row items-center">
        <View className="flex-1">
          {point && point.data && (
            <Text className="text-xl text-gray-500 ">
              {point?.data[0]?.name}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className=" rounded-full p-1 bg-gray-100 items-center justify-center"
          onPress={() => router.navigate("/trip/" + tripId)}
        >
          <X className="text-gray-500" height={24} width={24}></X>
        </TouchableOpacity>
      </View>
      <View className="justify-between flex-1">
        <View style={{ gap: 24 }}>
          <Select
            placeholder="Select category..."
            decorationIcon={
              <Tag className="text-gray-500" height={20} width={20} />
            }
            defaultValue={selectedCategory}
            data={
              categories?.data?.map((item) => {
                return {
                  title: item.name,
                  id: item.id,
                  icon: {
                    color: item.color,
                    icon: item.icon,
                    isCategory: true,
                  },
                };
              }) ?? []
            }
            onSelect={(value) => setSelectedCategory(value)}
          />
          <Select
            decorationIcon={
              <CalendarDays className="text-gray-500" height={20} width={20} />
            }
            defaultValue={selectedDay}
            placeholder="Select the day you want to visit..."
            data={createDecrementArray(trip?.data?.days ?? 0)}
            onSelect={(value) => setSelectedDay(value)}
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
  );
};

export default EditPoint;
