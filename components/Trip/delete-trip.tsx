import React, { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react-native";
import { Modal, View, Text } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { supabaseClient } from "@/lib/supabase";
import { router } from "expo-router";

type DeleteTripProps = {
  tripId: string;
};

export const DeleteTrip: React.FC<DeleteTripProps> = ({ tripId }) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const queryClient = useQueryClient();
  const { getToken, isLoaded } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: async ({ tripId }: { tripId: string }) => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token);

      const resp = await supabase
        .from("trip")
        .delete()
        .eq("id", tripId)
        .select();

      return resp;
    },

    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["getTrips"],
      });
      router.push("/(home)/");
    },
    onError: (err) => {
      console.log("err", err);
    },
  });
  return (
    <View>
      <Button
        title="Delete"
        type="danger"
        icon={<Trash2 className="text-white" height={20} width={20} />}
        fullWidth
        onPress={() => setDeleteModalVisible(true)}
      />
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
              The deletion of this trip will result in the loss of all data
              associated with it.
            </Text>
            <View
              style={{ gap: 12 }}
              className="flex-row items-center justify-center p-3"
            >
              <Button
                title="Cancel"
                type="secondary"
                className="w-1/2"
                onPress={() => setDeleteModalVisible(false)}
              />
              <Button
                title="Delete"
                type="danger"
                className="w-1/2"
                onPress={() => deleteMutation.mutate({ tripId })}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
