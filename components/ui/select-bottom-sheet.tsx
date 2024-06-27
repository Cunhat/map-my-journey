import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

type SelectBottomSheetProps = {
  icon: React.ReactNode;
  label: string;
  selectTitle: string;
  selectValues: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
    id: number | string;
  }>;
  value: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    id: number | string;
  } | null;
  onSelect: (value: any) => void;
};

export const SelectBottomSheet: React.FC<SelectBottomSheetProps> = ({
  icon,
  label,
  selectTitle,
  selectValues,
  value,
  onSelect,
}) => {
  const ref = React.useRef<BottomSheetModal>(null);

  const snapPoints = React.useMemo(() => ["60%"], []);

  return (
    <>
      <TouchableOpacity
        onPress={() => ref.current?.present()}
        style={{ gap: 8 }}
        className="h-12 bg-gray-100 rounded-xl flex-row items-center pl-3"
      >
        {icon}
        {value ? (
          <View className="flex-row items-center" style={{ gap: 8 }}>
            {value.icon}
            <Text className="text-gray-500 text-base">{value.label}</Text>
          </View>
        ) : (
          <Text className="text-gray-500 text-base">{label}</Text>
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
          <View className="items-center justify-center">
            <Text className="text-xl text-gray-500">{selectTitle}</Text>
          </View>
          <ScrollView
            contentContainerStyle={{ gap: 12, paddingTop: 16, height: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            {selectValues?.map((item, index) => (
              <>
                {index === 0 && <View className="h-[0.5px] bg-gray-200"></View>}
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    onSelect(item);
                    ref.current?.close();
                  }}
                  style={{ gap: 8 }}
                  className="flex-row items-center pl-6 py-2"
                >
                  {item.icon}
                  <Text className="text-gray-500 text-base">{item.label}</Text>
                </TouchableOpacity>

                <View className="h-[0.5px] bg-gray-200"></View>
              </>
            ))}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};
