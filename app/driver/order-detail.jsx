import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { OrdersService } from '../../shared/services/orders';
import { useAuth } from '../../contexts/AuthContext';

const OrderDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: '#070e1b' },
    container: { padding: 16, gap: 12 },
    title: { color: '#f8fafc', fontSize: 20, fontWeight: '700' },
    card: { borderWidth: 1, borderColor: '#1e293b', backgroundColor: '#0c1627', borderRadius: 16, padding: 14 },
    label: { color: '#94a3b8' },
    value: { color: '#f8fafc', fontWeight: '600' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    btnRow: { flexDirection: 'row', gap: 10, marginTop: 16, flexWrap: 'wrap' },
    btn: { backgroundColor: '#22c55e', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
    btnText: { color: '#0f172a', fontWeight: '700' },
    subtle: { color: '#94a3b8' },
    badge: { marginTop: 6, alignSelf: 'flex-start', backgroundColor: '#111d2e', borderWidth: 1, borderColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    badgeText: { color: '#cbd5f5', fontWeight: '600' },
  }), []);

  useEffect(() => {
    (async () => {
      try {
        const list = await OrdersService.getAvailableDriverOrders();
        const found = list.find((o) => o.id === id);
        setOrder(found || null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (authLoading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'driver') return <Redirect href="/" />;

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={[styles.container, { alignItems: 'center', marginTop: 30 }]}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.subtle}>Loading order…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={[styles.container, { alignItems: 'center', marginTop: 30 }]}>
          <Text style={styles.subtle}>Order not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const total = (order.payout || 0) + (order.tip || 0);
  const nextAction = () => {
    const s = order?.deliveryStatus || 'unassigned';
    if (s === 'unassigned') return { label: 'Accept', next: 'accepted' };
    if (s === 'accepted') return { label: 'Arrived at Restaurant', next: 'arrived' };
    if (s === 'arrived') return { label: 'Picked Up', next: 'picked_up' };
    if (s === 'picked_up') return { label: 'On The Way', next: 'on_the_way' };
    if (s === 'on_the_way') return { label: 'Delivered', next: 'delivered' };
    return null;
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>{order.title}</Text>
        <View style={styles.card}>
          <View style={styles.row}><Text style={styles.label}>Payout</Text><Text style={styles.value}>ILS {total.toFixed(2)}</Text></View>
          {order.tip ? (
            <View style={styles.row}><Text style={styles.label}>Includes tip</Text><Text style={styles.value}>ILS {order.tip.toFixed(2)}</Text></View>
          ) : null}
          <View style={styles.row}><Text style={styles.label}>Pickup</Text><Text style={styles.value}>{order.pickup?.address || 'Restaurant'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Dropoff</Text><Text style={styles.value}>{order.dropoff?.address || 'Customer'}</Text></View>
        </View>
        <View style={styles.badge}><Text style={styles.badgeText}>Status: {order.deliveryStatus || 'unassigned'}</Text></View>
        <View style={styles.btnRow}>
          {nextAction() && (
            <TouchableOpacity style={styles.btn} onPress={async () => {
              const n = nextAction();
              if (!n) return; 
              await OrdersService.updateDeliveryStatus(order.id, n.next);
              const list = await OrdersService.getAvailableDriverOrders();
              const found = list.find((o) => o.id === id);
              setOrder(found || null);
              Alert.alert('Status Updated', `Order marked as ${n.next.replace('_',' ')}`);
            }}> 
              <Text style={styles.btnText}>{nextAction().label}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
            <Text style={styles.btnText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderDetail;
