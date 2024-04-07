import { CustomTextInput } from "@/components/text-input";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const CreateCategory = () => {
  return (
    <View
      style={{ gap: 16 }}
      className="h-full px-3 py-5 bg-white flex flex-col"
    >
      <View className="flex-1">
        <Text className="text-xl text-sky-500">Create Category</Text>
        <CustomTextInput onChange={() => {}} placeholder="Category name..." />
      </View>
      <View className="bg-pink-300 h-40 p-3 flex-row">
        <TouchableOpacity className="inline-flex items-center justify-center h-9 px-4 py-2 bg-sky-500">
          <Text className="text-white text-center">Create</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1">
          <Text className="text-white text-center">Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateCategory;
