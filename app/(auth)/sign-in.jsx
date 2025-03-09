import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { API_LOGIN } from "../../constants/api.contants";
import api from "../../lib/axios.lib";
import ToastAlert from "../../components/ToastAlert";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const submit = async () => {
    setSubmitting(true);

    try {
      // validate form
      if (!form.email || !form.password) {
        showToast("Vui lòng nhập đầy đủ thông tin");
        return;
      }
      // call api here
      const response = await api.post(API_LOGIN, form);

      // Xử lý kết quả đăng nhập thành công
      const userData = response.data.data;

      // Save to AsyncStorage
      try {
        await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
        await AsyncStorage.setItem("@is_logged", "true");
      } catch (storageError) {
        console.error("Error saving to AsyncStorage:", storageError);
      }

      // Update context
      setUser(userData);
      setIsLogged(true);
      showToast("Đăng nhập thành công");
      router.replace("/home");
    } catch (error) {
      showToast(error.message);
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

      <ScrollView>
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
            Log in to Aora
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7" // mt-7: margin-top: 1.75rem
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7" // mt-7: margin-top: 1.75rem
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7" // mt-7: margin-top: 1.75rem
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
