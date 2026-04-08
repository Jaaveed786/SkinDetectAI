import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import { X, Camera as CameraIcon, Zap, RefreshCw } from 'lucide-react-native';

export default function CameraScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) return <View style={styles.container} />;
  if (hasPermission === false) return <Text style={styles.error}>No access to camera</Text>;

  const handleCapture = () => {
    // Simulate capture
    navigation.navigate('Results', { 
      imageUri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000' 
    });
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <SafeAreaView style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <X color="#fff" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Zap color="#fff" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            <View style={styles.scanLine} />
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity 
              onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}
              style={styles.iconBtn}
            >
              <RefreshCw color="#fff" size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleCapture} style={styles.captureBtn}>
              <View style={styles.captureInner} />
            </TouchableOpacity>

            <View style={styles.iconBtn} />
          </View>
        </SafeAreaView>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  scannerFrame: { width: '80%', aspectRatio: 1, alignSelf: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(45, 212, 191, 0.5)', justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 20, height: 20, borderColor: '#2dd4bf', borderWidth: 4 },
  tl: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0 },
  tr: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0 },
  bl: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0 },
  br: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0 },
  scanLine: { width: '100%', height: 2, backgroundColor: '#2dd4bf', opacity: 0.6, shadowColor: '#2dd4bf', shadowRadius: 10, shadowOpacity: 1 },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 },
  captureBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#fff' },
  error: { color: '#fff', textAlign: 'center', marginTop: 100 }
});
