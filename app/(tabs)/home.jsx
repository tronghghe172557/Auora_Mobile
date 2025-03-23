import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View, StatusBar, Dimensions } from "react-native";
import { CustomButton, EmptyState } from "../../components";
import { API_IMAGE, API_USER } from "../../constants/api.contants";
import api from "../../lib/axios.lib";
import { useGlobalContext } from "../../context/GlobalProvider";
import PostItem from "../../components/PostItem";
import { images } from "../../constants";
import { Image } from "react-native";
import { Text } from "react-native";

const { height } = Dimensions.get("window");

const Home = () => {
  const { user, setReloadHomepage, reloadHomepage } = useGlobalContext();
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [reloadHomepage]);

  const fetchPosts = async () => {
    try {
      const response = await api.get(`${API_IMAGE}`);
      const users = await api.get(`${API_USER}`);
      setPosts(response?.data?.data || []);
      setUsers(users?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  const renderItem = ({ item }) => (
    <PostItem item={item} user={user} users={users} setFilter={setFilter}  />
  );

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["right", "left", "top"]}>
      <View className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />

        <FlatList
          data={
            filter
              ? posts.filter((post) => {
                  return post?.userId?._id == filter;
                })
              : posts
          }
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex justify-center items-center px-4">
              <Image
                source={images.empty}
                resizeMode="contain"
                className="w-[270px] h-[216px]"
              />

              <Text className="text-sm font-pmedium text-gray-100">
                {"No Images Found"}
              </Text>
              <Text className="text-xl text-center font-psemibold text-white mt-2">
                {"No images found for this profile"}
              </Text>

              <CustomButton
                title="Reload | Create new post"
                handlePress={() => {
                  setFilter("")
                }}
                containerStyles="w-full my-5"
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
