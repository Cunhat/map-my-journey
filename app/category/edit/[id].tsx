import { Button } from "@/components/ui/button";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { CustomTextInput } from "@/components/ui/text-input";
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/lib/types/supabase";
import { FullPageLoading } from "@/components/ui/loading";

const EditCategory = () => {
  const [color, setColor] = React.useState("blue");
  const [tab, setTab] = React.useState<number>(0);
  const [icon, setIcon] = React.useState<string>("Home");
  const [name, setName] = React.useState("");
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);

  const { tripId, id } = useLocalSearchParams<{ tripId: string; id: string }>();

  const category = useQuery({
    queryKey: ["getCategory", id],
    queryFn: async () => {
      const resp = await supabase
        .from("category")
        .select("*")
        .eq("id", id)
        .eq("tripId", tripId)
        .single();

      return resp.data;
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (category.isSuccess && category.data) {
      setColor(category.data?.color);
      setIcon(category.data?.icon);
      setName(category.data?.name);
    }
  }, [category.isSuccess]);

  const onSelectColor = (color: returnedResults) => {
    setColor(color.hex);
  };

  const onTabChange = (index: number) => {
    setTab(index);
  };

  const SelectedIcon = icons[icon as keyof typeof icons];

  const queryClient = useQueryClient();

  const updateCategory = useMutation({
    mutationFn: async (newCategory: {
      name: string;
      color: string;
      icon: string;
    }) => {
      const resp = await supabase
        .from("category")
        .update({
          name: newCategory.name,
          color: newCategory.color,
          icon: newCategory.icon,
        })
        .eq("id", id)
        .select();
      return resp;
    },

    onSuccess: ({ data }) => {
      if (data && data[0]?.id) {
        queryClient.invalidateQueries({
          queryKey: ["getTripCategories", tripId],
        });
        queryClient.invalidateQueries({
          queryKey: ["getTripPoints", tripId],
        });
        router.navigate("/trip/" + tripId);
      }
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async () => {
      return await supabase.from("category").delete().eq("id", id).select();
    },

    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["getTripCategories", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["getTripPoints", tripId],
      });
      router.navigate("/trip/" + tripId);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const handleSubmit = () => {
    updateCategory.mutate({
      name,
      color,
      icon,
    });
  };

  if (category.isLoading) return <FullPageLoading />;

  return (
    <View
      style={{ gap: 16 }}
      className="h-full px-3 py-5 bg-white flex flex-col"
    >
      <Text className="text-xl text-sky-500">Edit Category</Text>
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
          title="Update"
          fullWidth
          onPress={() => handleSubmit()}
          disabled={!name || !color || !icon}
        />
        <Button
          title="Delete"
          type="danger"
          fullWidth
          onPress={() => setDeleteModalVisible(true)}
        />
        <Button
          title="Cancel"
          type="secondary"
          fullWidth
          onPress={() => router.back()}
        />
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
      >
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View
            style={{ gap: 12 }}
            className="bg-white rounded-xl p-3 flex flex-col h-auto w-[90%]"
          >
            <Text className="text-xl text-sky-500">Are you sure ?</Text>
            <Text className="text-base text-gray-500">
              The deletion of this category will result in the loss of all
              points associated with it.
            </Text>
            <View style={{ gap: 12 }} className=" items-center justify-center">
              <Button
                title="Delete"
                type="danger"
                fullWidth
                onPress={() => deleteCategory.mutate()}
              />
              <Button
                title="Cancel"
                type="secondary"
                fullWidth
                onPress={() => setDeleteModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditCategory;
