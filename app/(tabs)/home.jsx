import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  View,
  StatusBar,
  Dimensions,
} from "react-native";
import { EmptyState } from "../../components";
import { API_IMAGE, API_USER } from "../../constants/api.contants";
import api from "../../lib/axios.lib";
import { useGlobalContext } from "../../context/GlobalProvider";
import PostItem from "../../components/PostItem";

const { height } = Dimensions.get("window");

const Home = () => {
  const { user, setReloadHomepage, reloadHomepage } = useGlobalContext();
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

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

  const renderItem = ({ item }) => <PostItem item={item} user={user} users={users} />;

  return (
    <SafeAreaView
      className="flex-1 bg-black"
      edges={["right", "left", "top"]}
    >
      <View className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />

        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Images Found"
              subtitle="No images found for this profile"
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;