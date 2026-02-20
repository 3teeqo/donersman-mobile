import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OrdersService } from '../../shared/services/orders';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function DriverEarnings() {
  const { user, role, loading } = useAuth();
  const [stats, setStats] = useState({ count: 0, earnings: 0, tips: 0 });
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: '#070e1b' },
    container: { padding: 16, gap: 12 },
    title: { color: '#f8fafc', fontSize: 20, fontWeight: '700' },
    card: { borderWidth: 1, borderColor: '#1e293b', backgroundColor: '#0c1627', borderRadius: 16, padding: 16 },
    label: { color: '#94a3b8' },
    value: { color: '#22c55e', fontSize: 22, fontWeight: '800' },
  }), []);

  useEffect(() => {
    (async () => {
      const orders = await OrdersService.listAdminOrders();
      const delivered = orders.filter((o) => o.deliveryStatus === 'delivered');
      const earnings = delivered.reduce((s, o) => s + (o.payout || 0) + (o.tip || 0), 0);
      const tips = delivered.reduce((s, o) => s + (o.tip || 0), 0);
      setStats({ count: delivered.length, earnings, tips });
    })();
  }, []);

  if (loading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'driver') return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Earnings</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Completed deliveries</Text>
          <Text style={styles.value}>{stats.count}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Total earnings</Text>
          <Text style={styles.value}>ILS {stats.earnings.toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Tips received</Text>
          <Text style={styles.value}>ILS {stats.tips.toFixed(2)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
