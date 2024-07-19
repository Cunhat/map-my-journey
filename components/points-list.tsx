import React, { PropsWithChildren, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  Search,
  Plus,
  Home,
  UtensilsCrossed,
  icons,
  Crosshair,
  Check,
} from "lucide-react-native";
import Calendar from "@/assets/svg/calendar";
import { Tables } from "@/lib/types/supabase";
import SwipeableRow from "./ui/swipeable-row";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { supabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/clerk-expo";

export const PointsList: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ScrollView
      contentContainerStyle={{ gap: 12 }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

type PointsListItemProps = {
  point: Tables<"point"> & { category: Tables<"category"> };
  focusPoint: (
    point: Tables<"point"> & { category: Tables<"category"> }
  ) => void;
};

export const PointsListItem: React.FC<PointsListItemProps> = ({
  point,
  focusPoint,
}) => {
  const location = point.name.split(", ");
  const mainLocation = location[0];
  location.shift();
  const subLocation = location.join(", ");
  const { getToken, userId, isLoaded } = useAuth();

  const queryClient = useQueryClient();

  const deletePointMutation = useMutation({
    mutationFn: async (pointId: number) => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token!);

      const resp = await supabase
        .from("point")
        .delete()
        .eq("id", pointId)
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

  const visitedPointMutation = useMutation({
    mutationFn: async (mutationData: { pointId: number; visited: boolean }) => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token!);

      const resp = await supabase
        .from("point")
        .update({
          visited: mutationData.visited,
        })
        .eq("id", mutationData.pointId)
        .select();

      console.log("resp", resp);

      return resp;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTripPoints", point.trip_id.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["getTrip", point.trip_id.toString()],
      });
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const handleDelete = () => {
    deletePointMutation.mutate(point.id);
  };

  return (
    <SwipeableRow
      onDelete={() => deletePointMutation.mutate(point.id)}
      onEdit={() =>
        router.navigate(
          `point/edit/${point.id}?tripId=${point.trip_id.toString()}`
        )
      }
      onVisited={() =>
        visitedPointMutation.mutate({
          pointId: point.id,
          visited: !point.visited,
        })
      }
      visited={point.visited ?? false}
    >
      <View
        style={{ gap: 12 }}
        className="flex-row items-center p-2 bg-gray-100"
      >
        <View
          style={{ backgroundColor: point.category.color }}
          className="rounded-full h-10 w-10 items-center justify-center relative"
        >
          <Text className="text-2xl">{point.category.icon}</Text>
          {point.visited && (
            <View className="absolute -bottom-1 -right-1 rounded-full bg-green-600 p-1 items-center justify-center">
              <Check className="text-white" height={10} width={10} />
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-gray-500 font-bold text-base">
            {mainLocation}
          </Text>
          <Text className="text-gray-500">{subLocation}</Text>
        </View>
        <View className="items-center justify-center">
          <TouchableOpacity onPress={() => focusPoint(point)}>
            <Crosshair height={24} width={24} className="text-gray-500" />
          </TouchableOpacity>
        </View>
      </View>
    </SwipeableRow>
  );
};

export const PointsListSeparator = () => {
  return <View className="h-[0.5px] bg-gray-300"></View>;
};
