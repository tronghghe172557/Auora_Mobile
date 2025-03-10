import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface BottomControlsProps {
  isPreviewMode: boolean;
  isCameraReady: boolean;
  onCancel: () => void;
  onCapture: () => void;
  onUpload: () => void;
  onFlipCamera: () => void;
}

export default function BottomControls({
  isPreviewMode,
  isCameraReady,
  onCancel,
  onCapture,
  onUpload,
  onFlipCamera,
}: BottomControlsProps) {
  return (
    <View className="pb-10">
      <View className="flex-row justify-around items-center px-4">
        <TouchableOpacity onPress={isPreviewMode ? onCancel : undefined}>
          <Ionicons 
            name={isPreviewMode ? "close-outline" : "images-outline"} 
            size={30} 
            color="white" 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={isPreviewMode ? onUpload : onCapture}
          className="w-20 h-20 rounded-full items-center justify-center"
          disabled={!isCameraReady && !isPreviewMode}
        >
          <View className="w-16 h-16 rounded-full bg-white border-4 border-secondary flex items-center justify-center">
            {isPreviewMode && (
              <Ionicons name="arrow-up-outline" size={30} color="black" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={isPreviewMode ? undefined : onFlipCamera}>
          <Ionicons 
            name="camera-reverse-outline" 
            size={30} 
            color={isPreviewMode ? "transparent" : "white"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
} 