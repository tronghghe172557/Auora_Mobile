import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_IMAGE, API_IMAGES_USER } from "../../constants/api.contants";
import { useGlobalContext } from "../../context/GlobalProvider";
import api from "../../lib/axios.lib";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import ImageDetailModal from "../../components/ImageDetailModal";

const { width } = Dimensions.get("window");
const SPACING = 2;
const ITEM_WIDTH = (width - 32 - SPACING * 2) / 3; // 32 là padding 16 * 2 bên

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [posts, setPosts] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const userStorage = await AsyncStorage.getItem("@user_data");
      const userAfterParse = JSON.parse(userStorage);
      const response = await api.get(
        `${API_IMAGES_USER}/${userAfterParse?._id}`
      );
      // Nhóm ảnh theo tháng
      const groupedPosts = groupPostsByMonth(response?.data?.data || []);
      setPosts(groupedPosts);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  // Hàm nhóm ảnh theo tháng
  const groupPostsByMonth = (posts) => {
    const grouped = posts.reduce((acc, post) => {
      const date = new Date(post.createdAt);
      const monthYear = `tháng ${date.getMonth() + 1} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(post);
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, posts]) => ({
      month,
      data: posts,
    }));
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("Token");
      await AsyncStorage.removeItem("@user_data");
      await AsyncStorage.removeItem("@is_logged");
      setUser(null);
      setIsLogged(false);
      // router.replace("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const renderHeader = () => (
    <View className="px-4 py-6 border-b border-zinc-800">
      {/* User Info Section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            source={{ uri: user?.avatar }}
            className="w-16 h-16 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-white text-xl font-bold">
              {user?.username}
            </Text>
            <Text className="text-gray-400">
              @{user?.username?.toLowerCase()}
            </Text>
          </View>
        </View>

        {/* Settings và Logout buttons */}
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            onPress={() => router.push("/changeProfile")}
            className="w-10 h-10 bg-zinc-800/50 rounded-full items-center justify-center"
          >
            <Ionicons name="settings-outline" size={22} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="w-10 h-10 bg-zinc-800/50 rounded-full items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-around mt-6">
        <View className="items-center">
          <Text className="text-white text-lg font-bold">
            {posts.reduce((acc, month) => acc + month.data.length, 0)}
          </Text>
          <Text className="text-gray-400">Posts</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-lg font-bold">{posts.length}</Text>
          <Text className="text-gray-400">Months</Text>
        </View>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        onPress={() => router.push("/changeProfile")}
        className="mt-6 bg-zinc-800/50 py-2 rounded-full"
      >
        <Text className="text-white text-center font-medium">Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMonthSection = ({ item }) => (
    <View className="mt-6">
      <Text className="text-white text-xl font-semibold px-4 mb-4">
        {item.month}
      </Text>

      <View className="flex-row flex-wrap px-4">
        {item.data.map((post, index) => (
          <TouchableOpacity
            key={post._id}
            className="mb-0.5"
            style={{
              width: ITEM_WIDTH,
              height: ITEM_WIDTH,
              marginRight: (index + 1) % 3 === 0 ? 0 : SPACING,
            }}
            onPress={() => handleImagePress(post)}
          >
            <Animated.View 
              className="w-full h-full rounded-2xl overflow-hidden bg-zinc-800"
              style={{
                transform: [{ scale: new Animated.Value(1) }]
              }}
            >
              <Image
                source={{ uri: post.image }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // MODAL DETAIL IMAGE
  const handleImagePress = (post) => {
    setSelectedImage(post);
    console.log("post: ", post);
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["right", "left", "top"]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.month}
        renderItem={renderMonthSection}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Image Detail Modal */}
      <ImageDetailModal
        visible={modalVisible}
        image={selectedImage?.image}
        title={selectedImage?.title}
        createdAt={selectedImage?.createdAt}
        onClose={() => {
          setModalVisible(false);
          setSelectedImage(null);
        }}
      />
    </SafeAreaView>
  );
};

export default Profile;
