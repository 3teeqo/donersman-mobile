import { Stack } from 'expo-router';
import React from 'react';
import ThemeToggle from '../../components/ThemeToggle';

export default function DriverLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ title: 'Driver', headerShown: true, headerRight: () => <ThemeToggle showLabel={false} style={{ marginRight: 12 }} /> }} />
      <Stack.Screen name="profile" options={{ title: 'Profile', headerRight: () => <ThemeToggle showLabel={false} style={{ marginRight: 12 }} /> }} />
      <Stack.Screen name="earnings" options={{ title: 'Earnings', headerRight: () => <ThemeToggle showLabel={false} style={{ marginRight: 12 }} /> }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications', headerRight: () => <ThemeToggle showLabel={false} style={{ marginRight: 12 }} /> }} />
      <Stack.Screen name="map" options={{ title: 'Route Preview', headerRight: () => <ThemeToggle showLabel={false} style={{ marginRight: 12 }} /> }} />
      <Stack.Screen name="order-detail" options={{ title: 'Order Detail', headerRight: () => <ThemeToggle showLabel={false} style={{ marginRight: 12 }} /> }} />
      <Stack.Screen name="settings" options={{ title: 'Settings', headerRight: () => <ThemeToggle showLabel={false} style={{ marginRight: 12 }} /> }} />
    </Stack>
  );
}
