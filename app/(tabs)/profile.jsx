import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, Alert } from "react-native";

import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, InfoBox } from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import api from "../../lib/axios.lib";
import { API_IMAGES_USER } from "../../constants/api.contants";
import ImageCard from "../../components/Image";

const Profile = () => {
  const { user, setUser, setIsLogged, reloadHomepage } = useGlobalContext();
  const [posts, setPosts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStorage = await AsyncStorage.getItem("@user_data");
        const userAfterParse = JSON.parse(userStorage);
        if (userAfterParse) {
          // GET posts => images from user
          const imagesUser = await api.get(
            `${API_IMAGES_USER}/${userAfterParse?._id}`
          );
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
  }, [reloadHomepage, reload, user]);

  const logout = async () => {
    AsyncStorage.removeItem("Token");
    AsyncStorage.removeItem("@user_data");
    AsyncStorage.removeItem("@is_logged");
    setUser(null);
    setIsLogged(false); 

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          console.log("item", item),
          (
            <ImageCard
              title={item?.title || "Untitled"}
              thumbnail={item?.image || ""}
              creator={item?.userId?.username || "Unknown"}
              avatar={item?.userId?.avatar || ""}
            />
          )
        )}
        // if empty data
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
            setReload={setReload}
            reload={reload}
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

              <TouchableOpacity
                onPress={() => router.push("/changeProfile")}
                className="flex items-center"
              >
                <Image
                  source={icons.profile}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
