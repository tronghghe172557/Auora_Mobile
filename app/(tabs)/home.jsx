import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, ScrollView, Text, View } from "react-native";

import { EmptyState } from "../../components";
import { API_IMAGE } from "../../constants/api.contants";
import ImageCard from "../../components/Image";
import api from "../../lib/axios.lib";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { user, setReloadHomepage, reloadHomepage } = useGlobalContext();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // GET posts => images from user
        const imagesUser = await api.get(`${API_IMAGE}`);
        setPosts(imagesUser?.data?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng từ AsyncStorage:", error);
        Alert.alert("Lỗi", "Không thể lấy dữ liệu người dùng từ bộ nhớ");
      }
    };

    fetchProfile();
  }, [reloadHomepage]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ImageCard
              title={item?.title || "Untitled"}
              thumbnail={item?.image || ""}
              creator={item?.userId?.username || "Unknown"}
              avatar={item?.userId?.avatar || ""}
            />
          )}

          // HEADER
          ListHeaderComponent={() => (
            <View className="flex my-6 px-4 space-y-6">
              <View className="flex justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    LOCKET OF<Text className="text-secondary"> HGT</Text>
                  </Text>
                </View>

                <View className="mt-1.5">
                  <Image
                    source={user?.avatar}
                    className="w-9 h-10"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          )}

          // if empty data
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos Found"
              subtitle="No videos found for this profile"
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
