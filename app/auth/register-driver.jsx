import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

const RegisterDriver = () => {
  const { submitDriverApplication } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleType, setVehicleType] = useState('bike');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [nameErr, setNameErr] = useState('');
  const [licErr, setLicErr] = useState('');

  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: '#070e1b' },
    container: { padding: 20, gap: 12 },
    title: { color: '#f8fafc', fontSize: 22, fontWeight: '700' },
    label: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
    input: {
      backgroundColor: 'rgba(148,163,184,0.12)', borderColor: '#1e293b', borderWidth: 1, borderRadius: 14,
      paddingHorizontal: 16, paddingVertical: 14, color: '#f8fafc', fontSize: 15,
    },
    inputError: { borderColor: '#ef4444' },
    button: { backgroundColor: '#f97316', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
    btnText: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
    error: { color: '#fca5a5' },
    pillRow: { flexDirection: 'row', gap: 8 },
    pill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: '#1e293b', backgroundColor: '#0c1627' },
    pillActive: { backgroundColor: '#f97316', borderColor: '#f97316' },
    pillText: { color: '#cbd5f5', fontWeight: '600' },
    pillTextActive: { color: '#0f172a' },
  }), []);

  const validEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const handleSubmit = async () => {
    setError(''); setEmailErr(''); setNameErr(''); setLicErr('');
    if (!name.trim()) { setNameErr('Enter your name'); return; }
    if (!validEmail(email.trim())) { setEmailErr('Enter a valid email'); return; }
    if (!licenseNumber || licenseNumber.trim().length < 4) { setLicErr('Enter a valid license number'); return; }
    try {
      await submitDriverApplication({ name: name.trim(), email: email.trim(), vehicleType, licenseNumber: licenseNumber.trim(), nationalId: (nationalId||'').replace(/[^0-9]/g,'') });
      router.replace('/driver/dashboard');
    } catch (e) {
      setError('Submission failed');
    }
  };

  const vehicleChip = (id, label) => (
    <TouchableOpacity key={id} style={[styles.pill, vehicleType === id && styles.pillActive]} onPress={() => setVehicleType(id)}>
      <Text style={[styles.pillText, vehicleType === id && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Apply to be a rider</Text>
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Text style={styles.label}>Name</Text>
        <TextInput style={[styles.input, !!nameErr && styles.inputError]} value={name} onChangeText={(v)=> { setName(v); setNameErr(''); }} placeholder="Your name" placeholderTextColor="#64748b" />
        {!!nameErr && <Text style={styles.error}>{nameErr}</Text>}
        <Text style={styles.label}>Email</Text>
        <TextInput style={[styles.input, !!emailErr && styles.inputError]} value={email} onChangeText={(v)=> { setEmail(v); setEmailErr(''); }} placeholder="you@example.com" placeholderTextColor="#64748b" autoCapitalize="none" />
        {!!emailErr && <Text style={styles.error}>{emailErr}</Text>}
        <Text style={styles.label}>Vehicle type</Text>
        <View style={styles.pillRow}>
          {vehicleChip('bike','Bike')}
          {vehicleChip('scooter','Scooter')}
          {vehicleChip('car','Car')}
        </View>
        <Text style={styles.label}>License number</Text>
        <TextInput style={[styles.input, !!licErr && styles.inputError]} value={licenseNumber} onChangeText={(v)=> { setLicenseNumber(v.replace(/[^a-zA-Z0-9\-]/g,'')); setLicErr(''); }} placeholder="A-12345" placeholderTextColor="#64748b" />
        {!!licErr && <Text style={styles.error}>{licErr}</Text>}
        <Text style={styles.label}>National ID</Text>
        <TextInput style={styles.input} value={nationalId} onChangeText={(v)=> setNationalId(v.replace(/[^0-9]/g,''))} placeholder="ID Number" placeholderTextColor="#64748b" />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={styles.btnText}>Submit application</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterDriver;
