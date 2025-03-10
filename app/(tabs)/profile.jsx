import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, Alert } from "react-native";

import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, InfoBox, VideoCard } from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import api from "../../lib/axios.lib";
import { API_IMAGES_USER } from "../../constants/api.contants";
import ImageCard from "../../components/Image";
import { ScrollView } from "react-native"; // Thêm import ScrollView

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await AsyncStorage.getItem("@user_data");
        if (userData) {
          setUser(JSON.parse(userData));
          // GET posts => images from user
          const imagesUser = await api.get(`${API_IMAGES_USER}/${user._id}`);
          setPosts(imagesUser.data.data);
        } else {
          router.replace("/sign-in");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng từ AsyncStorage:", error);
        Alert.alert("Lỗi", "Không thể lấy dữ liệu người dùng từ bộ nhớ");
      }
    };

    fetchProfile();
  }, []);

  const logout = async () => {
    AsyncStorage.removeItem("user");
    AsyncStorage.removeItem("isLogged");
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <ImageCard
              title={item?.title || "Untitled"}
              thumbnail={item?.image || ""}
              creator={item?.userId?.username || "Unknown"}
              avatar={item?.userId?.avatar || ""}
            />
          )}
          // if empty data
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos Found"
              subtitle="No videos found for this profile"
            />
          )}
          // component for header
          ListHeaderComponent={() => (
            <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
              <TouchableOpacity
                onPress={logout}
                className="flex w-full items-end mb-10"
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>

              <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-[90%] h-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>

              <InfoBox
                title={user?.username}
                containerStyles="mt-5"
                titleStyles="text-lg"
              />

              <View className="mt-5 flex flex-row">
                <InfoBox
                  title={posts.length || 0}
                  subtitle="Posts"
                  titleStyles="text-xl"
                  containerStyles="mr-10"
                />

                <Image
                  source={icons.profile}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </View>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
