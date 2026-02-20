import { Store, KEYS } from './store';

export type MenuCategory = 'meat' | 'vegetarian' | 'drinks' | 'desserts' | 'sides';

export type MenuDish = {
  id: string;
  name: string;
  description?: string;
  price: number;
  ingredients?: string[];
  category: MenuCategory;
  available: boolean;
};

const seed: MenuDish[] = [
  { id: '1-1', name: 'Chicken Doner', description: 'Tender chicken with fresh veg and garlic sauce', price: 15, ingredients: ['Chicken','Tomato','Onion','Garlic'], category: 'meat', available: true },
  { id: '1-2', name: 'Beef Shawarma', description: 'Marinated beef with tahini and herbs', price: 18, ingredients: ['Beef','Tahini','Parsley'], category: 'meat', available: true },
  { id: '1-3', name: 'Mixed Doner Plate', description: 'Chicken and beef combo', price: 16, ingredients: ['Chicken','Beef','Rice'], category: 'meat', available: true },
  { id: '2-1', name: 'Falafel Plate', description: 'Crispy chickpea balls with tahini', price: 8, ingredients: ['Chickpeas','Tahini'], category: 'vegetarian', available: true },
  { id: '3-1', name: 'Tabbouleh', description: 'Parsley salad with bulgur and lemon', price: 8, ingredients: ['Parsley','Bulgur','Lemon'], category: 'sides', available: true },
  { id: '4-2', name: 'Mint Lemonade', description: 'Fresh lemonade with mint', price: 3, category: 'drinks', available: true },
  { id: '5-1', name: 'Baklava', description: 'Layered pastry with nuts and syrup', price: 12, category: 'desserts', available: true },
];

export const MenuService = {
  async list(): Promise<MenuDish[]> {
    return Store.getJSON<MenuDish[]>(KEYS.menu, seed);
  },
  async upsert(dish: MenuDish) {
    const items = await this.list();
    const idx = items.findIndex((d) => d.id === dish.id);
    if (idx >= 0) items[idx] = dish; else items.unshift(dish);
    await Store.setJSON(KEYS.menu, items);
  },
  async remove(id: string) {
    const items = await this.list();
    await Store.setJSON(KEYS.menu, items.filter((d) => d.id !== id));
  },
  async toggleAvailability(id: string) {
    const items = await this.list();
    const updated = items.map((d) => (d.id === id ? { ...d, available: !d.available } : d));
    await Store.setJSON(KEYS.menu, updated);
    return updated.find((d) => d.id === id);
  },
  async bulkUpdateAvailability(ids: string[], available: boolean) {
    const items = await this.list();
    const map = new Set(ids);
    await Store.setJSON(KEYS.menu, items.map((d) => (map.has(d.id) ? { ...d, available } : d)));
  },
};

