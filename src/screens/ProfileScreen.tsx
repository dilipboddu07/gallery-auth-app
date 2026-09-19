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
import { useAuthStore } from '../store/authStore';

export const ProfileScreen = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobileNumber || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');

  const handleSave = () => {
    if (!fullName || !mobileNumber || !address || !city) {
      Alert.alert('Error', 'Fields cannot be empty.');
      return;
    }
    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      Alert.alert('Error', 'Mobile number must be 10 digits.');
      return;
    }

    updateProfile({
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      address: address.trim(),
      city: city.trim(),
    });

    setIsEditing(false);
    Alert.alert('Updated', 'Profile details updated successfully.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>User Profile</Text>

        <Text style={styles.fieldLabel}>Full Name</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
        ) : (
          <Text style={styles.fieldValue}>{currentUser?.fullName}</Text>
        )}

        <Text style={styles.fieldLabel}>Email Address</Text>
        <Text style={[styles.fieldValue, styles.readOnly]}>{currentUser?.email} (Read-only)</Text>

        <Text style={styles.fieldLabel}>Gender</Text>
        <Text style={[styles.fieldValue, styles.readOnly]}>{currentUser?.gender}</Text>

        <Text style={styles.fieldLabel}>Mobile Number</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="numeric"
            maxLength={10}
          />
        ) : (
          <Text style={styles.fieldValue}>{currentUser?.mobileNumber}</Text>
        )}

        <Text style={styles.fieldLabel}>City</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={city} onChangeText={setCity} />
        ) : (
          <Text style={styles.fieldValue}>{currentUser?.city}</Text>
        )}

        <Text style={styles.fieldLabel}>Address</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={address} onChangeText={setAddress} />
        ) : (
          <Text style={styles.fieldValue}>{currentUser?.address}</Text>
        )}

        {isEditing ? (
          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave}>
              <Text style={styles.btnText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={[styles.btnText, { color: '#333' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.btn, styles.editBtn]} onPress={() => setIsEditing(true)}>
            <Text style={styles.btnText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8f9fa', flexGrow: 1 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 18, elevation: 2 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#212529' },
  fieldLabel: { fontSize: 12, color: '#6c757d', marginTop: 12, textTransform: 'uppercase', fontWeight: '600' },
  fieldValue: { fontSize: 15, color: '#212529', marginTop: 4, fontWeight: '500' },
  readOnly: { color: '#868e96' },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
    fontSize: 15,
  },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  editBtn: { backgroundColor: '#007bff', marginTop: 20 },
  saveBtn: { backgroundColor: '#28a745' },
  cancelBtn: { backgroundColor: '#e9ecef' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  logoutBtn: {
    marginTop: 24,
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});