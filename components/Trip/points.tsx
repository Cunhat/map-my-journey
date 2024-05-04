import Empty from "@/assets/svg/empty";
import { Tables } from "@/lib/types/supabase";
import React from "react";
import { View, Text } from "react-native";
import {
  PointsList,
  PointsListItem,
  PointsListSeparator,
} from "@/components/points-list";
import Calendar from "@/assets/svg/calendar";

type PointsProps = {
  points: Array<Tables<"point"> & { category: Tables<"category"> }>;
  tripDays: number;
  focusPoint: (lat: number, lng: number) => void;
};

export const Points: React.FC<PointsProps> = ({
  points,
  tripDays,
  focusPoint,
}) => {
  if (points?.length === 0)
    return (
      <View style={{ gap: 12 }} className="flex-1">
        <View className="flex-1 justify-center items-center">
          <Empty height={"80%"} width={"80%"} />
          <Text className="text-gray-400 text-xl">No points...</Text>
        </View>
      </View>
    );

  return (
    <View style={{ gap: 12 }} className="flex-1">
      <Text className="text-sky-500 text-xl">Points</Text>
      <PointsList>
        {Array(tripDays)
          .fill(0)
          .map((_, i) => (
            <View key={i} style={{ gap: 12 }}>
              <View style={{ gap: 8 }} className="flex-row items-center p-2">
                <Calendar height={24} width={24} />
                <Text className="text-gray-500 font-bold text-lg">
                  Day {i + 1}
                </Text>
              </View>
              <PointsByDay
                focusPoint={focusPoint}
                points={points?.filter((point) => point.day === i + 1)}
              />
            </View>
          ))}
      </PointsList>
    </View>
  );
};

const PointsByDay: React.FC<Omit<PointsProps, "tripDays">> = ({
  points,
  focusPoint,
}) => {
  if (points?.length === 0)
    return (
      <View style={{ gap: 12 }} className="flex-1">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-300 text-base">
            No points for this day...
          </Text>
        </View>
      </View>
    );

  return (
    <View className="bg-gray-100 rounded-xl p-2">
      {points.map((point, index) => (
        <React.Fragment key={point.id}>
          <PointsListItem point={point} focusPoint={focusPoint} />
          {index < points?.length! - 1 && <PointsListSeparator />}
        </React.Fragment>
      ))}
    </View>
  );
};
