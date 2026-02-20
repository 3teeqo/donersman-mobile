import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NotificationsService } from '../../shared/services/notifications';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function OwnerBroadcasts() {
  const { user, role, loading } = useAuth();
  const [title, setTitle] = useState('Announcement');
  const [body, setBody] = useState('New promotion starts today!');
  const p = { bg: '#f7fbff', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', sub: '#475569', accent: '#2563eb', accentText: '#ffffff' };
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: p.bg },
    container: { padding: 16, gap: 12 },
    title: { color: p.text, fontSize: 20, fontWeight: '700' },
    label: { color: p.sub },
    input: { backgroundColor: p.surface, borderColor: p.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: p.text },
    btn: { backgroundColor: p.accent, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignSelf: 'flex-start' },
    btnText: { color: p.accentText, fontWeight: '700' },
  }), []);

  if (loading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'owner') return <Redirect href="/" />;

  const send = async () => {
    await NotificationsService.push({ title, body, role: 'driver' });
    Alert.alert('Sent', 'Broadcast delivered to drivers');
    setBody('');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Broadcast to Drivers</Text>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />
        <Text style={styles.label}>Message</Text>
        <TextInput style={[styles.input, { height: 100 }]} value={body} onChangeText={setBody} multiline />
        <TouchableOpacity style={styles.btn} onPress={send}><Text style={styles.btnText}>Send</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
