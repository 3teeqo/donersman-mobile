import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { MenuService } from '../../shared/services/menu';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

const MenuEditor = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [dishes, setDishes] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('meat');
  const [description, setDescription] = useState('');

  const p = { bg: '#f7fbff', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', sub: '#475569', accent: '#2563eb', accentText: '#ffffff', muted: '#f1f5f9' };
  const styles = useMemo(() => StyleSheet.create({
    root: { flex: 1, backgroundColor: p.bg },
    container: { padding: 16 },
    title: { color: p.text, fontSize: 20, fontWeight: '700', marginBottom: 12 },
    row: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
    input: { flex: 1, backgroundColor: p.surface, borderColor: p.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: p.text, minWidth: 140 },
    btn: { backgroundColor: p.accent, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start' },
    btnText: { color: p.accentText, fontWeight: '700' },
    item: { borderWidth: 1, borderColor: p.border, backgroundColor: p.surface, borderRadius: 12, padding: 12, marginBottom: 8 },
    itemTitle: { color: p.text, fontWeight: '600' },
    itemMeta: { color: p.sub },
  }), []);

  useEffect(() => { (async () => setDishes(await MenuService.list()))(); }, []);

  const addDish = async () => {
    if (!name.trim() || !price) return;
    const exists = dishes.some((d) => d.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (exists) { alert('Dish with this name already exists'); return; }
    const dish = { id: Math.random().toString(36).slice(2), name: name.trim(), description: description.trim(), price: Number(price) || 0, category, available: true };
    await MenuService.upsert(dish);
    setDishes(await MenuService.list());
    setName(''); setPrice(''); setCategory('meat'); setDescription('');
  };

  const toggleAvailability = async (id) => {
    await MenuService.toggleAvailability(id);
    setDishes(await MenuService.list());
  };

  const removeDish = async (id) => {
    await MenuService.remove(id);
    setDishes(await MenuService.list());
  };

  if (authLoading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  if (role !== 'owner') return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Menu Editor</Text>
        <View style={styles.row}>
          <TextInput placeholder="Dish name" placeholderTextColor="#64748b" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Price" placeholderTextColor="#64748b" style={styles.input} value={price} onChangeText={(v)=> setPrice(v.replace(/[^0-9\.]/g,''))} keyboardType="decimal-pad" />
          <TextInput placeholder="Category (meat, vegetarian, drinks, desserts, sides)" placeholderTextColor="#64748b" style={styles.input} value={category} onChangeText={setCategory} />
          <TextInput placeholder="Description" placeholderTextColor="#64748b" style={[styles.input, { minWidth: '100%' }]} value={description} onChangeText={setDescription} />
          <TouchableOpacity style={styles.btn} onPress={addDish}><Text style={styles.btnText}>Add</Text></TouchableOpacity>
        </View>
        <FlatList
          data={dishes}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemMeta}>ILS {item.price?.toFixed ? item.price.toFixed(2) : item.price} • {item.category || 'uncategorized'}</Text>
              {item.description ? <Text style={styles.itemMeta}>{item.description}</Text> : null}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <TouchableOpacity style={styles.btn} onPress={() => toggleAvailability(item.id)}>
                  <Text style={styles.btnText}>{item.available === false ? 'Mark Available' : 'Mark Out of Stock'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => removeDish(item.id)}>
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default MenuEditor;
