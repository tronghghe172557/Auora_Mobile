import { View, TouchableOpacity, Text, Image } from 'react-native';
import { CameraView, CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { RefObject, useState, useEffect } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
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
  const [zoom, setZoom] = useState(0);
  const [displayZoom, setDisplayZoom] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(0);

  // Update camera zoom whenever our zoom state changes
  useEffect(() => {
    setCurrentZoom(zoom);
    // Show zoom indicator
    setDisplayZoom(true);
    
    // Hide zoom indicator after delay
    const timer = setTimeout(() => {
      setDisplayZoom(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [zoom]);

  // Create a pinch gesture handler
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      setDisplayZoom(true);
    })
    .onUpdate((e) => {
      // Limit zoom between 0 and 1
      const newZoom = Math.min(Math.max(zoom + (e.scale - 1) * 0.05, 0), 1);
      setZoom(newZoom);
    })
    .onEnd(() => {
      // Hide zoom indicator after 2 seconds
      setTimeout(() => {
        setDisplayZoom(false);
      }, 2000);
    });

  // Function to handle zoom buttons
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 1);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0);
    setZoom(newZoom);
  };

  const zoomPercentage = Math.round(zoom * 100);

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
          <GestureDetector gesture={pinchGesture}>
            <CameraView 
              ref={cameraRef}
              style={{ flex: 1 }} 
              facing={facing} 
              enableTorch={flash}
              onCameraReady={onCameraReady}
              zoom={currentZoom}
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
                
                {/* Zoom indicator */}
                <TouchableOpacity className="w-10 h-10 bg-black/50 rounded-full items-center justify-center">
                  <Text className="text-white font-psemibold">
                    {zoomPercentage > 0 ? `${zoomPercentage}%` : "1×"}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Zoom controls */}
              <View className="absolute right-4 top-1/3 flex">
                <TouchableOpacity
                  onPress={handleZoomIn}
                  className="w-10 h-10 bg-black/50 rounded-full items-center justify-center mb-2"
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleZoomOut}
                  className="w-10 h-10 bg-black/50 rounded-full items-center justify-center"
                >
                  <Ionicons name="remove" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              {/* Zoom level indicator (shows briefly when zooming) */}
              {displayZoom && (
                <View className="absolute top-1/2 left-0 right-0 items-center">
                  <View className="bg-black/70 px-4 py-2 rounded-lg">
                    <Text className="text-white font-psemibold text-xl">
                      Zoom: {zoomPercentage}%
                    </Text>
                  </View>
                </View>
              )}
            </CameraView>
          </GestureDetector>
        )}
      </View>
    </View>
  );
}