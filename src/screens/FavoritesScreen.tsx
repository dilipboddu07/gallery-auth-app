import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useFavoritesStore } from '../store/favoritesStore';
import { ImageCard } from '../components/ImageCard';

export const FavoritesScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList>) => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const [search, setSearch] = useState('');

  const filteredFavorites = useMemo(() => {
    return favorites.filter((img) =>
      img.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [favorites, search]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Search favorites by author..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard
            image={item}
            onPress={() => navigation.navigate('ImageDetails', { image: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {search ? 'No matching favorites found.' : 'You have not favorited any images yet.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f3f5' },
  searchBox: { padding: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  emptyContainer: { padding: 50, alignItems: 'center' },
  emptyText: { color: '#868e96', fontSize: 14 },
});