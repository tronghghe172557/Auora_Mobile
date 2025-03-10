import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import ToastAlert from "../../components/ToastAlert";
import { API_REGISTER } from "../../constants/api.contants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../lib/axios.lib";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      setToastMessage("Please fill in all fields");
      setToastVisible(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(API_REGISTER, form);
      // Xử lý kết quả đăng nhập thành công
      const userData = response.data.data;

      // Save to AsyncStorage
      try {
        await AsyncStorage.setItem("Token", response.data.accessToken);
        await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
        await AsyncStorage.setItem("@is_logged", "true");
      } catch (storageError) {
        showToast("Error saving to AsyncStorage:");
        console.error("Error saving to AsyncStorage:", storageError);
        return;
      }

      // Update context
      setUser(userData);
      setIsLogged(true);
      showToast("Đăng nhập thành công");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        {/* ToastAlert */}
        <ToastAlert
          visible={toastVisible}
          message={toastMessage}
          onClose={() => setToastVisible(false)}
        />

        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign Up to Aora
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
