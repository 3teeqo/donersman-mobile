import { DeliveryOrder } from './orders';

export type DriverApplication = {
  id: string;
  name: string;
  email: string;
  vehicleType: 'bike' | 'scooter' | 'car';
  licenseNumber?: string;
  nationalId?: string;
  status: 'pending' | 'approved' | 'rejected';
};

let pending: DriverApplication[] = [
  { id: 'app_1', name: 'Ali Rider', email: 'ali@riders.com', vehicleType: 'bike', status: 'pending' },
  { id: 'app_2', name: 'Sara Rider', email: 'sara@riders.com', vehicleType: 'car', status: 'pending' },
];

export const DriversService = {
  async getApplications(): Promise<DriverApplication[]> {
    return pending;
  },
  async approveApplication(id: string, _note?: string) {
    pending = pending.map((a) => (a.id === id ? { ...a, status: 'approved' } : a));
    return { ok: true };
  },
  async rejectApplication(id: string, _note?: string) {
    pending = pending.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a));
    return { ok: true };
  },
  async assignOrder(_order: DeliveryOrder) {
    return { ok: true };
  },
};

