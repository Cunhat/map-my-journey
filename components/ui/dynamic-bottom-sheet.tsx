import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { PropsWithChildren } from "react";
import { useSharedValue } from "react-native-reanimated";

interface DynamicBottomSheetProps extends BottomSheetProps {}

export const DynamicBottomSheet = React.forwardRef<
  BottomSheet,
  PropsWithChildren<DynamicBottomSheetProps>
>(({ children }, ref) => {
  const animatedContentHeight = useSharedValue(0);

  return (
    <BottomSheet
      animateOnMount
      ref={ref}
      enableDynamicSizing
      contentHeight={animatedContentHeight}
      handleIndicatorStyle={{
        height: 0,
      }}
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheet>
  );
});
