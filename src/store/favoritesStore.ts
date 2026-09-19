import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PicsumImage } from '../types';

interface FavoritesState {
  favorites: PicsumImage[];
  toggleFavorite: (image: PicsumImage) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (image) => {
        const { favorites } = get();
        const exists = favorites.some((item) => item.id === image.id);
        if (exists) {
          set({ favorites: favorites.filter((item) => item.id !== image.id) });
        } else {
          set({ favorites: [...favorites, image] });
        }
      },
      isFavorite: (id) => get().favorites.some((item) => item.id === id),
    }),
    {
      name: 'favorites-session-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);