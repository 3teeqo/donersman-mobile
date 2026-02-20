import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
      <Stack.Screen name="register-customer" options={{ title: 'Create Account' }} />
      <Stack.Screen name="register-driver" options={{ title: 'Driver Application' }} />
      <Stack.Screen name="register-owner" options={{ title: 'Owner / Admin' }} />
    </Stack>
  );
}

