import { Store, KEYS } from './store';

export type DriverProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehicleType?: 'bike' | 'scooter' | 'car';
  licenseNumber?: string;
  available?: boolean;
};

const defaultProfile: DriverProfile = {
  id: 'driver_local',
  name: 'Driver',
  email: 'driver@example.com',
  available: false,
  vehicleType: 'bike',
};

export const DriverProfileService = {
  async get(): Promise<DriverProfile> {
    return Store.getJSON<DriverProfile>(KEYS.driverProfile, defaultProfile);
  },
  async set(profile: DriverProfile) {
    await Store.setJSON(KEYS.driverProfile, profile);
  },
  async toggleAvailability() {
    const p = await this.get();
    p.available = !p.available;
    await this.set(p);
    return p.available;
  },
};

