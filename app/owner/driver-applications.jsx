import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { DriversService } from '../../shared/services/drivers';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

const DriverApplications = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [apps, setApps] = useState([]);

  const p = { bg: '#f7fbff', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', sub: '#475569', accent: '#2563eb', accentText: '#ffffff', muted: '#f1f5f9' };
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: p.bg },
    container: { padding: 16 },
    title: { color: p.text, fontSize: 20, fontWeight: '700', marginBottom: 12 },
    card: { borderWidth: 1, borderColor: p.border, backgroundColor: p.surface, borderRadius: 16, padding: 14, marginBottom: 10 },
    name: { color: p.text, fontWeight: '600' },
    meta: { color: p.sub, marginTop: 4 },
    row: { flexDirection: 'row', gap: 10, marginTop: 10 },
    btn: { backgroundColor: p.accent, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
    btnText: { color: p.accentText, fontWeight: '700' },
    ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: p.accent },
    ghostText: { color: p.accent },
  }), []);

  useEffect(() => {
    (async () => {
      const list = await DriversService.getApplications();
      setApps(list);
    })();
  }, []);

  if (authLoading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'owner') return <Redirect href="/" />;

  const approve = async (id) => {
    await DriversService.approveApplication(id);
    const list = await DriversService.getApplications();
    setApps(list);
  };

  const reject = async (id) => {
    await DriversService.rejectApplication(id);
    const list = await DriversService.getApplications();
    setApps(list);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Driver Applications</Text>
        <FlatList
          data={apps}
          keyExtractor={(a) => a.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.email} • {item.vehicleType.toUpperCase()} • {item.status}</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.btn} onPress={() => approve(item.id)}>
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={() => reject(item.id)}>
                  <Text style={[styles.btnText, styles.ghostText]}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default DriverApplications;
