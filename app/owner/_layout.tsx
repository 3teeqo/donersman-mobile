import { Stack } from 'expo-router';
import React from 'react';
import ThemeToggle from '../../components/ThemeToggle';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

function HeaderActions() {
  const { logout } = useAuth();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
      <ThemeToggle showLabel={false} style={{ marginRight: 8 }} />
      <TouchableOpacity onPress={logout} accessibilityLabel="Logout owner" accessibilityRole="button" style={{ paddingHorizontal: 8, paddingVertical: 6 }}>
        <Text style={{ color: '#f97316', fontWeight: '700' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function OwnerLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ title: 'Owner Dashboard', headerRight: () => <HeaderActions /> }} />
      <Stack.Screen name="orders" options={{ title: 'Orders', headerRight: () => <HeaderActions /> }} />
      <Stack.Screen name="drivers" options={{ title: 'Drivers', headerRight: () => <HeaderActions /> }} />
      <Stack.Screen name="menu-editor" options={{ title: 'Menu Editor', headerRight: () => <HeaderActions /> }} />
      <Stack.Screen name="analytics" options={{ title: 'Analytics', headerRight: () => <HeaderActions /> }} />
      <Stack.Screen name="broadcasts" options={{ title: 'Broadcasts', headerRight: () => <HeaderActions /> }} />
      <Stack.Screen name="staff" options={{ title: 'Staff', headerRight: () => <HeaderActions /> }} />
      <Stack.Screen name="driver-applications" options={{ title: 'Driver Applications', headerRight: () => <HeaderActions /> }} />
      <Stack.Screen name="settings" options={{ title: 'Settings', headerRight: () => <HeaderActions /> }} />
    </Stack>
  );
}
