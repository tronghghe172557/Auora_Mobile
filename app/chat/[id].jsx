import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MessageInput from "../../components/camera/MessageInput";
import api from "../../lib/axios.lib";

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    getCurrentUser();
    fetchMessages();
  }, []);

  const getCurrentUser = async () => {
    try {
      const userStorage = await AsyncStorage.getItem("@user_data");
      const userFromStorage = JSON.parse(userStorage);
      setCurrentUser(userFromStorage);
    } catch (error) {
      console.error("Lỗi khi lấy user từ storage:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/message/${id}`);
      const messageData = response?.data?.data || {};

      // Lấy toàn bộ nội dung tin nhắn từ content array
      const allMessages = messageData.content.map((msg) => ({
        _id: Math.random().toString(), // Tạo id tạm thời cho mỗi tin nhắn
        type: msg.type,
        value: msg.value,
        timestamp: msg.timestamp,
        userId: msg.user, // ID của người gửi tin nhắn này
        sender: messageData.sender,
        recipient: messageData.recipient,
      }));

      setMessages(allMessages); // Set tất cả tin nhắn vào state
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.userId === currentUser?._id;

    return (
      <View
        className={`px-4 py-2 max-w-[80%] ${
          isOwnMessage ? "self-end" : "self-start"
        }`}
      >
        <View
          className={`rounded-2xl p-3 ${
            isOwnMessage ? "bg-blue-500" : "bg-zinc-800"
          }`}
        >
          {item.type === "text" && (
            <Text className="text-white text-base">{item.value}</Text>
          )}
          {item.type === "emoji" && (
            <Text className="text-3xl">{item.value}</Text>
          )}
        </View>
        <Text className="text-gray-500 text-xs mt-1 ml-2">
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  //   const sendMessage = async () => {
  //     if (!message) return;

  //     console.log("Gửi tin nhắn:", message);

  //     try {
  //       await api.post(`/message`, {
  //         recipientId: id,
  //         content: [
  //           {
  //             type: "text",
  //             value: message,
  //             timestamp: new Date().toISOString(),
  //             user: currentUser._id,
  //           },
  //         ],
  //       });

  //       setMessage("");
  //       fetchMessages();
  //     } catch (error) {
  //       console.error("Lỗi khi gửi tin nhắn:", error);
  //     }
  //   };

  const sendMessage = async () => {
    if (!message) return;

    try {
      // Tạo tin nhắn mới
      const newMessage = {
        _id: Math.random().toString(),
        type: "text",
        value: message,
        timestamp: new Date().toISOString(),
        userId: currentUser._id,
        sender: currentUser,
        recipient: recipient,
      };

      // Thêm tin nhắn mới vào state messages ngay lập tức
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear input
      setMessage("");

      // Gửi tin nhắn lên server
      await api.post(`/message`, {
        recipientId: id,
        content: [
          {
            type: "text",
            value: message,
            timestamp: new Date().toISOString(),
            user: currentUser._id,
          },
        ],
      });

      // Không cần fetchMessages nữa vì đã thêm tin nhắn vào state
      // fetchMessages();
    } catch (error) {
      // Nếu gửi thất bại, có thể remove tin nhắn đã thêm
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== newMessage._id)
      );
      // console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-black" edges={["right", "left", "top"]}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        inverted={false} // Đổi thành false để hiển thị tin nhắn theo thứ tự thời gian
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
      />

      <View className="w-full flex-row items-center space-x-2">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Add a message..."
          placeholderTextColor="#CCC"
          className="flex-1 text-white px-4 py-3 font-pmedium bg-zinc-800/50 rounded-full"
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />

        <TouchableOpacity
          onPress={sendMessage}
          className={`w-10 h-10 rounded-full items-center justify-center ${
            message ? "bg-blue-500" : "bg-zinc-800/50"
          }`}
        >
          <Ionicons name="send" size={20} color={message ? "white" : "#666"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
