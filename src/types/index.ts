export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobileNumber: string;
  address: string;
  city: string;
  password?: string;
}

export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type FilterCategory = 'ALL' | 'A-M' | 'N-Z';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ImageDetails: { image: PicsumImage };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Gallery: undefined;
  Favorites: undefined;
  Profile: undefined;
};