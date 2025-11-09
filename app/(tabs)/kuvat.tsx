import React, { useState, useCallback } from "react";
import { View, Image, ScrollView, StyleSheet } from "react-native";
import { Directory } from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";

const KuvatScreen = () => {
  const [images, setImages] = useState<string[]>([]);

  const loadImages = async () => {
    try {
      const dirUri = Directory.document("images"); 
      const dirInfo = await Directory.getInfoAsync(dirUri);

      if (!dirInfo.exists) {
        setImages([]);
        return;
      }

      const files = await Directory.readDirAsync(dirUri);
      const uris = files
        .filter((f) => f.isFile)
        .map((f) => f.uri)
        .reverse();

      setImages(uris);
    } catch (error) {
      console.log("Error loading images:", error);
      setImages([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadImages();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {images.map((uri) => (
        <Image key={uri} source={{ uri }} style={styles.image} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 5,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});

export default KuvatScreen;
