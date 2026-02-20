import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

const RegisterCustomer = () => {
  const { registerCustomer } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [strength, setStrength] = useState('');

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
  }), []);

  const validEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const calcStrength = (v) => {
    let s = 0; if (v.length>=8) s++; if (/[A-Z]/.test(v)) s++; if (/[a-z]/.test(v)) s++; if (/[0-9\W]/.test(v)) s++;
    return s<=1?'weak':(s<=3?'medium':'strong');
  };

  const handleSubmit = async () => {
    setError(''); setEmailErr(''); setPwErr('');
    if (!validEmail(email.trim())) { setEmailErr('Enter a valid email'); return; }
    const pass = password;
    if (pass.length<8 || !(/[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9\W]/.test(pass))) { setPwErr('Password must be 8+ chars with mixed case and a number or symbol'); return; }
    if (confirm !== pass) { setPwErr('Passwords do not match'); return; }
    try {
      await registerCustomer(name.trim(), email.trim(), password);
      router.replace('/');
    } catch (e) {
      setError((e && e.message) || 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Create customer account</Text>
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#64748b" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={[styles.input, !!emailErr && styles.inputError]} value={email} onChangeText={(v)=> { setEmail(v); setEmailErr(''); }} placeholder="you@example.com" placeholderTextColor="#64748b" autoCapitalize="none" />
        {!!emailErr && <Text style={styles.error}>{emailErr}</Text>}
        <Text style={styles.label}>Password</Text>
        <View style={{ position:'relative' }}>
          <TextInput style={[styles.input, !!pwErr && styles.inputError]} value={password} onChangeText={(v)=> { setPassword(v); setPwErr(''); setStrength(calcStrength(v)); }} placeholder="••••••••" placeholderTextColor="#64748b" secureTextEntry={!showPw} />
          <TouchableOpacity style={{ position:'absolute', right:12, top:10, padding:8 }} onPress={()=> setShowPw((s)=>!s)}>
            <Ionicons name={showPw? 'eye-off':'eye'} size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>
        <Text style={{ color: strength==='strong'? '#22c55e' : strength==='medium'? '#f59e0b':'#ef4444' }}>Strength: {strength||'weak'}</Text>
        <Text style={styles.label}>Confirm password</Text>
        <TextInput style={[styles.input, !!pwErr && styles.inputError]} value={confirm} onChangeText={(v)=> { setConfirm(v); setPwErr(''); }} placeholder="••••••••" placeholderTextColor="#64748b" secureTextEntry={!showPw} />
        {!!pwErr && <Text style={styles.error}>{pwErr}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={styles.btnText}>Create account</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterCustomer;
