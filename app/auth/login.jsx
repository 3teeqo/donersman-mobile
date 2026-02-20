import React, { useMemo, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import RoleTabs from '../../components/RoleTabs';
import { MessagingService } from '../../shared/services/messaging';
import { showToast } from '../../shared/services/toast';
import { useI18n } from '../../contexts/I18nContext';

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [strength, setStrength] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: '#070e1b' },
    container: { padding: 20, gap: 12 },
    title: { color: '#f8fafc', fontSize: 28, fontWeight: '800', marginBottom: 6 },
    label: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
    input: {
      backgroundColor: 'rgba(148,163,184,0.12)',
      borderColor: '#1e293b', borderWidth: 1, borderRadius: 14,
      paddingHorizontal: 16, paddingVertical: 14, color: '#f8fafc', fontSize: 15,
    },
    inputError: { borderColor: '#ef4444' },
    button: { backgroundColor: '#f97316', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
    links: { color: '#94a3b8', marginTop: 10 },
    link: { color: '#f97316', fontWeight: '600' },
    error: { color: '#fca5a5' },
    hero: { height: 160, borderRadius: 20, backgroundColor: '#111d2e', borderWidth: 1, borderColor: '#1e293b', marginBottom: 16, overflow: 'hidden', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 12 },
    heroText: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    pwToggle: { position: 'absolute', right: 12, top: 10, padding: 8 },
    googleBtn: { backgroundColor: '#1f2937', borderRadius: 16, paddingVertical: 12, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#374151', flexDirection: 'row', justifyContent: 'center', gap: 8 },
    forgot: { color: '#94a3b8', textAlign: 'right', marginTop: 8 },
    strength: { marginTop: 6, fontSize: 12 },
  }), []);

  const validEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const calcStrength = (v) => {
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[a-z]/.test(v)) score++;
    if (/[0-9\W]/.test(v)) score++;
    if (score <= 1) return 'weak';
    if (score === 2 || score === 3) return 'medium';
    return 'strong';
  };

  const handleLogin = async () => {
    setError('');
    setEmailErr('');
    setPwErr('');
    const em = email.trim();
    if (!validEmail(em)) {
      setEmailErr('Enter a valid email');
      return;
    }
    if (password.length < 8 || !(/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9\W]/.test(password))) {
      setPwErr('Password must be 8+ chars with mixed case and a number or symbol');
      return;
    }
    try {
      setLoading(true);
      await login(em, password, role);
      if (role === 'driver') router.replace('/driver/dashboard');
      else if (role === 'owner') router.replace('/owner/dashboard');
      else router.replace('/');
    } catch (e) {
      setError((e && e.message) || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      setEmailErr('Enter your email first');
      return;
    }
    await MessagingService.sendEmail(email, 'Reset password', 'This is a mock password reset.');
    showToast('Password reset link sent (mock)');
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.hero}>
              <Text style={styles.heroText}>Welcome to Doner Habibi</Text>
            </View>
            <Text style={styles.title}>{t('welcome')}</Text>
            <RoleTabs value={role} onChange={setRole} />
            {role === 'owner' && (
              <Text style={[styles.error, { color: '#94a3b8' }]}>{t('adminHint')}</Text>
            )}

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Text style={styles.label}>{t('email')}</Text>
            <TextInput
              style={[styles.input, !!emailErr && styles.inputError]}
              value={email}
              onChangeText={(v)=> { setEmail(v); setEmailErr(''); }}
              placeholder="you@example.com"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            {!!emailErr && <Text style={styles.error}>{emailErr}</Text>}

            <Text style={styles.label}>{t('password')}</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[styles.input, !!pwErr && styles.inputError]}
                value={password}
                onChangeText={(v)=> { setPassword(v); setPwErr(''); setStrength(calcStrength(v)); }}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                secureTextEntry={!showPw}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity style={styles.pwToggle} onPress={()=> setShowPw((s)=>!s)}>
                <Ionicons name={showPw ? 'eye-off' : 'eye'} size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            {!!pwErr && <Text style={styles.error}>{pwErr}</Text>}
            {!!password && <Text style={[styles.strength, { color: strength==='strong' ? '#22c55e' : strength==='medium' ? '#f59e0b' : '#ef4444' }]}>Strength: {strength || 'weak'}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              <Text style={styles.btnText}>{t('continue')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleForgot}><Text style={styles.forgot}>{t('forgot')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.googleBtn} onPress={() => showToast('Google login coming soon')}>
              <Ionicons name="logo-google" size={16} color="#fff" />
              <Text style={{ color:'#fff', fontWeight:'700' }}>{t('google')}</Text>
            </TouchableOpacity>
            <View style={[styles.row, { marginTop: 8 }]}>
              <Text style={{ color:'#94a3b8' }}>Remember me</Text>
              <Switch value={remember} onValueChange={setRemember} />
            </View>

            <Text style={styles.links}>New here? <Link href="/auth/register-customer" style={styles.link}>{t('createCustomer')}</Link></Text>
            <Text style={styles.links}>Want to deliver? <Link href="/auth/register-driver" style={styles.link}>{t('applyDriver')}</Link></Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
