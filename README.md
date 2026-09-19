# React Native Gallery & Authentication Application

A mobile application built using React Native, TypeScript, and Zustand featuring user authentication flow, local persistence, infinite-scrolling gallery integration with Picsum Photos, and media downloads.

---

## 🛠 Tech Stack & Key Libraries

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **State Management**: Zustand (Centralized store)
- **Local Persistence**: `@react-native-async-storage/async-storage`
- **Networking & File Operations**: `expo-file-system`, React Native Native APIs
- **Icons**: `@expo/vector-icons`

---

## 📂 Project Architecture

```text
src/
├── components/       # Reusable modular UI components (ImageCard, etc.)
├── hooks/            # Custom hooks (useGallery, useDebounce)
├── navigation/       # Type-safe root navigation flows (Auth vs Main)
├── screens/          # Login, Register, Gallery, Favorites, Profile, Details
├── store/            # Centralized Zustand stores with AsyncStorage persistence
└── types/            # TypeScript data interfaces and navigation routes
