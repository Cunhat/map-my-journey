import Calendar from "@/assets/svg/calendar";
import Empty from "@/assets/svg/empty";
import {
  PointsList,
  PointsListItem,
  PointsListSeparator,
} from "@/components/points-list";
import { Tables } from "@/lib/types/supabase";
import { getDates } from "@/lib/utils";
import { cva } from "class-variance-authority";
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type PointsProps = {
  points: Array<Tables<"point"> & { category: Tables<"category"> }>;
  focusPoint: (
    point: Tables<"point"> & { category: Tables<"category"> }
  ) => void;
  onDayOpen?: (day: string) => void;
  startDate: string;
  endDate: string;
};

export const Points: React.FC<PointsProps> = ({
  points,
  focusPoint,
  onDayOpen,
  startDate,
  endDate,
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

  const days = getDates(startDate, endDate);

  return (
    <View style={{ gap: 12 }} className="flex-1">
      <Text className="text-sky-500 text-xl">Points</Text>
      <PointsList>
        {days.map((day) => {
          const filterPoints = [
            ...points?.filter((point) => point?.date === day?.value),
          ];

          return (
            <Day
              points={filterPoints}
              focusPoint={focusPoint}
              day={day.value}
              key={day.value}
              onDayOpen={onDayOpen}
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

const Day: React.FC<Omit<PointsProps, "tripDays"> & { day: string }> = ({
  points,
  focusPoint,
  day,
  onDayOpen,
}) => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <View style={{ gap: 12 }}>
      <View className="flex flex-row items-center justify-between">
        <TouchableOpacity
          style={{ gap: 8 }}
          onPress={() => onDayOpen && onDayOpen(day)}
          className="flex-row items-center p-2"
        >
          <Calendar height={24} width={24} />
          <Text className="text-gray-500 font-bold text-lg">
            {dayjs(day).utc(true).format("D MMMM")}
          </Text>
        </TouchableOpacity>
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

export const PointsByDay: React.FC<Omit<PointsProps, "tripDays">> = ({
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
