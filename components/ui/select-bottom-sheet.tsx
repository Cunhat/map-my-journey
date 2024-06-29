import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { cva } from "class-variance-authority";
import { CircleCheck } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

type SelectBottomSheetProps = {
  inputIcon: React.ReactNode;
  inputPlaceholder: string;
  bottomSheetTitle: string;
  data: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
    id: number | string;
  }>;
  value:
    | {
        label: string;
        value: string;
        icon?: React.ReactNode;
        id: number | string;
      }
    | undefined;
  onSelect: (value: any) => void;
};

export type SelectDataType = SelectBottomSheetProps["data"][0];

export const SelectBottomSheet: React.FC<SelectBottomSheetProps> = ({
  inputIcon,
  inputPlaceholder,
  bottomSheetTitle,
  data,
  value,
  onSelect,
}) => {
  const ref = React.useRef<BottomSheetModal>(null);

  const snapPoints = React.useMemo(() => ["60%"], []);

  const onItemSelect = (value: SelectBottomSheetProps["value"]) => {
    onSelect(value);
    ref.current?.close();
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => ref.current?.present()}
        style={{ gap: 8 }}
        className="h-12 bg-gray-100 rounded-xl flex-row items-center pl-3"
      >
        {inputIcon}
        {value ? (
          <View className="flex-row items-center" style={{ gap: 8 }}>
            {value.icon}
            <Text className="text-gray-500 text-base">{value.label}</Text>
          </View>
        ) : (
          <Text className="text-gray-500 text-base">{inputPlaceholder}</Text>
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
          <ScrollView
            contentContainerStyle={{ paddingTop: 16, height: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            {data?.map((item, index) => (
              <React.Fragment key={item.id}>
                {index === 0 && <Separator />}
                <SelectBottomSheetItem
                  data={item}
                  onSelect={onItemSelect}
                  isSelected={item.id === value?.id}
                />
                <Separator />
              </React.Fragment>
            ))}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

const Separator: React.FC = () => {
  return <View className="h-[1px] bg-gray-200"></View>;
};

type SelectBottomSheetItemProps = {
  data: SelectBottomSheetProps["value"];
  onSelect: (value: SelectBottomSheetProps["value"]) => void;
  isSelected: boolean;
};

const SelectBottomSheetItemStyles = cva(
  "flex-row items-center justify-between px-6 py-4",
  {
    variants: {
      selected: {
        true: "bg-sky-50",
        false: "bg-white",
      },
    },
  }
);

const SelectBottomSheetItem: React.FC<SelectBottomSheetItemProps> = ({
  data,
  onSelect,
  isSelected,
}) => {
  return (
    <TouchableOpacity
      key={data?.id}
      onPress={() => onSelect(data)}
      className={SelectBottomSheetItemStyles({
        selected: isSelected,
      })}
    >
      <View style={{ gap: 8 }} className="flex-row items-center">
        {data?.icon}
        <Text className="text-gray-500 text-base">{data?.label}</Text>
      </View>
      {isSelected && (
        <CircleCheck height={20} width={20} className="text-sky-500" />
      )}
    </TouchableOpacity>
  );
};
