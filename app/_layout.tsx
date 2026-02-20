import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppThemeProvider, useAppTheme } from '../contexts/AppThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { I18nProvider } from '../contexts/I18nContext';
import ThemeToggle from '../components/ThemeToggle';

function RootLayoutNavigator() {
  const { theme } = useAppTheme();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Main screen (index.jsx) */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="orders"
          options={{
            title: 'Orders',
            headerRight: () => (
              <ThemeToggle style={{ marginRight: 12 }} showLabel={false} />
            ),
          }}
        />
        <Stack.Screen
          name="payment"
          options={{
            title: 'Payment',
            headerRight: () => (
              <ThemeToggle style={{ marginRight: 12 }} showLabel={false} />
            ),
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <I18nProvider>
          <RootLayoutNavigator />
        </I18nProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}
