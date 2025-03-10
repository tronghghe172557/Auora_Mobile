import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from 'expo-media-library';
import { router } from "expo-router";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [flash, setFlash] = useState<boolean>(false);
  const [isCameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);
  
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

      // Lưu ảnh vào thư viện
      await MediaLibrary.saveToLibraryAsync(photo.uri);

      // Điều hướng đến màn hình xem trước ảnh hoặc xử lý tiếp theo
      // router.push({
      //   pathname: "/(tabs)/preview",
      //   params: { imageUri: photo.uri }
      // });
      
      console.log("Photo taken:", photo.uri);
    } catch (error) {
      console.error("Failed to take picture:", error);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        {/* Top Bar */}
        <View className="flex-row justify-between items-center px-4 py-2">
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                source={require("../../assets/images/profile.png")}
                className="w-full h-full"
              />
            </TouchableOpacity>
            <View className="bg-black/50 px-4 py-2 rounded-full flex-row items-center">
              <Ionicons name="people" size={20} color="white" />
              <Text className="text-white ml-2 font-psemibold">
                4 người bạn
              </Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-black/50 rounded-full items-center justify-center">
            <Ionicons name="chatbubble-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Camera Frame */}
        <View className="flex-1 justify-center items-center">
          <View
            style={{
              width: frameSize,
              height: frameSize,
              borderRadius: 35,
              overflow: "hidden",
            }}
            className="relative"
          >
            <CameraView 
              ref={cameraRef}
              style={{ flex: 1 }} 
              facing={facing} 
              enableTorch={flash}
              onCameraReady={() => setCameraReady(true)}
            >
              {/* Camera Controls Overlay */}
              <View className="absolute top-4 left-4 right-4 flex-row justify-between">
                <TouchableOpacity
                  onPress={toggleFlash}
                  className="w-10 h-10 bg-black/50 rounded-full items-center justify-center"
                >
                  <Ionicons
                    name={flash ? "flash" : "flash-off"}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 bg-black/50 rounded-full items-center justify-center">
                  <Text className="text-white font-psemibold">1×</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        </View>

        {/* Bottom Controls */}
        <View className="pb-10">
          <View className="flex-row justify-around items-center px-4">
            <TouchableOpacity>
              <Ionicons name="images-outline" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={takePicture}
              className="w-20 h-20 rounded-full items-center justify-center"
              disabled={!isCameraReady}
            >
              <View className="w-16 h-16 rounded-full bg-white border-4 border-secondary" />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* History Bar */}
        {/* <View className="pb-4 items-center">
          <TouchableOpacity className="flex-row items-center space-x-2 bg-black/50 px-4 py-2 rounded-full">
            <Image
              source={require('../../assets/images/profile.png')}
              className="w-8 h-8 rounded-lg"
            />
            <Text className="text-white font-psemibold">Lịch sử</Text>
          </TouchableOpacity>
        </View> */}
      </SafeAreaView>
    </View>
  );
}
