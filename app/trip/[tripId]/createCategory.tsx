import { Button } from "@/components/button";
import { Tabs, TabItem } from "@/components/tabs";
import { CustomTextInput } from "@/components/text-input";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import ColorPicker, {
  Panel1,
  Swatches,
  colorKit,
  PreviewText,
  HueCircular,
  returnedResults,
} from "reanimated-color-picker";
import { icons } from "lucide-react-native";

const CreateCategory = () => {
  const [color, setColor] = React.useState("blue");
  const [tab, setTab] = React.useState<number>(0);
  const [icon, setIcon] = React.useState<string>("Home");

  const onSelectColor = (color: returnedResults) => {
    setColor(color.hex);
  };

  const onTabChange = (index: number) => {
    setTab(index);
  };

  const SelectedIcon = icons[icon];

  return (
    <View
      style={{ gap: 16 }}
      className="h-full px-3 py-5 bg-white flex flex-col"
    >
      <Text className="text-xl text-sky-500">Create Category</Text>
      <View className="flex-1" style={{ gap: 16 }}>
        <CustomTextInput onChange={() => {}} placeholder="Category name..." />
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
              <ScrollView
                contentContainerStyle={{
                  gap: 24,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  flex: 1,
                  justifyContent: "center",
                }}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                // showsHorizontalScrollIndicator={false}
                className="h-full w-full flex-row flex-wrap"
              >
                {Object.keys(icons).map((name) => {
                  const LucideIcon = icons[name];

                  return (
                    <TouchableOpacity key={name} onPress={() => setIcon(name)}>
                      <LucideIcon
                        color={icon === name ? "#0ea5e9" : "black"}
                        size={40}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
      <View style={{ gap: 12 }} className="h-auto pb-4">
        <Button title="Create" fullWidth />
        <Button title="Cancel" type="secondary" fullWidth />
      </View>
    </View>
  );
};

export default CreateCategory;
