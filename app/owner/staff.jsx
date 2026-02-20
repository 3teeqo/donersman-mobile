import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function OwnerStaff() {
  const { user, role, loading } = useAuth();
  const [staff, setStaff] = useState([{ id: 's1', name: 'Sara', email: 'sara@habibi.com', role: 'staff' }]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: '#070e1b' },
    container: { padding: 16 },
    row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    input: { flex: 1, backgroundColor: 'rgba(148,163,184,0.12)', borderColor: '#1e293b', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#f8fafc' },
    btn: { backgroundColor: '#f97316', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
    btnText: { color: '#0f172a', fontWeight: '700' },
    card: { borderWidth: 1, borderColor: '#1e293b', backgroundColor: '#0c1627', borderRadius: 12, padding: 12, marginBottom: 8 },
    title: { color: '#f8fafc', fontWeight: '700' },
    meta: { color: '#94a3b8' },
  }), []);

  if (loading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'owner') return <Redirect href="/" />;

  const add = () => {
    if (!name.trim() || !email.trim()) return;
    setStaff((s) => [{ id: Math.random().toString(36).slice(2), name: name.trim(), email: email.trim(), role: 'staff' }, ...s]);
    setName(''); setEmail('');
  };

  const remove = (id) => setStaff((s) => s.filter((x) => x.id !== id));

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <View style={styles.row}>
          <TextInput placeholder="Name" placeholderTextColor="#64748b" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Email" placeholderTextColor="#64748b" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TouchableOpacity style={styles.btn} onPress={add}><Text style={styles.btnText}>Add</Text></TouchableOpacity>
        </View>
        <FlatList
          data={staff}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.meta}>{item.email} • {item.role}</Text>
              <TouchableOpacity style={[styles.btn, { marginTop: 8 }]} onPress={() => remove(item.id)}><Text style={styles.btnText}>Remove</Text></TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

