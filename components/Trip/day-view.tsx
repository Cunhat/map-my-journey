import Calendar from "@/assets/svg/calendar";
import { Tables } from "@/lib/types/supabase";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { cva } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PointsList } from "../points-list";
import { PointsByDay } from "./points";
import dayjs from "dayjs";

type DayViewProps = {
  onDayClose: () => void;
  points: Array<Tables<"point"> & { category: Tables<"category"> }> | [];
  day: string;
  maxDay: string;
  minDay: string;
  changeDay: React.Dispatch<React.SetStateAction<string>>;
  handleFocusPoint: (
    point: Tables<"point"> & { category: Tables<"category"> }
  ) => void;
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
  (
    { onDayClose, points, day, maxDay, changeDay, handleFocusPoint, minDay },
    ref
  ) => {
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
                className={SwipeArrow({
                  disabled: dayjs(day).isSame(dayjs(minDay)),
                })}
                disabled={dayjs(day).isSame(dayjs(minDay))}
                onPress={() => {
                  changeDay(
                    dayjs(day)
                      .subtract(1, "day")
                      .format("YYYY-MM-DD")
                      .toString()
                  );
                }}
              >
                <ChevronLeft height={24} width={24} className="text-gray-500" />
              </TouchableOpacity>

              <View style={{ gap: 4 }} className="flex flex-row items-center">
                <Calendar height={24} width={24} />
                <Text className="text-gray-500 font-bold text-lg">
                  {dayjs(day).format("D MMMM")}
                </Text>
              </View>
              <TouchableOpacity
                className={SwipeArrow({
                  disabled: dayjs(day).isSame(dayjs(maxDay)),
                })}
                disabled={dayjs(day).isSame(dayjs(maxDay))}
                onPress={() =>
                  changeDay(
                    dayjs(day).add(1, "day").format("YYYY-MM-DD").toString()
                  )
                }
              >
                <ChevronRight
                  height={24}
                  width={24}
                  className="text-gray-500"
                />
              </TouchableOpacity>
            </View>
            <PointsList>
              <PointsByDay points={points} focusPoint={handleFocusPoint} />
            </PointsList>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
