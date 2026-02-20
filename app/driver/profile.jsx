import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { DriverProfileService } from '../../shared/services/profile';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function DriverProfile() {
  const { user, role, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: '#070e1b' },
    container: { padding: 16, gap: 12 },
    title: { color: '#f8fafc', fontSize: 20, fontWeight: '700' },
    label: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
    input: { backgroundColor: 'rgba(148,163,184,0.12)', borderColor: '#1e293b', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#f8fafc' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    btn: { backgroundColor: '#f97316', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignSelf: 'flex-start' },
    btnText: { color: '#0f172a', fontWeight: '700' },
  }), []);

  useEffect(() => { (async () => setProfile(await DriverProfileService.get()))(); }, []);

  if (loading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'driver') return <Redirect href="/" />;
  if (!profile) return null;

  const save = async () => {
    await DriverProfileService.set(profile);
    Alert.alert('Saved', 'Profile updated');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Driver Profile</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={profile.name} onChangeText={(v) => setProfile({ ...profile, name: v })} />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={profile.email} onChangeText={(v) => setProfile({ ...profile, email: v })} autoCapitalize="none" />
        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={profile.phone || ''} onChangeText={(v) => setProfile({ ...profile, phone: v.replace(/[^0-9+\-\s]/g,'') })} keyboardType="phone-pad" />
        <Text style={styles.label}>Vehicle Type</Text>
        <TextInput style={styles.input} value={profile.vehicleType || 'bike'} onChangeText={(v) => setProfile({ ...profile, vehicleType: v })} />
        <Text style={styles.label}>License Number</Text>
        <TextInput style={styles.input} value={profile.licenseNumber || ''} onChangeText={(v) => setProfile({ ...profile, licenseNumber: v })} />
        <View style={styles.row}>
          <Text style={styles.label}>Available</Text>
          <Switch value={!!profile.available} onValueChange={async () => setProfile({ ...profile, available: await DriverProfileService.toggleAvailability() })} />
        </View>
        <TouchableOpacity style={styles.btn} onPress={save}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
