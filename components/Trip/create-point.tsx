import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Tables } from "@/lib/types/supabase";
import { createDecrementArray } from "@/lib/utils";
import BottomSheet from "@gorhom/bottom-sheet";
import { CalendarDays, Tag, X } from "lucide-react-native";
import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type CreatePointProps = {
  addPointBottomSheet: boolean;
  setAddPointBottomSheet: (value: boolean) => void;
  title: string;
  categories: Array<Tables<"category">>;
  numberOfDays: number;
};

export const CreatePoint: React.FC<CreatePointProps> = ({
  addPointBottomSheet,
  setAddPointBottomSheet,
  title,
  categories,
  numberOfDays,
}) => {
  const addPointRef = useRef<BottomSheet>(null);

  const [index, setIndex] = React.useState(0);

  const snapPointsBottom = React.useMemo(() => ["38%"], []);

  if (!addPointBottomSheet) return null;

  return (
    <BottomSheet
      animateOnMount
      ref={addPointRef}
      index={index}
      snapPoints={snapPointsBottom}
      handleIndicatorStyle={{
        backgroundColor: "#6b7280",
        width: 40,
      }}
    >
      <View style={{ gap: 24 }} className="flex-1 p-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl text-gray-500 ">{title}</Text>
          <TouchableOpacity
            className=" rounded-full p-1 bg-gray-100 items-center justify-center"
            onPress={() => setAddPointBottomSheet(!addPointBottomSheet)}
          >
            <X className="text-gray-500" height={24} width={24}></X>
          </TouchableOpacity>
        </View>
        <Select
          placeholder="Select category..."
          decorationIcon={
            <Tag className="text-gray-500" height={20} width={20} />
          }
          data={categories?.map((item) => {
            return {
              title: item.name,
              icon: {
                color: item.color,
                icon: item.icon,
                isCategory: true,
              },
            };
          })}
        />
        <Select
          decorationIcon={
            <CalendarDays className="text-gray-500" height={20} width={20} />
          }
          placeholder="Select the day you want to visit..."
          data={createDecrementArray(numberOfDays)}
        />
        <Button title="Add Point" type="primary" fullWidth />
      </View>
    </BottomSheet>
  );
};
