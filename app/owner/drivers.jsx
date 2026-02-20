import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { DriversService } from '../../shared/services/drivers';
import { useAppTheme } from '../../contexts/AppThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function OwnerDrivers() {
  const { user, role, loading: authLoading } = useAuth();
  const { colors } = useAppTheme();
  const p = { bg: '#f7fbff', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', sub: '#475569', accent: '#2563eb', accentText: '#ffffff' };
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: p.bg },
    container: { padding: 16 },
    card: { backgroundColor: p.surface, borderWidth: 1, borderColor: p.border, borderRadius: 16, padding: 14, marginBottom: 12 },
    title: { color: p.text, fontSize: 16, fontWeight: '700' },
    meta: { color: p.sub, marginTop: 6 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    btn: { backgroundColor: p.accent, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
    btnText: { color: p.accentText, fontWeight: '700' },
  }), []);

  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // For now, reuse applications as a pseudo driver list
    (async () => {
      const list = await DriversService.getApplications();
      setDrivers(list.map((a) => ({ id: a.id, name: a.name, vehicleType: a.vehicleType, status: a.status })));
    })();
  }, []);

  if (authLoading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'owner') return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <FlatList
          data={drivers}
          keyExtractor={(d) => d.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.meta}>{item.vehicleType.toUpperCase()} • {item.status}</Text>
              <View style={styles.row}>
                <Text style={styles.meta}>0 active orders</Text>
                <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Message</Text></TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
