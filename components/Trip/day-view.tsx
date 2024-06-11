import { Tables } from "@/lib/types/supabase";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  PointsList,
  PointsListItem,
  PointsListSeparator,
} from "../points-list";
import { PointsByDay } from "./points";
import Calendar from "@/assets/svg/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { cva } from "class-variance-authority";

type DayViewProps = {
  onDayClose: () => void;
  points: Array<Tables<"point"> & { category: Tables<"category"> }> | [];
  day: number;
  maxDays: number;
  changeDay: React.Dispatch<React.SetStateAction<number>>;
};

const SwipeArrow = cva(
  "rounded-full p-1 bg-gray-100 items-center justify-center",
  {
    variants: {
      disabled: {
        true: "opacity-20",
        false: "opacity-100",
      },
    },
  }
);

export const DayView = React.forwardRef<BottomSheetModal, DayViewProps>(
  ({ onDayClose, points, day, maxDays, changeDay }, ref) => {
    const snapPoints = React.useMemo(() => ["30%", "88%"], []);

    return (
      <BottomSheetModal
        animateOnMount
        ref={ref}
        snapPoints={snapPoints}
        handleIndicatorStyle={{
          backgroundColor: "#6b7280",
          width: 40,
        }}
        onDismiss={onDayClose}
      >
        <BottomSheetView>
          <View style={{ gap: 16 }} className="p-3">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                className={SwipeArrow({ disabled: day - 1 === 0 })}
                disabled={day - 1 === 0}
                onPress={() => changeDay(day - 1)}
              >
                <ChevronLeft height={24} width={24} className="text-gray-500" />
              </TouchableOpacity>

              <View style={{ gap: 4 }} className="flex flex-row items-center">
                <Calendar height={24} width={24} />
                <Text className="text-gray-500 font-bold text-lg">
                  Day {day}
                </Text>
              </View>
              <TouchableOpacity
                className={SwipeArrow({ disabled: day >= maxDays })}
                disabled={day >= maxDays}
                onPress={() => changeDay(day + 1)}
              >
                <ChevronRight
                  height={24}
                  width={24}
                  className="text-gray-500"
                />
              </TouchableOpacity>
            </View>

            <PointsList>
              <PointsByDay points={points} />
            </PointsList>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
