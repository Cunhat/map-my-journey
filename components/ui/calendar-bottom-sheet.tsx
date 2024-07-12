import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { CalendarList, DateData } from "react-native-calendars";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CalendarListPicker } from "./calendar-list";
import dayjs from "dayjs";

type CalendarBottomSheetProps = {
  inputIcon: React.ReactNode;
  inputPlaceholder: string;
  date: { startDate: string | undefined; endDate: string | undefined };
  setDate: React.Dispatch<React.SetStateAction<any>>;
  bottomSheetTitle: string;
};

export const CalendarBottomSheet: React.FC<CalendarBottomSheetProps> = ({
  inputIcon,
  inputPlaceholder,
  date,
  setDate,
  bottomSheetTitle,
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
            <Text className="text-gray-500 text-base">to</Text>
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
          <View
            style={{ gap: 6 }}
            className="flex-row items-center justify-center"
          >
            {inputIcon}
            <Text className="text-xl text-gray-700">{bottomSheetTitle}</Text>
          </View>
          <CalendarListPicker date={date} setDate={setDate} />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};
