import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface BottomControlsProps {
  isPreviewMode: boolean;
  isCameraReady: boolean;
  onCancel: () => void;
  onCapture: () => void;
  onFlipCamera: () => void;
  onUpload?: () => void;
  canUpload?: boolean;
}

export default function BottomControls({
  isPreviewMode,
  isCameraReady,
  onCancel,
  onCapture,
  onFlipCamera,
  onUpload,
  canUpload
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

        {isPreviewMode ? (
          <TouchableOpacity 
            onPress={canUpload ? onUpload : undefined}
            className={`w-20 h-20 rounded-full items-center justify-center ${!canUpload ? 'opacity-50' : ''}`}
          >
            <View className="w-16 h-16 rounded-full bg-white border-4 border-secondary flex items-center justify-center">
              <Ionicons 
                name="arrow-up" 
                size={30} 
                color={canUpload ? "black" : "gray"} 
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={onCapture}
            className="w-20 h-20 rounded-full items-center justify-center"
            disabled={!isCameraReady}
          >
            <View className="w-16 h-16 rounded-full bg-white border-4 border-secondary" />
          </TouchableOpacity>
        )}

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