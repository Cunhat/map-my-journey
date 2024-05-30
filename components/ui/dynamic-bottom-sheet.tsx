import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { PropsWithChildren } from "react";
import { useSharedValue } from "react-native-reanimated";

export const DynamicBottomSheet = React.forwardRef<
  BottomSheet,
  PropsWithChildren
>(({ children }, ref) => {
  const animatedContentHeight = useSharedValue(0);

  return (
    <BottomSheet
      animateOnMount
      ref={ref}
      enableDynamicSizing
      contentHeight={animatedContentHeight}
      handleIndicatorStyle={{
        backgroundColor: "#6b7280",
        width: 40,
      }}
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheet>
  );
});
