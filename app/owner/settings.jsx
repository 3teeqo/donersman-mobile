import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { Redirect } from 'expo-router';

const OwnerSettings = () => {
  const { user, role, loading: authLoading, logout } = useAuth();
  const { lang, setLang } = useI18n();
  const [name, setName] = useState('Doner Habibi');
  const [phone, setPhone] = useState('+972 555 1234');
  const [address, setAddress] = useState('123 Main St, City');

  const p = { bg: '#f7fbff', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', sub: '#475569', accent: '#2563eb', accentText: '#ffffff' };
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: p.bg },
    container: { padding: 16, gap: 12 },
    title: { color: p.text, fontSize: 20, fontWeight: '700' },
    label: { color: p.sub },
    input: { backgroundColor: p.surface, borderColor: p.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: p.text },
    btn: { backgroundColor: p.accent, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginTop: 8, alignSelf: 'flex-start' },
    btnText: { color: p.accentText, fontWeight: '700' },
  }), []);

  const save = () => {
    // Persist locally for now; future: backend integration
    console.log('Saved', { name, phone, address });
  };

  return (
    <SafeAreaView style={styles.root}>
      {authLoading ? null : !user ? (
        <Redirect href="/auth/login" />
      ) : role !== 'owner' ? (
        <Redirect href="/" />
      ) : null}
      <View style={styles.container}>
        <Text style={styles.title}>Restaurant Settings</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} />
        <Text style={styles.label}>Language</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.btn} onPress={() => setLang('en')}><Text style={styles.btnText}>English {lang==='en' ? '✓' : ''}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => setLang('ar')}><Text style={styles.btnText}>العربية {lang==='ar' ? '✓' : ''}</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btn} onPress={save}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={logout}>
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OwnerSettings;
