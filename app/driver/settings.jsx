import React, { useMemo } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

const DriverSettings = () => {
  const { logout, user, role, loading } = useAuth();
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: '#070e1b' },
    container: { padding: 16, gap: 12 },
    title: { color: '#f8fafc', fontSize: 20, fontWeight: '700' },
    label: { color: '#94a3b8' },
    value: { color: '#f8fafc' },
    btn: { backgroundColor: '#22c55e', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginTop: 16 },
    btnText: { color: '#0f172a', fontWeight: '700', textAlign: 'center' },
  }), []);

  return (
    <SafeAreaView style={styles.root}>
      {loading ? null : !user ? (
        <Redirect href="/auth/login" />
      ) : role !== 'driver' ? (
        <Redirect href="/" />
      ) : null}
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.label}>Logged in as</Text>
        <Text style={styles.value}>{user?.email || 'driver'}</Text>
        <TouchableOpacity style={styles.btn} onPress={logout}>
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DriverSettings;
