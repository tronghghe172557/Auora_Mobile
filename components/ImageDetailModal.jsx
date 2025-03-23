import React from "react";
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ImageDetailModal = ({ visible, image, onClose, createdAt, title }) => {
  const scale = new Animated.Value(0.5);
  const opacity = new Animated.Value(0);

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.5,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContent}>
              {/* Header */}
              <View className="flex-row justify-between items-center px-4 py-3">
                <Text className="text-white text-base">
                  {new Date(createdAt).toLocaleDateString("vi-VN")}
                </Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="contain"
                />

                {/* Message overlay inside image - auto-sizing based on content */}
                {title && (
                  <View
                    className="absolute bottom-7 left-5 right-0 flex items-center justify-center"
                    style={{ maxWidth: "90%" }}
                  >
                    <View className="bg-black/50 rounded-2xl p-3">
                      <Text className="text-white text-lg font-medium">
                        {title}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    height: height * 0.5, // Taking 50% of screen height
    borderRadius: 16,
    overflow: "hidden",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
  },
  imageContainer: {
    flex: 1,
    padding: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});

export default ImageDetailModal;
