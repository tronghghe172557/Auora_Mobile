import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import { TopBar, CameraFrame, BottomControls } from "../../components/camera";
import { API_IMAGE } from "../../constants/api.contants";
import api from "../../lib/axios.lib";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import Loader from "../../components/Loader";
import uploadImageInBE from "../../lib/uploadImage";

export default function CameraScreen() {
  const { setReloadHomePage, reloadHomepage } = useGlobalContext();
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [flash, setFlash] = useState<boolean>(false);
  const [isCameraReady, setCameraReady] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const cameraRef = useRef<CameraView>(null);

  const screenWidth = Dimensions.get("window").width;
  const frameSize = screenWidth - 20;

  // Nếu chưa có quyền truy cập camera hoặc media library
  if (!permission || !mediaPermission) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white text-lg font-psemibold">
          Requesting permissions...
        </Text>
      </View>
    );
  }

  // Nếu người dùng từ chối quyền truy cập
  if (!permission.granted || !mediaPermission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-primary p-4">
        <Text className="text-white text-lg font-psemibold text-center mb-4">
          We need your permission to use the camera and save photos
        </Text>
        <TouchableOpacity
          onPress={() => {
            requestPermission();
            requestMediaPermission();
          }}
          className="bg-secondary px-6 py-3 rounded-full"
        >
          <Text className="text-black font-psemibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    setFlash((current) => !current);
  }

  // setPreviewImage để xem lại ảnh đã chụp
  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        exif: false,
      });

      if (photo && photo.uri) {
        setPreviewImage(photo.uri);
        console.log("Photo taken:", photo.uri);
      }
    } catch (error) {
      console.error("Failed to take picture:", error);
    }
  };

  const savePhoto = async () => {
    if (!previewImage) return;

    try {
      await MediaLibrary.saveToLibraryAsync(previewImage);
      console.log("Photo saved to library");
    } catch (error) {
      console.error("Failed to save photo:", error);
    }
  };

  const cancelPreview = () => {
    setPreviewImage(null);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!previewImage || isUploading) return;

    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    setIsUploading(true);
    try {
      // Upload ảnh lên Cloudinary
      const imageUrl = await uploadImageInBE(previewImage);

      if (!imageUrl) {
        Alert.alert("Error", "Failed to upload image");
        return;
      }

      // Gửi data lên server
      const response = await api.post(API_IMAGE, {
        title: message,
        description: message,
        image: imageUrl?.imageUrl,
      });

      if (response.data.data) {
        Alert.alert("Success", "Image uploaded successfully");
        setReloadHomePage(!reloadHomepage);
        router.replace("/home" as any);
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to upload");
    } finally {
      setIsUploading(false);
      setPreviewImage(null);
      setMessage("");
    }
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        {/* top bar */}
        <TopBar onSave={savePhoto} isPreviewMode={!!previewImage} />

        {/* camera */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <CameraFrame
            frameSize={frameSize}
            previewImage={previewImage}
            cameraRef={cameraRef}
            facing={facing}
            flash={flash}
            isCameraReady={isCameraReady}
            onCameraReady={() => setCameraReady(true)}
            onToggleFlash={toggleFlash}
            message={message}
            setMessage={setMessage}
            isUploading={isUploading}
          />
        </KeyboardAvoidingView>

        {/* loading */}
        {isUploading && <Loader isLoading={isUploading} />}

        {/* button  */}
        <BottomControls
          isPreviewMode={!!previewImage}
          isCameraReady={isCameraReady}
          onCancel={cancelPreview}
          onCapture={takePicture}
          onUpload={handleUpload}
          onFlipCamera={toggleCameraFacing}
          canUpload={!!message.trim()}
        />
      </SafeAreaView>
    </View>
  );
}
