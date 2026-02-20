import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { OrdersService } from '../../shared/services/orders';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function OwnerAnalytics() {
  const { user, role, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const p = { bg: '#f7fbff', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', sub: '#475569' };
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: p.bg },
    container: { padding: 16, gap: 12 },
    title: { color: p.text, fontSize: 20, fontWeight: '700' },
    row: { flexDirection: 'row', gap: 12 },
    card: { flex: 1, backgroundColor: p.surface, borderColor: p.border, borderWidth: 1, borderRadius: 16, padding: 16 },
    label: { color: p.sub },
    value: { color: p.text, fontSize: 22, fontWeight: '800' },
  }), []);

  useEffect(() => { (async () => setOrders(await OrdersService.listAdminOrders()))(); }, []);

  if (loading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'owner') return <Redirect href="/" />;

  const completed = orders.filter((o) => o.deliveryStatus === 'delivered');
  const revenue = completed.reduce((s, o) => s + (o.payout || 0) + (o.tip || 0), 0);
  const preparing = orders.filter((o) => o.kitchenStatus === 'preparing').length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.row}>
          <View style={styles.card}><Text style={styles.label}>Completed</Text><Text style={styles.value}>{completed.length}</Text></View>
          <View style={styles.card}><Text style={styles.label}>Revenue</Text><Text style={styles.value}>ILS {revenue.toFixed(2)}</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.card}><Text style={styles.label}>Preparing</Text><Text style={styles.value}>{preparing}</Text></View>
          <View style={styles.card}><Text style={styles.label}>Orders</Text><Text style={styles.value}>{orders.length}</Text></View>
        </View>
      </View>
    </SafeAreaView>
  );
}
