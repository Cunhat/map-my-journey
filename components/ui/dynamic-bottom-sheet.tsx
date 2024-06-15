import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { PropsWithChildren } from "react";
import { useSharedValue } from "react-native-reanimated";

interface DynamicBottomSheetProps extends BottomSheetProps {
  headerIndicator?: boolean;
}

export const DynamicBottomSheet = React.forwardRef<
  BottomSheet,
  PropsWithChildren<DynamicBottomSheetProps>
>(({ headerIndicator = true, children }, ref) => {
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
        height: headerIndicator ? 40 : 0,
      }}
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheet>
  );
});
