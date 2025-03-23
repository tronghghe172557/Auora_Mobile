import { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { icons } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../../lib/cloudinary.lib";
import api from "../../lib/axios.lib";
import { API_IMAGE } from "../../constants/api.contants";
import uploadImageInBE from "../../lib/uploadImage";

const Create = () => {
  const { user, setReloadHomePage, reloadHomepage } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền truy cập bị từ chối",
          "Bạn cần cấp quyền truy cập ảnh để tiếp tục."
        );
      }
    })();
  }, []);

  // upload image to cloudinary and save it in db
  const submit = async () => {
    if ((form.prompt === "") | (form.title === "") | (imageUri === null)) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      // upload image to cloudinary
      const image = await uploadImageInBE(imageUri);
      console.log("image: ", image)

      if (!image) {
        Alert.alert("Error", "Failed to upload image");
        return;
      }

      const data = {
        title: form.title,
        description: form.prompt,
        image: image?.imageUrl,
      };
      /// save to database
      const response = await api.post(API_IMAGE, data);

      if (response.data.data) {
        Alert.alert("Success", "Image uploaded successfully");
        // reload homepage
        setReloadHomePage(!reloadHomepage);
        // navigate to home
        router.replace("/home");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        imageUri: null,
        prompt: "",
      });

      setUploading(false);
    }
  };

  // pick image from gallery
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/*  */}
        <ScrollView className="px-4 my-6">
          <Text className="text-2xl text-white font-psemibold">
            Upload Image
          </Text>

          {/* TITLE  */}
          <FormField
            title="Image Title"
            value={form.title}
            placeholder="Give your video a catchy title..."
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles="mt-10"
          />

          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-pmedium">
              Thumbnail Image
            </Text>

            {/* IMAGE  */}
            <TouchableOpacity onPress={pickImageAsync}>
              {imageUri ? (
                <Image
                  source={imageUri ? { uri: imageUri } : icons.upload}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                  <Image
                    source={imageUri ? { uri: imageUri } : icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* PROMPT */}
          <FormField
            title="Prompt"
            value={form.prompt}
            placeholder="The prompt of your video...."
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Submit & Publish"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={uploading}
          />
        </ScrollView>
        {/*  */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Create;
