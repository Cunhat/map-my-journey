import { Tables } from "@/lib/types/supabase";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { X, icons } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "../ui/button";

type FocusPointProps = {
  point: Tables<"point"> & { category: Tables<"category"> };
  onModelClose: () => void;
};

export const FocusPoint = React.forwardRef<BottomSheetModal, FocusPointProps>(
  ({ point, onModelClose }, ref) => {
    const snapPointsBottom = React.useMemo(() => ["25%"], []);
    const LucideIcon = icons[point?.category?.icon as keyof typeof icons];

    return (
      <BottomSheetModal
        animateOnMount
        ref={ref}
        snapPoints={snapPointsBottom}
        handleIndicatorStyle={{
          backgroundColor: "#6b7280",
          width: 40,
        }}
        onDismiss={onModelClose}
      >
        <View className="flex-1">
          <View style={{ gap: 12 }} className="flex-row items-center py-1 px-3">
            <View
              style={{ backgroundColor: point?.category?.color }}
              className="h-10 w-10 rounded-full justify-center items-center"
            >
              <LucideIcon
                strokeWidth={1.2}
                className="text-white"
                height={"50%"}
                width={"50%"}
              />
            </View>
            <View className="flex-1">
              <Text className="text-xl text-gray-500 ">{point?.name}</Text>
            </View>
          </View>
          <View className="flex-1 justify-center p-3">
            <Button title="Directions" type="primary" fullWidth />
          </View>
        </View>
      </BottomSheetModal>
    );
  }
);
