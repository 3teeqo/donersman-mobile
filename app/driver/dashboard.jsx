import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import { OrdersService } from '../../shared/services/orders';
import { DriverProfileService } from '../../shared/services/profile';
import { haversineKm } from '../../shared/utils/geo';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

const DriverDashboard = () => {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const [loc, setLoc] = useState(null);
  const [orders, setOrders] = useState([]);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: '#070e1b' },
    container: { padding: 16 },
    head: { color: '#f8fafc', fontSize: 20, fontWeight: '700', marginBottom: 12 },
    card: { borderWidth: 1, borderColor: '#1e293b', backgroundColor: '#0c1627', borderRadius: 16, padding: 14, marginBottom: 12 },
    title: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
    meta: { color: '#94a3b8', marginTop: 6 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    btn: { backgroundColor: '#22c55e', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
    btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#22c55e' },
    btnText: { color: '#0f172a', fontWeight: '700' },
    subtle: { color: '#94a3b8' },
    badge: { marginTop: 6, alignSelf: 'flex-start', backgroundColor: '#111d2e', borderWidth: 1, borderColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, },
    badgeText: { color: '#cbd5f5', fontSize: 12, fontWeight: '600' },
  }), []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Location', 'Permission required for distance calculation');
        } else {
          const pos = await Location.getCurrentPositionAsync({});
          setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }
        const list = await OrdersService.getAvailableDriverOrders();
        setOrders(list);
        const prof = await DriverProfileService.get();
        setAvailable(!!prof.available);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (authLoading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'driver') return <Redirect href="/" />;

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={[styles.container, { alignItems: 'center', marginTop: 30 }]}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.subtle}>Fetching nearby orders…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.head}>Available orders {available ? '(Online)' : '(Offline)'}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => router.push('/driver/profile')}><Text style={styles.btnText}>Profile</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => router.push('/driver/earnings')}><Text style={styles.btnText}>Earnings</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => router.push('/driver/notifications')}><Text style={styles.btnText}>Notifications</Text></TouchableOpacity>
        </View>
        {!available && <Text style={styles.subtle}>Go to Profile to toggle availability Online.</Text>}
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          renderItem={({ item }) => {
            if (!available) return null;
            const km = loc ? haversineKm(loc, item.dropoff) : null;
            const total = (item.payout || 0) + (item.tip || 0);
            return (
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>Payout: ILS {total.toFixed(2)} {item.tip ? `(incl. tip ILS ${item.tip.toFixed(2)})` : ''}</Text>
                <Text style={styles.meta}>Distance: {km ? `${km.toFixed(2)} km` : 'unknown'}</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>Status: {item.deliveryStatus || 'unassigned'}</Text></View>
                <View style={styles.row}>
                  <Text style={styles.subtle}>{item.items?.[0]?.name ?? 'Order'}</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={styles.btn} onPress={() => router.push({ pathname: '/driver/order-detail', params: { id: item.id } })}>
                      <Text style={styles.btnText}>View</Text>
                    </TouchableOpacity>
                    {!item.deliveryStatus || item.deliveryStatus === 'unassigned' ? (
                      <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={async () => {
                        await OrdersService.updateDeliveryStatus(item.id, 'accepted');
                        const list = await OrdersService.getAvailableDriverOrders();
                        setOrders(list);
                      }}>
                        <Text style={styles.btnText}>Accept</Text>
                      </TouchableOpacity>
                    ) : null}
                    {!item.deliveryStatus || item.deliveryStatus === 'unassigned' ? (
                      <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={async () => {
                        await OrdersService.updateDeliveryStatus(item.id, 'rejected');
                        const list = await OrdersService.getAvailableDriverOrders();
                        setOrders(list);
                      }}>
                        <Text style={styles.btnText}>Reject</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default DriverDashboard;
