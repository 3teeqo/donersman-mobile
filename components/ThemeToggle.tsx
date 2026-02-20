import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../contexts/AppThemeContext';

type Props = {
  style?: ViewStyle;
  showLabel?: boolean;
};

const ThemeToggle = ({ style, showLabel = true }: Props) => {
  const { isDark, toggleTheme, colors } = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.borderMuted,
          backgroundColor: colors.surfaceAlt,
          paddingHorizontal: 12,
          paddingVertical: 8,
          gap: 8,
        },
        compact: {
          paddingHorizontal: 10,
          paddingVertical: 6,
          gap: 6,
        },
        icon: {
          color: colors.iconPrimary,
        },
        label: {
          color: colors.textSecondary,
          fontSize: 13,
          fontWeight: '600',
        },
      }),
    [colors]
  );

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      onPress={toggleTheme}
      activeOpacity={0.85}
      style={[styles.root, !showLabel && styles.compact, style]}
    >
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={18}
        style={styles.icon}
      />
      {showLabel && (
        <Text style={styles.label}>{isDark ? 'Light' : 'Dark'} mode</Text>
      )}
    </TouchableOpacity>
  );
};

export default ThemeToggle;
