import Empty from "@/assets/svg/empty";
import { Tables } from "@/lib/types/supabase";
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  PointsList,
  PointsListItem,
  PointsListSeparator,
} from "@/components/points-list";
import Calendar from "@/assets/svg/calendar";
import { ChevronDown } from "lucide-react-native";
import { cva } from "class-variance-authority";

type PointsProps = {
  points: Array<Tables<"point"> & { category: Tables<"category"> }>;
  tripDays: number;
  focusPoint: (
    point: Tables<"point"> & { category: Tables<"category"> }
  ) => void;
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
          .map((_, i) => {
            const filterPoints = [
              ...points?.filter((point) => point.day === i + 1),
            ];

            return (
              <Day
                points={filterPoints}
                focusPoint={focusPoint}
                day={i}
                key={i}
              />
            );
          })}
      </PointsList>
    </View>
  );
};

const expandedStyles = cva("text-gray-500", {
  variants: {
    expanded: {
      true: "rotate-180",
      false: "rotate-0 rotation-180",
    },
  },
});

const Day: React.FC<Omit<PointsProps, "tripDays"> & { day: number }> = ({
  points,
  focusPoint,
  day,
}) => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <View style={{ gap: 12 }}>
      <View className="flex flex-row items-center justify-between">
        <View style={{ gap: 8 }} className="flex-row items-center p-2">
          <Calendar height={24} width={24} />
          <Text className="text-gray-500 font-bold text-lg">Day {day + 1}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          className="flex-row items-center justify-center"
        >
          <View
            style={{ backgroundColor: "#e5e7eb" }}
            className="h-7 w-7 rounded-full justify-center items-center"
          >
            <ChevronDown
              height={20}
              width={20}
              className={expandedStyles({ expanded })}
            />
          </View>
        </TouchableOpacity>
      </View>
      {expanded && <PointsByDay focusPoint={focusPoint} points={points} />}
    </View>
  );
};

const PointsByDay: React.FC<Omit<PointsProps, "tripDays">> = ({
  points,
  focusPoint,
}) => {
  if (points?.length === 0)
    return (
      <View className="justify-center items-center">
        <Text className="text-gray-300 text-base">
          No points for this day...
        </Text>
      </View>
    );

  return (
    <View style={{ gap: 6 }} className="bg-gray-100 rounded-xl p-2">
      {points.map((point, index) => (
        <React.Fragment key={point.id}>
          <PointsListItem point={point} focusPoint={focusPoint} />
          {index < points?.length! - 1 && <PointsListSeparator />}
        </React.Fragment>
      ))}
    </View>
  );
};
