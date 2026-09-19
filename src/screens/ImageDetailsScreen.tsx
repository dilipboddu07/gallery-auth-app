import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// Use /legacy to access cacheDirectory and downloadAsync in Expo SDK 52+
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';

export const ImageDetailsScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'ImageDetails'>) => {
  const { image } = route.params;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Storage permission is required to save photos.');
        return;
      }

      const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
      if (!baseDir) {
        throw new Error('Local file storage is unavailable on this device.');
      }

      const cleanDir = baseDir.endsWith('/') ? baseDir : `${baseDir}/`;
      const fileUri = `${cleanDir}${image.id}.jpg`;

      const downloadResult = await FileSystem.downloadAsync(image.download_url, fileUri);

      if (downloadResult.status !== 200) {
        throw new Error(`Download failed with status: ${downloadResult.status}`);
      }

      await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
      Alert.alert('Success', 'Image saved successfully to your gallery!');
    } catch (err: any) {
      Alert.alert('Download Error', err.message || 'Unable to download image.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Full-Screen Edge-to-Edge Image */}
      <Image
        source={{ uri: image.download_url }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Floating Overlay Controls */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.meta}>
          <Text style={styles.author}>{image.author}</Text>
          <Text style={styles.idLabel}>Image ID: #{image.id}</Text>
        </View>

        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="download-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.downloadBtnText}>Save to Device</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: { flex: 1, width: '100%', height: '100%' },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  iconBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: { flex: 1, marginRight: 12 },
  author: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  idLabel: { color: '#ced4da', fontSize: 12, marginTop: 2 },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  downloadBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});