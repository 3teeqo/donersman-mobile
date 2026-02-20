import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

type Props = {
  value: 'customer' | 'driver' | 'owner';
  onChange: (v: Props['value']) => void;
};

const RoleTabs: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View style={styles.row}>
      {(
        [
          { id: 'customer', label: 'Customer' },
          { id: 'driver', label: 'Driver' },
          { id: 'owner', label: 'Owner' },
        ] as const
      ).map((tab) => {
        const active = value === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.chip, active && styles.active]}
            onPress={() => onChange(tab.id)}
            accessibilityRole="button"
          >
            <Text style={[styles.text, active && styles.textActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#0c1627',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  active: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  text: { color: '#cbd5f5', fontWeight: '600' },
  textActive: { color: '#0f172a' },
});

export default RoleTabs;

