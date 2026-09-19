import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PicsumImage } from '../types';
import { useFavoritesStore } from '../store/favoritesStore';

interface Props {
  image: PicsumImage;
  onPress: () => void;
}

export const ImageCard = React.memo(({ image, onPress }: Props) => {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(image.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  // Use a constrained image size thumbnail from Picsum for optimal FlatList memory
  const thumbnailUrl = `https://picsum.photos/id/${image.id}/300/200`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.infoRow}>
        <View style={styles.textContainer}>
          <Text style={styles.author} numberOfLines={1}>{image.author}</Text>
          <Text style={styles.idLabel}>ID: #{image.id}</Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(image)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#e63946' : '#6c757d'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: '#e9ecef',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  author: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212529',
  },
  idLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
});