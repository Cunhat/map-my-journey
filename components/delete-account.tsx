import React, { useState } from "react";
import { View, Text, Modal } from "react-native";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react-native";
import { useUser } from "@clerk/clerk-expo";

export const DeleteAccount = () => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { user } = useUser();

  const deleteAccount = () => {
    user?.delete();
    setDeleteModalVisible(false);
  };

  return (
    <>
      <Button
        title="Delete Account"
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
              The deletion of your account will result in the loss of all data
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
                onPress={deleteAccount}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
