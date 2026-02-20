import AsyncStorage from '@react-native-async-storage/async-storage';

export const Store = {
  async getJSON<T>(key: string, fallback: T): Promise<T> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  async setJSON(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  async remove(key: string) {
    try { await AsyncStorage.removeItem(key); } catch {}
  }
};

export const KEYS = {
  orders: 'mock_orders_state_v1',
  menu: 'mock_menu_items_v1',
  notifications: 'mock_notifications_v1',
  driverProfile: 'mock_driver_profile_v1',
};

