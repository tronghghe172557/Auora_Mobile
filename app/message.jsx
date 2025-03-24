import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import api from "../lib/axios.lib";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Messages = () => {
    const { user } = useGlobalContext();
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
  
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
        const userStorage = await AsyncStorage.getItem("@user_data");
        const userFromStorage = JSON.parse(userStorage);
  
        const response = await api.get(`/message`);
        const messagesData = response?.data?.data || [];
  
        // Lọc tin nhắn dựa trên userId hiện tại
        const filteredMessages = messagesData.filter(
          (msg) =>
            msg.recipient._id === userFromStorage._id ||
            msg.sender._id === userFromStorage._id
        );
  
        // Nhóm tin nhắn theo người gửi/nhận
        const groupedMessages = groupMessagesByUser(
          filteredMessages,
          userFromStorage._id
        );
  
        setMessages(groupedMessages);
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
      }
    };
  
    const groupMessagesByUser = (messages, currentUserId) => {
      const grouped = messages.reduce((acc, msg) => {
        // Xác định người còn lại trong cuộc trò chuyện
        const isReceiver = msg.sender._id === currentUserId;
        const otherUser = isReceiver ? msg.recipient : msg.sender;
        const otherUserId = otherUser._id;
  
        // Lấy nội dung tin nhắn cuối cùng
        const lastMessageContent = Array.isArray(msg.content) 
          ? msg.content[msg.content.length - 1]?.text || "Sent an image" 
          : msg.content;
  
        if (!acc[otherUserId]) {
          acc[otherUserId] = {
            id: otherUserId,
            lastMessage: lastMessageContent,
            timestamp: msg.createdAt,
            otherUser: otherUser,
            unreadCount: 0, // Có thể thêm logic đếm tin chưa đọc nếu API hỗ trợ
            attachment: msg.attachment
          };
        } else {
          // Cập nhật last message nếu tin nhắn này mới hơn
          if (new Date(msg.createdAt) > new Date(acc[otherUserId].timestamp)) {
            acc[otherUserId].lastMessage = lastMessageContent;
            acc[otherUserId].timestamp = msg.createdAt;
            acc[otherUserId].attachment = msg.attachment;
          }
        }
        return acc;
      }, {});
  
      return Object.values(grouped).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    };
  
    const renderMessage = ({ item }) => (
      <TouchableOpacity
        onPress={() => router.push(`/chat/${item.id}`)}
        className="flex-row items-center px-4 py-4 border-b border-zinc-800"
      >
        <Image
          source={{ uri: item.otherUser?.avatar }}
          className="w-12 h-12 rounded-full"
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-medium">
              {item.otherUser?.username}
            </Text>
            <Text className="text-gray-500 text-xs">
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-1">
            <View className="flex-row items-center">
              {item.attachment && (
                <Ionicons name="image" size={16} color="gray" className="mr-2" />
              )}
              <Text className="text-gray-400 text-sm" numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["right", "left", "top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-zinc-800">
        <Text className="text-white text-xl font-semibold">Messages</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-400">No messages yet</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Messages;
