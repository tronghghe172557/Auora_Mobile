import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useGlobalContext } from "../context/GlobalProvider";
import api from "../lib/axios.lib";
import ToastAlert from "../components/ToastAlert";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../lib/cloudinary.lib";
import { Ionicons } from "@expo/vector-icons";
import { CustomButton, FormField } from "../components";
import { API_UPDATE_PROFILE } from "../constants/api.contants";

const Profile = () => {
  const { user, setUser, reloadHomepage, setReloadHomePage } =
    useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [avatarUri, setAvatarUri] = useState(user?.avatar || null);

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const submit = async () => {
    setSubmitting(true);

    try {
      let updateData = {
        username: form.username,
        phone: form.phone,
      };

      // Nếu có thay đổi avatar
      if (avatarUri && avatarUri !== user?.avatar) {
        const avatarUrl = await uploadImageToCloudinary(avatarUri);
        if (avatarUrl) {
          updateData.avatar = avatarUrl;
        }
      }

      // Nếu có thay đổi mật khẩu
      if (form.password && form.newPassword) {
        if (form.newPassword !== form.confirmPassword) {
          showToast("Mật khẩu mới không khớp");
          return;
        }
        updateData.oldPassword = form.password;
        updateData.newPassword = form.newPassword;
      }

      const response = await api.put(
        `${API_UPDATE_PROFILE}/${user._id}`,
        updateData
      );

      if (response.data) {
        setUser(response.data);
        Alert.alert("Cập nhật thông tin thành công");
        setReloadHomePage(!reloadHomepage);
      }
    } catch (error) {
      showToast(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ToastAlert
        visible={toastVisible}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="px-4 py-6">
          {/*  */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-2xl font-psemibold text-white flex-1 ml-4">
              Edit Profile
            </Text>
          </View>
          {/*  */}

          {/* Avatar */}
          <View className="items-center my-6">
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: avatarUri || user?.avatar }}
                className="w-24 h-24 rounded-full"
              />
              <View className="absolute bottom-0 right-0 bg-secondary p-2 rounded-full">
                <Ionicons name="camera" size={20} color="black" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(text) => setForm({ ...form, username: text })}
            otherStyles="mt-4"
          />

          <FormField
            title="Email"
            value={form.email}
            editable={false}
            otherStyles="mt-4"
          />

          <FormField
            title="Phone"
            value={form.phone}
            handleChangeText={(text) => setForm({ ...form, phone: text })}
            otherStyles="mt-4"
            keyboardType="phone-pad"
          />

          <Text className="text-white font-psemibold mt-6 mb-2">
            Change Password
          </Text>

          <FormField
            title="Current Password"
            value={form.password}
            handleChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry
            otherStyles="mt-4"
          />

          <FormField
            title="New Password"
            value={form.newPassword}
            handleChangeText={(text) => setForm({ ...form, newPassword: text })}
            secureTextEntry
            otherStyles="mt-4"
          />

          <FormField
            title="Confirm New Password"
            value={form.confirmPassword}
            handleChangeText={(text) =>
              setForm({ ...form, confirmPassword: text })
            }
            secureTextEntry
            otherStyles="mt-4"
          />

          <CustomButton
            title="Save Changes"
            handlePress={submit}
            containerStyles="mt-6"
            isLoading={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;
