import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { OrdersService } from '../../shared/services/orders';
import { DriversService } from '../../shared/services/drivers';
import { useAppTheme } from '../../contexts/AppThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

const statusLabel = (s) => s?.replace('_', ' ') || 'new';

export default function OwnerOrders() {
  const { user, role, loading: authLoading } = useAuth();
  const p = { bg: '#f7fbff', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', sub: '#475569', accent: '#2563eb', accentText: '#ffffff', muted: '#f1f5f9' };
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: p.bg },
    container: { padding: 16 },
    card: { borderWidth: 1, borderColor: p.border, backgroundColor: p.surface, borderRadius: 16, padding: 14, marginBottom: 12 },
    title: { color: p.text, fontSize: 16, fontWeight: '700' },
    meta: { color: p.sub, marginTop: 6 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    chip: { alignSelf: 'flex-start', marginTop: 6, backgroundColor: p.muted, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: p.border },
    chipText: { color: p.sub, fontWeight: '600' },
    btnRow: { flexDirection: 'row', gap: 8 },
    btn: { backgroundColor: p.accent, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
    btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: p.accent },
    btnText: { color: p.accentText, fontWeight: '700' },
  }), []);

  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const list = await OrdersService.listAdminOrders();
    setOrders(list);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); (async () => setDrivers(await DriversService.getApplications()))(); }, []);

  if (authLoading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'owner') return <Redirect href="/" />;

  const update = async (id, status) => {
    await OrdersService.updateDeliveryStatus(id, status);
    await loadOrders();
    Alert.alert('Updated', `Order set to ${statusLabel(status)}`);
  };

  const updateKitchen = async (id, status) => {
    await OrdersService.updateKitchenStatus(id, status);
    await loadOrders();
  };

  const assign = async (id, driverId) => {
    await OrdersService.assignDriver(id, driverId);
    await loadOrders();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <FlatList
          refreshing={loading}
          onRefresh={loadOrders}
          data={orders}
          keyExtractor={(o) => o.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>Items: {item.items?.length || 0} • Payout: ILS {(item.payout + (item.tip || 0)).toFixed(2)}</Text>
              <View style={styles.chip}><Text style={styles.chipText}>Delivery: {statusLabel(item.deliveryStatus)}</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>Kitchen: {item.kitchenStatus || 'pending'}</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>Driver: {item.assignedDriverId || 'unassigned'}</Text></View>
              <View style={styles.row}>
                <Text style={styles.meta}>Tip: ILS {(item.tip || 0).toFixed(2)}</Text>
                <View style={styles.btnRow}>
                  {item.deliveryStatus !== 'accepted' && item.deliveryStatus !== 'picked_up' && item.deliveryStatus !== 'delivered' && (
                    <TouchableOpacity style={styles.btn} onPress={() => update(item.id, 'accepted')}>
                      <Text style={styles.btnText}>Mark Accepted</Text>
                    </TouchableOpacity>
                  )}
                  {item.deliveryStatus === 'accepted' && (
                    <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => update(item.id, 'picked_up')}>
                      <Text style={styles.btnText}>Mark Picked</Text>
                    </TouchableOpacity>
                  )}
                  {item.deliveryStatus === 'picked_up' && (
                    <TouchableOpacity style={styles.btn} onPress={() => update(item.id, 'delivered')}>
                      <Text style={styles.btnText}>Mark Delivered</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={[styles.row, { marginTop: 8 }]}>
                <Text style={styles.meta}>Kitchen</Text>
                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.btn} onPress={() => updateKitchen(item.id, 'pending')}><Text style={styles.btnText}>Pending</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.btn} onPress={() => updateKitchen(item.id, 'preparing')}><Text style={styles.btnText}>Preparing</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.btn} onPress={() => updateKitchen(item.id, 'ready')}><Text style={styles.btnText}>Ready</Text></TouchableOpacity>
                </View>
              </View>
              <View style={[styles.row, { marginTop: 8 }]}>
                <Text style={styles.meta}>Assign Driver</Text>
                <View style={styles.btnRow}>
                  {drivers.slice(0,3).map((d) => (
                    <TouchableOpacity key={d.id} style={[styles.btn, styles.btnGhost]} onPress={() => assign(item.id, d.id)}>
                      <Text style={styles.btnText}>{d.name.split(' ')[0]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
