export type MenuItem = {
  id: string;
  name: string;
  price: number;
  tip?: number;
  coords?: { lat: number; lng: number };
  ingredients?: string[];
};

export type DeliveryStatus =
  | 'unassigned'
  | 'accepted'
  | 'arrived'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'rejected';
export type KitchenStatus = 'pending' | 'preparing' | 'ready' | 'cancelled';

export type DeliveryOrder = {
  id: string;
  title: string;
  payout: number;
  tip?: number;
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  items: MenuItem[];
  deliveryStatus?: DeliveryStatus;
  kitchenStatus?: KitchenStatus;
  assignedDriverId?: string | null;
};

// Local in-memory state for order statuses
const ordersState: Record<string, { deliveryStatus?: DeliveryStatus; kitchenStatus?: KitchenStatus; assignedDriverId?: string | null }> = {
  ord_1: { deliveryStatus: 'unassigned', kitchenStatus: 'pending', assignedDriverId: null },
  ord_2: { deliveryStatus: 'unassigned', kitchenStatus: 'pending', assignedDriverId: null },
};

export const OrdersService = {
  async getAvailableDriverOrders(): Promise<DeliveryOrder[]> {
    const base: DeliveryOrder[] = [
      {
        id: 'ord_1',
        title: 'Doner Habibi - Al-Manara',
        payout: 16,
        tip: 2,
        pickup: { lat: 31.9028, lng: 35.1956 },
        dropoff: { lat: 31.902, lng: 35.212 },
        items: [
          { id: 'i1', name: 'Chicken Doner', price: 15, ingredients: ['Chicken', 'Tomato', 'Onion'] },
        ],
      },
      {
        id: 'ord_2',
        title: 'Doner Habibi - City Center',
        payout: 12,
        tip: 0,
        pickup: { lat: 31.9028, lng: 35.1956 },
        dropoff: { lat: 31.905, lng: 35.2 },
        items: [
          { id: 'i2', name: 'Beef Shawarma', price: 18, ingredients: ['Beef', 'Tahini', 'Parsley'] },
        ],
      },
    ];
    return base.map((o) => ({ ...o, ...ordersState[o.id] }));
  },

  async listAdminOrders(): Promise<DeliveryOrder[]> {
    return this.getAvailableDriverOrders();
  },

  async updateDeliveryStatus(id: string, status: DeliveryStatus) {
    ordersState[id] = { ...(ordersState[id] || {}), deliveryStatus: status };
    return { ok: true };
  },
  async updateKitchenStatus(id: string, status: KitchenStatus) {
    ordersState[id] = { ...(ordersState[id] || {}), kitchenStatus: status };
    return { ok: true };
  },
  async assignDriver(id: string, driverId: string | null) {
    ordersState[id] = { ...(ordersState[id] || {}), assignedDriverId: driverId };
    return { ok: true };
  },
};

