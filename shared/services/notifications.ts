import { Store, KEYS } from './store';

export type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read?: boolean;
  role?: 'driver' | 'owner' | 'all';
};

export const NotificationsService = {
  async list(role?: 'driver' | 'owner') {
    const list = await Store.getJSON<Notification[]>(KEYS.notifications, []);
    if (!role) return list;
    return list.filter((n) => n.role === role || n.role === 'all' || !n.role);
  },
  async push(n: Omit<Notification, 'id' | 'createdAt'>) {
    const list = await this.list();
    const item: Notification = { id: Math.random().toString(36).slice(2), createdAt: Date.now(), ...n };
    const updated = [item, ...list];
    await Store.setJSON(KEYS.notifications, updated);
    return item;
  },
  async markRead(id: string, read = true) {
    const list = await this.list();
    const updated = list.map((n) => (n.id === id ? { ...n, read } : n));
    await Store.setJSON(KEYS.notifications, updated);
  },
  async clearAll() {
    await Store.setJSON(KEYS.notifications, []);
  },
};

