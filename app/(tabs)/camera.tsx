import AntDesign from "@expo/vector-icons/AntDesign";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  Platform,
} from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const router = useRouter();
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync({
        base64: false,
        quality: 1,
      });

      if (photo?.uri) {
     
        setPhotoUri(photo.uri);
      }
    } catch (error) {
      console.log("Error taking picture:", error);
    }
  };

  const savePicture = async () => {
    if (!photoUri) return;

    try {
      const dirUri = FileSystem.documentDirectory + "images";
      const dirInfo = await FileSystem.getInfoAsync(dirUri);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
      }

      const newFileUri = dirUri + "/" + Date.now() + ".jpg";

      await FileSystem.copyAsync({
        from: photoUri,
        to: newFileUri,
      });

      console.log("Saved image to:", newFileUri);
      router.push("/(tabs)/kuvat");
    } catch (error) {
      console.log("Error saving image:", error);
    }
  };

  const discardPicture = () => {
    setPhotoUri(null);
  };

  const renderCamera = () => (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        ref={ref}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      />
      <View style={styles.shutterContainer}>
        <Pressable onPress={() => router.push("/(tabs)/kuvat")}>
          <AntDesign name="picture" size={32} color="white" />
        </Pressable>
        <Pressable onPress={takePicture}>
          {({ pressed }) => (
            <View style={[styles.shutterBtn, { opacity: pressed ? 0.5 : 1 }]}>
              <View style={[styles.shutterBtnInner, { backgroundColor: "white" }]} />
            </View>
          )}
        </Pressable>
        <View style={{ width: 32 }} />
      </View>
    </View>
  );

  const renderPreview = () => (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        maximumZoomScale={3}
        minimumZoomScale={1}
        contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
      >
        <Image
          source={{ uri: photoUri! }}
          style={styles.previewImage}
        />
      </ScrollView>
      <View style={styles.previewButtons}>
        <Button title="Save" onPress={savePicture} />
        <Button title="Discard" onPress={discardPicture} color="red" />
      </View>
    </View>
  );

  return <View style={styles.container}>{photoUri ? renderPreview() : renderCamera()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  previewImage: {
    width: 300, 
    height: 400,
    resizeMode: "contain",
    transform: [{ scale: 2.0 }],
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 20,
  },
});
