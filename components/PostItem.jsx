import React, { useState } from "react";
import { Image, Text, View, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { height, width } = Dimensions.get("window");

const PostItem = ({ item, user, users, setFilter }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("Mọi người");

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <View style={{ height: height, width: width }} className="bg-black/95">
      {/* Top Bar */}
      <View className="flex-row items-center space-x-3">
        <Image
          source={{ uri: user?.avatar }}
          className="w-8 h-8 rounded-full"
        />
        {/* FRIENDS */}
        <View>
          <TouchableOpacity
            className="bg-zinc-700/50 rounded-full px-4 py-1.5 flex-row items-center"
            onPress={toggleDropdown}
          >
            <Text className="text-white text-base">{name}</Text>
            <Text className="text-white ml-2">{showDropdown ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View className="absolute top-10 left-0 bg-zinc-800 rounded-xl p-2 w-40 z-10">
              <TouchableOpacity
                className="flex-row items-center space-x-2 m-3 font-semibold"
                key={"all"}
                onPress={() => {
                  setName("Mọi người")
                  setShowDropdown(false)
                  setFilter("")
                }}
              >
                <Text className="text-white">{"All"}</Text>
              </TouchableOpacity>
              {users.map((user) => (
                <TouchableOpacity
                  className="flex-row items-center space-x-2 m-3 font-semibold"
                  key={user._id}
                  onPress={() => {
                    setName(user?.username)
                    setShowDropdown(false)
                    setFilter(user._id)
                  }}
                >
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-6 h-6 rounded-full"
                  />
                  <Text className="text-white">{user.username}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
            onPress={() => router.push("/message")}
            className="w-10 h-10 bg-zinc-800/50 rounded-full items-center justify-center"
          >
            <Ionicons name="chatbubble-outline" size={22} color="white" />
          </TouchableOpacity>
      </View>

      {/* Main Content - Locket Style */}
      <View style={{ height: height * 0.54 }} className="mx-4 my-4">
        <View className="w-full h-full rounded-3xl overflow-hidden bg-zinc-800/30">
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          {/* Message overlay inside image - auto-sizing based on content */}
          {item.title && (
            <View
              className="absolute bottom-4 left-5 right-0 flex items-center justify-center"
              style={{ maxWidth: "90%" }}
            >
              <View className="bg-black/50 rounded-2xl p-3">
                <Text className="text-white text-lg font-medium">
                  {item.title}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Info */}
      <View className="px-4 pb-8">
        {/* User Info */}
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: item.userId?.avatar }}
            className="w-7 h-7 rounded-full"
          />
          <Text className="text-white ml-2 font-medium">
            {item.userId?.username || "Chang"}
          </Text>
          <Text className="text-gray-400 ml-2">12g</Text>
        </View>

        {/* Reaction Input - Locket Style */}
        {/*<View className="bg-zinc-800/50 rounded-full py-2.5 px-4 flex-row items-center">
          <Text className="text-gray-400 text-base">Gửi tin...</Text>
          <View className="flex-row ml-auto space-x-5">
            <Text className="text-2xl">❤️</Text>
            <Text className="text-2xl">😂</Text>
            <Text className="text-2xl">🤔</Text>
            <Text className="text-2xl">😊</Text>
          </View>
        </View>
        */}

        {/* Bottom Navigation */}
        <View className="flex-row justify-between items-center mt-6">
          <View className="flex-row space-x-3">
            <TouchableOpacity className="w-9 h-9 bg-zinc-800/50 rounded-lg items-center justify-center">
              <Ionicons name="menu" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push("/camera")}>
            <View className="w-14 h-14 bg-zinc-800/50 rounded-full border-2 border-white items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-white border-4 border-secondary" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="w-9 h-9 bg-zinc-800/50 rounded-lg items-center justify-center">
            <Ionicons name="arrow-up" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostItem;
