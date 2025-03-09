import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";

export default function CustomAlert({ visible, message = "Alert", onClose }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-secondary p-6 rounded-lg w-[80%] border-2 border-black">
          <Text className="text-black text-base font-psemibold text-center mb-4">
            {message}
          </Text>
          <TouchableOpacity 
            onPress={onClose}
            className="bg-black py-2 px-4 rounded-lg"
          >
            <Text className="text-white text-center font-psemibold">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
