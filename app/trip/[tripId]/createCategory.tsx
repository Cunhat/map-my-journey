import { Button } from "@/components/ui/button";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { CustomTextInput } from "@/components/ui/text-input";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import ColorPicker, {
  Panel1,
  Swatches,
  colorKit,
  PreviewText,
  HueCircular,
  returnedResults,
} from "reanimated-color-picker";
import { Tag, icons } from "lucide-react-native";
import { CategoryIcons } from "@/components/category-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/lib/types/supabase";

const CreateCategory = () => {
  const [color, setColor] = React.useState("blue");
  const [tab, setTab] = React.useState<number>(0);
  const [icon, setIcon] = React.useState<string>("Home");
  const [name, setName] = React.useState("");

  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const onSelectColor = (color: returnedResults) => {
    setColor(color.hex);
  };

  const onTabChange = (index: number) => {
    setTab(index);
  };

  const SelectedIcon = icons[icon as keyof typeof icons];

  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: async (newCategory: {
      name: string;
      color: string;
      icon: string;
    }) => {
      return await supabase
        .from("category")
        .insert({
          name: newCategory.name,
          color: newCategory.color,
          icon: newCategory.icon,
          tripId: parseInt(tripId),
        })
        .select();
    },

    onSuccess: ({ data }) => {
      if (data && data[0]?.id) {
        queryClient.invalidateQueries({
          queryKey: ["getTripCategories", tripId],
        });
        router.navigate("/trip/" + tripId);
      }
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const handleSubmit = () => {
    createCategory.mutate({
      name,
      color,
      icon,
    });
  };

  return (
    <View
      style={{ gap: 16 }}
      className="h-full px-3 py-5 bg-white flex flex-col"
    >
      <Text className="text-xl text-sky-500">Create Category</Text>
      <View className="flex-1" style={{ gap: 16 }}>
        <View className="relative">
          <Tag
            className="text-gray-500 absolute z-10 left-1.5 top-3.5 "
            height={20}
            width={20}
          />
          <TextInput
            placeholder={"Category name..."}
            placeholderTextColor={"#d1d5db"}
            value={name}
            style={{ paddingLeft: 35 }}
            keyboardType={"number-pad"}
            onChangeText={(text) => setName(text)}
            className="h-11 w-full text-base p-2 bg-gray-100 rounded-xl text-gray-600  "
          />
        </View>
        <View style={{ gap: 16 }} className="flex-1">
          <View className="justify-center items-center">
            <View
              style={{ backgroundColor: color }}
              className="h-32 w-32 rounded-full justify-center items-center"
            >
              <SelectedIcon
                strokeWidth={2.7}
                className="text-white"
                height={"50%"}
                width={"50%"}
              />
            </View>
          </View>
          <View className="items-center justify-center">
            <Tabs>
              <TabItem
                onTabChange={onTabChange}
                tabIndex={0}
                currentTab={tab}
                label="Color"
              />
              <TabItem
                onTabChange={onTabChange}
                tabIndex={1}
                currentTab={tab}
                label="Icon"
              />
            </Tabs>
          </View>
          <View className="flex-1 items-center">
            {tab === 0 && (
              <ColorPicker
                value={color}
                style={{ width: "75%", height: "75%" }}
                sliderThickness={20}
                thumbSize={24}
                onChange={onSelectColor}
                boundedThumb
              >
                <HueCircular
                  containerStyle={{ justifyContent: "center" }}
                  thumbShape="pill"
                >
                  <Panel1
                    style={{
                      width: "70%",
                      height: "70%",
                      alignSelf: "center",
                      borderRadius: 16,
                    }}
                  />
                </HueCircular>
              </ColorPicker>
            )}
            {tab === 1 && (
              <CategoryIcons selectedIcon={icon} setSelectedIcon={setIcon} />
            )}
          </View>
        </View>
      </View>
      <View style={{ gap: 12 }} className="h-auto pb-4">
        <Button
          title="Create"
          fullWidth
          onPress={() => handleSubmit()}
          disabled={!name || !color || !icon}
        />
        <Button
          title="Cancel"
          type="secondary"
          fullWidth
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
};

export default CreateCategory;
