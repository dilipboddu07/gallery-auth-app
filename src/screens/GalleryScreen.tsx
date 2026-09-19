import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, FilterCategory } from '../types';
import { useGallery } from '../hooks/useGallery';
import { ImageCard } from '../components/ImageCard';

export const GalleryScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList>) => {
  const {
    images,
    loading,
    refreshing,
    error,
    onRefresh,
    loadMore,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    retry,
  } = useGallery();

  const filterOptions: FilterCategory[] = ['ALL', 'A-M', 'N-Z'];

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by author name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filterOptions.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, filterCategory === cat && styles.activeChip]}
            onPress={() => setFilterCategory(cat)}
          >
            <Text style={[styles.filterText, filterCategory === cat && styles.activeFilterText]}>
              {cat === 'ALL' ? 'All Images' : `Author ${cat}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error View with Retry */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={retry}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main FlatList */}
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard
            image={item}
            onPress={() => navigation.navigate('ImageDetails', { image: item })}
          />
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator size="small" color="#007bff" style={{ marginVertical: 16 }} />
          ) : null
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No images found matching criteria.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f3f5' },
  searchContainer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
  },
  activeChip: { backgroundColor: '#007bff' },
  filterText: { fontSize: 12, color: '#495057', fontWeight: '500' },
  activeFilterText: { color: '#fff', fontWeight: 'bold' },
  errorBox: {
    margin: 16,
    padding: 12,
    backgroundColor: '#ffe3e3',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: { color: '#c92a2a', marginBottom: 8 },
  retryBtn: { backgroundColor: '#c92a2a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  retryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#868e96', fontSize: 14 },
});