import { Tables } from "@/lib/types/supabase";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React from "react";
import { View, Text } from "react-native";
import {
  PointsList,
  PointsListItem,
  PointsListSeparator,
} from "../points-list";
import { PointsByDay } from "./points";
import Calendar from "@/assets/svg/calendar";

type DayViewProps = {
  onDayClose: () => void;
  points: Array<Tables<"point"> & { category: Tables<"category"> }>;
};

export const DayView = React.forwardRef<BottomSheetModal, DayViewProps>(
  ({ onDayClose, points }, ref) => {
    const snapPoints = React.useMemo(() => ["30%", "88%"], []);

    console.log(points);

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
          <View style={{ gap: 12 }} className="p-3">
            <View style={{ gap: 4 }} className="flex flex-row items-center">
              <Calendar height={24} width={24} />
              <Text className="text-gray-500 font-bold text-lg">
                Day {points[0]?.day ?? 0}
              </Text>
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
