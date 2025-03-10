import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface TopBarProps {
  onSave?: () => void;
  isPreviewMode: boolean;
}

export default function TopBar({ onSave, isPreviewMode }: TopBarProps) {
  return (
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
      <TouchableOpacity 
        className="w-10 h-10 bg-black/50 rounded-full items-center justify-center"
        onPress={isPreviewMode ? onSave : undefined}
      >
        <Ionicons 
          name={isPreviewMode ? "save-outline" : "chatbubble-outline"} 
          size={20} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );
} 