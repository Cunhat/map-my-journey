import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { CalendarList, DateData } from "react-native-calendars";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CalendarListPicker } from "./calendar-list";

type CalendarBottomSheetProps = {
  inputIcon: React.ReactNode;
  inputPlaceholder: string;
  value: any;
  bottomSheetTitle: string;
};

export const CalendarBottomSheet: React.FC<CalendarBottomSheetProps> = ({
  inputIcon,
  inputPlaceholder,
  value,
  bottomSheetTitle,
}) => {
  const ref = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["70%"], []);

  return (
    <>
      <TouchableOpacity
        onPress={() => ref.current?.present()}
        style={{ gap: 8 }}
        className="h-12 bg-gray-100 rounded-xl flex-row items-center pl-1.5"
      >
        {inputIcon}
        {value ? (
          <View className="flex-row items-center" style={{ gap: 8 }}>
            {value.icon}
            <Text className="text-gray-500 text-base">{value.label}</Text>
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
          {/* <ScrollView
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: 70,
            }}
            showsVerticalScrollIndicator={false}
          > */}
          <CalendarListPicker horizontalView={true} />
          {/* </ScrollView> */}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};
