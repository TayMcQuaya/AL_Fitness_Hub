import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { MaterialIcons } from "@expo/vector-icons";

export const VideoPlayerModal = ({ visible, videoSource, pillarName, onClose }) => {
  const [firstFrameRendered, setFirstFrameRendered] = useState(false);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const videoWidth = screenWidth - 48;
  const videoHeight = Math.min(videoWidth * (9 / 16), screenHeight * 0.6);

  const player = useVideoPlayer(videoSource || "", (p) => {
    p.loop = false;
  });

  useEffect(() => {
    if (!player) return;
    if (visible) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
      setFirstFrameRendered(false);
    }
  }, [visible, player]);

  if (!videoSource) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { width: videoWidth, maxHeight: screenHeight - 80 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>Coach Al — {pillarName || "Wellness"}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={[styles.videoBox, { width: videoWidth, height: videoHeight }]}>
            <VideoView
              player={player}
              style={styles.video}
              contentFit="contain"
              nativeControls
              onFirstFrameRender={() => setFirstFrameRendered(true)}
            />
            {!firstFrameRendered && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#13ec13" />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    marginRight: 12,
  },
  videoBox: {
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
