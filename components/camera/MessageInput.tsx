import {
  View,
  TextInput,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  isUploading?: boolean;
}

export default function MessageInput({
  message,
  setMessage,
  isUploading,
}: MessageInputProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="w-full">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Add a message..."
          placeholderTextColor="#CCC"
          className="text-white px-4 py-3 font-pmedium bg-black/30 rounded-full"
          editable={!isUploading}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
