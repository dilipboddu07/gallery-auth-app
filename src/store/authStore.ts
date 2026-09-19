import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

interface AuthState {
  registeredUsers: UserProfile[];
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  register: (user: Omit<UserProfile, 'id'>) => { success: boolean; error?: string };
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      registeredUsers: [],
      currentUser: null,
      isAuthenticated: false,

      register: (userData) => {
        const { registeredUsers } = get();
        const exists = registeredUsers.some(
          (u) => u.email.toLowerCase() === userData.email.toLowerCase()
        );
        if (exists) {
          return { success: false, error: 'Email already registered.' };
        }
        const newUser: UserProfile = { ...userData, id: Date.now().toString() };
        set({ registeredUsers: [...registeredUsers, newUser] });
        return { success: true };
      },

      login: (email, password) => {
        const { registeredUsers } = get();
        const found = registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) {
          return { success: false, error: 'Invalid email or password.' };
        }
        set({ currentUser: found, isAuthenticated: true });
        return { success: true };
      },

      logout: () => set({ currentUser: null, isAuthenticated: false }),

      updateProfile: (data) => {
        const { currentUser, registeredUsers } = get();
        if (!currentUser) return;
        const updated = { ...currentUser, ...data };
        set({
          currentUser: updated,
          registeredUsers: registeredUsers.map((u) => (u.id === currentUser.id ? updated : u)),
        });
      },
    }),
    {
      name: 'auth-session-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);