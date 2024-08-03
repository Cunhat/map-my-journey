import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import { MoveRight, X } from "lucide-react-native";
import { useMemo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CalendarListPicker } from "./calendar-list";
import { Button } from "./button";

type CalendarBottomSheetProps = {
  inputIcon: React.ReactNode;
  inputPlaceholder: string;
  date: { startDate: string | undefined; endDate: string | undefined };
  setDate: React.Dispatch<React.SetStateAction<any>>;
};

export const CalendarBottomSheet: React.FC<CalendarBottomSheetProps> = ({
  inputIcon,
  inputPlaceholder,
  date,
  setDate,
}) => {
  const ref = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["85%"], []);

  const startDate = date?.startDate
    ? dayjs(date?.startDate).format("DD/MM/YYYY")
    : "";
  const endDate = date?.endDate
    ? dayjs(date?.endDate).format("DD/MM/YYYY")
    : "";

  return (
    <>
      <TouchableOpacity
        onPress={() => ref.current?.present()}
        style={{ gap: 8 }}
        className="h-12 bg-gray-100 rounded-xl flex-row items-center pl-1.5"
      >
        {inputIcon}
        {date.startDate && date.endDate ? (
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Text className="text-gray-500 text-base">{startDate}</Text>
            <MoveRight className="text-gray-500" height={14} width={14} />
            <Text className="text-gray-500 text-base">{endDate}</Text>
          </View>
        ) : (
          <Text className="text-gray-300 text-base">{inputPlaceholder}</Text>
        )}
      </TouchableOpacity>
      <BottomSheetModal
        animateOnMount
        ref={ref}
        snapPoints={snapPoints}
        handleIndicatorStyle={{
          height: 0,
        }}
        onDismiss={() => ref.current?.collapse()}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
            {...props}
          />
        )}
      >
        <BottomSheetView className="flex flex-col">
          <View style={{ gap: 6 }} className="flex-row items-center px-3">
            <View className="flex-row items-center ml-auto" style={{ gap: 8 }}>
              {date.startDate && (
                <Text className="text-base text-gray-700">
                  {dayjs(date.startDate).format("D MMM")}
                </Text>
              )}
              {date.endDate && (
                <MoveRight className="text-gray-500" height={14} width={14} />
              )}
              {date?.endDate && (
                <Text className="text-base text-gray-700">
                  {dayjs(date.endDate).format("D MMM")}
                </Text>
              )}
            </View>
            <TouchableOpacity
              className=" rounded-full p-1 bg-gray-100 items-center justify-center ml-auto"
              onPress={() => ref.current?.dismiss()}
            >
              <X className="text-gray-500" height={24} width={24}></X>
            </TouchableOpacity>
          </View>

          <CalendarListPicker date={date} setDate={setDate} />
        </BottomSheetView>
        {startDate && endDate && (
          <View className="absolute bottom-10 w-full flex-row items-center justify-center">
            <Button title="Set Dates" onPress={() => ref.current?.dismiss()} />
          </View>
        )}
      </BottomSheetModal>
    </>
  );
};
