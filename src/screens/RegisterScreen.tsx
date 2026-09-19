import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useAuthStore } from '../store/authStore';

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];

export const RegisterScreen = ({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Register'>) => {
  const register = useAuthStore((s) => s.register);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);

  const handleRegister = () => {
    if (!fullName || !email || !mobileNumber || !address || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'All fields are mandatory.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email format.');
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobileNumber.trim())) {
      Alert.alert('Validation Error', 'Mobile number must be exactly 10 digits.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    const res = register({
      fullName: fullName.trim(),
      email: email.trim(),
      gender,
      mobileNumber: mobileNumber.trim(),
      address: address.trim(),
      city,
      password,
    });

    if (!res.success) {
      Alert.alert('Error', res.error);
      return;
    }

    Alert.alert('Success', 'Registration completed successfully! Please log in.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Account</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="John Doe" />

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="john@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.radioRow}>
        {(['Male', 'Female', 'Other'] as const).map((item) => (
          <TouchableOpacity key={item} style={styles.radioItem} onPress={() => setGender(item)}>
            <View style={[styles.radioCircle, gender === item && styles.radioActive]} />
            <Text style={styles.radioLabel}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Mobile Number (10 digits)</Text>
      <TextInput
        style={styles.input}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        placeholder="9876543210"
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Residential address" />

      <Text style={styles.label}>City</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setShowCityPicker(!showCityPicker)}>
        <Text style={styles.dropdownText}>{city}</Text>
        <Text style={styles.arrow}>{showCityPicker ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {showCityPicker && (
        <View style={styles.cityOptions}>
          {CITIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.cityOption}
              onPress={() => {
                setCity(c);
                setShowCityPicker(false);
              }}
            >
              <Text style={styles.cityOptionText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Minimum 6 characters"
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Re-enter password"
        secureTextEntry
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
        <Text style={styles.submitBtnText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9fa' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1a1a1a', textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: '#495057', marginTop: 12, marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  radioRow: { flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 6 },
  radioItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioActive: { backgroundColor: '#007bff' },
  radioLabel: { fontSize: 14, color: '#333' },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
  },
  dropdownText: { fontSize: 15, color: '#333' },
  arrow: { color: '#6c757d' },
  cityOptions: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, marginTop: 4 },
  cityOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  cityOptionText: { fontSize: 14, color: '#212529' },
  submitBtn: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, marginTop: 24, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkContainer: { marginTop: 16, marginBottom: 30, alignItems: 'center' },
  linkText: { color: '#6c757d', fontSize: 14 },
  linkBold: { color: '#007bff', fontWeight: 'bold' },
});