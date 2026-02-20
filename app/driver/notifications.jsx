import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NotificationsService } from '../../shared/services/notifications';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function DriverNotifications() {
  const { user, role, loading } = useAuth();
  const [items, setItems] = useState([]);
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: '#070e1b' },
    container: { padding: 16 },
    card: { borderWidth: 1, borderColor: '#1e293b', backgroundColor: '#0c1627', borderRadius: 16, padding: 12, marginBottom: 10 },
    title: { color: '#f8fafc', fontWeight: '700' },
    body: { color: '#94a3b8' },
    meta: { color: '#94a3b8', marginTop: 6 },
    btn: { alignSelf: 'flex-start', backgroundColor: '#22c55e', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginTop: 6 },
    btnText: { color: '#0f172a', fontWeight: '700' },
  }), []);

  const load = async () => setItems(await NotificationsService.list('driver'));
  useEffect(() => { load(); }, []);

  if (loading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'driver') return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          onRefresh={load}
          refreshing={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
              {!item.read && (
                <TouchableOpacity style={styles.btn} onPress={async () => { await NotificationsService.markRead(item.id); load(); }}>
                  <Text style={styles.btnText}>Mark read</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
