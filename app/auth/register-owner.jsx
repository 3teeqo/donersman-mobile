import React, { useMemo } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const RegisterOwner = () => {
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: '#070e1b' },
    container: { padding: 20, gap: 12 },
    title: { color: '#f8fafc', fontSize: 22, fontWeight: '700' },
    text: { color: '#94a3b8', fontSize: 15 },
    card: { backgroundColor: '#0c1627', borderColor: '#1e293b', borderWidth: 1, borderRadius: 16, padding: 16 },
  }), []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Account</Text>
        <View style={styles.card}>
          <Text style={styles.text}>
            Admin registration is disabled in this build. Please log in with the fixed credentials:
          </Text>
          <Text style={[styles.text, { marginTop: 8 }]}>Username: Admin</Text>
          <Text style={styles.text}>Password: Habibi321</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterOwner;
