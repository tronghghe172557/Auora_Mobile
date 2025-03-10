import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from 'expo-media-library';
import { TopBar, CameraFrame, BottomControls } from "../../components/camera";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [flash, setFlash] = useState<boolean>(false);
  const [isCameraReady, setCameraReady] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  
  const screenWidth = Dimensions.get("window").width;
  const frameSize = screenWidth - 40;

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
      setPreviewImage(null); // Quay lại chế độ chụp
      console.log("Photo saved to library");
    } catch (error) {
      console.error("Failed to save photo:", error);
    }
  };

  const cancelPreview = () => {
    setPreviewImage(null);
  };

  const uploadPhoto = () => {
    // Xử lý upload ảnh lên server ở đây
    console.log("Uploading photo:", previewImage);
    setPreviewImage(null);
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        <TopBar 
          onSave={savePhoto}
          isPreviewMode={!!previewImage}
        />

        <CameraFrame
          frameSize={frameSize}
          previewImage={previewImage}
          cameraRef={cameraRef}
          facing={facing}
          flash={flash}
          isCameraReady={isCameraReady}
          onCameraReady={() => setCameraReady(true)}
          onToggleFlash={toggleFlash}
        />

        <BottomControls
          isPreviewMode={!!previewImage}
          isCameraReady={isCameraReady}
          onCancel={cancelPreview}
          onCapture={takePicture}
          onUpload={uploadPhoto}
          onFlipCamera={toggleCameraFacing}
        />
      </SafeAreaView>
    </View>
  );
}
