import Empty from "@/assets/svg/empty";
import { Tables } from "@/lib/types/supabase";
import React from "react";
import { View, Text } from "react-native";
import {
  PointsList,
  PointsListItem,
  PointsListSeparator,
} from "@/components/points-list";

type PointsProps = {
  points: Array<Tables<"point"> & { category: Tables<"category"> }>;
};

const Points: React.FC<PointsProps> = ({ points }) => {
  if (points?.length === 0)
    return (
      <View style={{ gap: 12 }} className="flex-1">
        <View className="flex-1 justify-center items-center">
          <Empty height={"80%"} width={"80%"} />
          <Text className="text-gray-400 text-xl">No points...</Text>
        </View>
      </View>
    );

  return (
    <View style={{ gap: 12 }} className="flex-1">
      <Text className="text-sky-500 text-xl">Points</Text>
      <PointsList>
        {points?.map((point, index) => (
          <React.Fragment key={point.id}>
            <PointsListItem point={point} />
            {index < points?.length! - 1 && <PointsListSeparator />}
          </React.Fragment>
        ))}
      </PointsList>
    </View>
  );
};

export default Points;
