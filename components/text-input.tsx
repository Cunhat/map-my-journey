import React from "react";
import { View, Text, TextInput } from "react-native";

type TextInputProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export const CustomTextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <View style={{ gap: 4 }}>
      <Text className="text-base text-sky-500">Create Category</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={"#d1d5db"}
        value={value}
        onChangeText={(text) => onChange(text)}
        className="h-10 w-full p-2 bg-gray-100 rounded-xl text-gray-600"
      />
    </View>
  );
};
