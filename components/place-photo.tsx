import { cva } from "class-variance-authority";
import { BadgeCheck } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

type PlacePhotoProps = {
  url: string;
  selected: boolean;
  selectPhoto: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const PlacePhoto: React.FC<PlacePhotoProps> = ({
  url,
  selected,
  selectPhoto,
}) => {
  return (
    <TouchableOpacity
      onPress={() => selectPhoto(url)}
      className="relative h-60 w-60"
    >
      {selected && (
        <View className="absolute top-0 left-0 h-full w-full z-30 bg-gray-100/50 items-center justify-center">
          <BadgeCheck height={40} width={40} className="text-sky-500" />
        </View>
      )}
      <Image
        source={{
          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${url}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        }}
        height={240}
        width={240}
        style={{ borderRadius: 12 }}
      ></Image>
    </TouchableOpacity>
  );
};
