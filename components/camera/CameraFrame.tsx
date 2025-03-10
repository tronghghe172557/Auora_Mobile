import { View, TouchableOpacity, Text, Image } from 'react-native';
import { CameraView, CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { RefObject } from 'react';
import MessageInput from './MessageInput';

interface CameraFrameProps {
  frameSize: number;
  previewImage: string | null;
  cameraRef: RefObject<CameraView>;
  facing: CameraType;
  flash: boolean;
  isCameraReady: boolean;
  onCameraReady: () => void;
  onToggleFlash: () => void;
  message?: string;
  setMessage?: (message: string) => void;
  isUploading?: boolean;
}

export default function CameraFrame({
  frameSize,
  previewImage,
  cameraRef,
  facing,
  flash,
  isCameraReady,
  onCameraReady,
  onToggleFlash,
  message,
  setMessage,
  isUploading
}: CameraFrameProps) {
  return (
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
        {previewImage ? (
          <View className="flex-1">
            <Image 
              source={{ uri: previewImage }} 
              style={{ flex: 1 }}
              className="w-full h-full"
            />
            {setMessage && (
              <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <MessageInput
                  message={message || ""}
                  setMessage={setMessage}
                  isUploading={isUploading}
                />
              </View>
            )}
          </View>
        ) : (
          <CameraView 
            ref={cameraRef}
            style={{ flex: 1 }} 
            facing={facing} 
            enableTorch={flash}
            onCameraReady={onCameraReady}
          >
            {/* Camera Controls Overlay */}
            <View className="absolute top-4 left-4 right-4 flex-row justify-between">
              <TouchableOpacity
                onPress={onToggleFlash}
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
        )}
      </View>
    </View>
  );
} 