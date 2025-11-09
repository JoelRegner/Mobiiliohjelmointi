import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);
    }
  };

  if (hasPermission === null) {
    return <View><Text>Pyydetään kameran käyttöoikeutta...</Text></View>;
  }

  if (hasPermission === false) {
    return <View><Text>Ei lupaa käyttää kameraa</Text></View>;
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => {
                setType(
                  type === CameraType.back
                    ? CameraType.front
                    : CameraType.back
                );
              }}>
              <Text style={styles.text}> 🔁 </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
              <Text style={styles.text}>📷</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.preview}>
          <Image source={{ uri: photo }} style={styles.image} />
          <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)}>
            <Text style={styles.text}>Ota uusi kuva</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  text: {
    fontSize: 20,
    color: '#fff',
  },
  snapButton: {
    alignSelf: 'flex-end',
  },
  flipButton: {
    alignSelf: 'flex-end',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1e90ff',
    borderRadius: 10,
  },
});
