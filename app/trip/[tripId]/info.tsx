import { CalendarDays, Plane } from "lucide-react-native";
import React from "react";
import { View, Text, SafeAreaView, TextInput } from "react-native";

const Info = () => {
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View style={{ gap: 12 }} className="flex-1 p-3">
        <View className="relative">
          <Plane
            className="text-gray-500 absolute z-10 left-1.5 top-3.5 "
            height={20}
            width={20}
          />
          <TextInput
            placeholder={"What is the name of your trip?"}
            placeholderTextColor={"#d1d5db"}
            // value={name}
            style={{ paddingLeft: 35 }}
            // onChangeText={(text) => setName(text)}
            className="h-11 w-full text-base  p-2 bg-gray-100 rounded-xl text-gray-600"
          />
        </View>
        <View className="relative">
          <CalendarDays
            className="text-gray-500 absolute z-10 left-1.5 top-3.5 "
            height={20}
            width={20}
          />
          <TextInput
            placeholder={"How many days will you be there?"}
            placeholderTextColor={"#d1d5db"}
            // value={days}
            style={{ paddingLeft: 35 }}
            keyboardType={"number-pad"}
            // onChangeText={(text) => setDays(text)}
            className="h-11 w-full text-base p-2 bg-gray-100 rounded-xl text-gray-600  "
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Info;
