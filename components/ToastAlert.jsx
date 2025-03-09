import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef } from "react";

export default function ToastAlert({ visible, message = "Alert", onClose }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={{ 
        opacity: fadeAnim,
        position: 'absolute',
        top: 20,
        left: 10,
        right: 10,
        zIndex: 9999,
        borderRadius: 100,
      }}
      className="bg-secondary rounded-xl border-2 border-black"
    >
      <Text className="bg-secondary p-5 text-base font-psemibold text-center">
        {message}
      </Text>
    </Animated.View>
  );
} 