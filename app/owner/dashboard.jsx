import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAppTheme } from '../../contexts/AppThemeContext';
import { OrdersService } from '../../shared/services/orders';
import { useAuth } from '../../contexts/AuthContext';

const OwnerDashboard = () => {
  const router = useRouter();
  const { user, role, loading: authLoading, logout } = useAuth();
  const p = { bg: '#f7fbff', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', sub: '#475569', accent: '#2563eb', accentText: '#ffffff', muted: '#f1f5f9' };
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: p.bg },
    container: { padding: 16, gap: 14 },
    title: { color: p.text, fontSize: 22, fontWeight: '700' },
    grid: { flexDirection: 'row', gap: 12 },
    metric: { flex: 1, borderWidth: 1, borderColor: p.border, backgroundColor: p.surface, borderRadius: 16, padding: 14 },
    metricLabel: { color: p.sub },
    metricValue: { color: p.text, fontSize: 20, fontWeight: '800' },
    card: { borderWidth: 1, borderColor: p.border, backgroundColor: p.surface, borderRadius: 16, padding: 16 },
    cardTitle: { color: p.text, fontSize: 16, fontWeight: '600', marginBottom: 8 },
    cardDesc: { color: p.sub },
    btn: { backgroundColor: p.accent, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginTop: 12, alignSelf: 'flex-start' },
    btnText: { color: p.accentText, fontWeight: '700' },
    listItem: { borderWidth: 1, borderColor: p.border, backgroundColor: p.surface, borderRadius: 12, padding: 12, marginBottom: 8 },
    listTitle: { color: p.text, fontWeight: '600' },
    listMeta: { color: p.sub },
  }), []);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => setOrders(await OrdersService.listAdminOrders()))();
  }, []);

  if (authLoading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'owner') return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, Owner</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          <View style={styles.grid}>
            <View style={styles.metric}><Text style={styles.metricLabel}>Open Orders</Text><Text style={styles.metricValue}>{orders.filter(o => o.status !== 'delivered' && o.status !== 'rejected').length}</Text></View>
            <View style={styles.metric}><Text style={styles.metricLabel}>Delivered</Text><Text style={styles.metricValue}>{orders.filter(o => o.status === 'delivered').length}</Text></View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Menu Editor</Text>
          <Text style={styles.cardDesc}>Add, remove, and reorder dishes.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/owner/menu-editor')}>
            <Text style={styles.btnText}>Open</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Driver Applications</Text>
          <Text style={styles.cardDesc}>Review and approve rider applications.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/owner/driver-applications')}>
            <Text style={styles.btnText}>Open</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Orders</Text>
          <FlatList
            data={orders.slice(0, 5)}
            keyExtractor={(o) => o.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listTitle}>{item.title}</Text>
                <Text style={styles.listMeta}>Status: {item.status} • ILS {(item.payout + (item.tip||0)).toFixed(2)}</Text>
              </View>
            )}
          />
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/owner/orders')}>
            <Text style={styles.btnText}>View All Orders</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <Text style={styles.cardDesc}>Update restaurant information.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/owner/settings')}>
            <Text style={styles.btnText}>Open</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={logout}>
            <Text style={styles.btnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OwnerDashboard;
