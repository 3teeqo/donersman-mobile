import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Redirect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  Modal,
  PanResponder,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useAppTheme } from '../contexts/AppThemeContext';
import { useAuth } from '../contexts/AuthContext';

const menuData = [
  {
    id: '1',
    category: 'Doner & Shawarma',
    items: [
      {
        id: '1-1',
        name: 'Chicken Doner',
        price: 15,
        image: require('../assets/images/ChickenDoner.jpg'),
        description: 'Tender chicken with fresh vegetables and garlic sauce',
        ingredients: ['Chicken', 'Tomato', 'Onion', 'Garlic Sauce', 'Pita'],
        dietary: ['meat'],
        category: 'meat',
        preparationTime: 15,
        popularity: 95,
      },
      {
        id: '1-2',
        name: 'Beef Shawarma',
        price: 18,
        image: require('../assets/images/BeefShawarma.jpg'),
        description: 'Marinated beef with tahini and fresh herbs',
        ingredients: ['Beef', 'Tahini', 'Parsley', 'Onion', 'Pita'],
        dietary: ['meat'],
        category: 'meat',
        preparationTime: 20,
        popularity: 88,
      },
      {
        id: '1-3',
        name: 'Mixed Doner Plate',
        price: 16,
        image: require('../assets/images/MixedDonerPlate.jpg'),
        description: 'Best of both worlds - chicken and beef combo',
        ingredients: ['Chicken', 'Beef', 'Rice', 'Salad', 'Sauce'],
        dietary: ['meat'],
        category: 'meat',
        preparationTime: 18,
        popularity: 92,
      },
    ],
  },
  {
    id: '2',
    category: 'Oriental Dishes',
    items: [
      {
        id: '2-1',
        name: 'Falafel Plate',
        price: 8,
        image: require('../assets/images/FalafelPlate.jpg'),
        description: 'Crispy chickpea balls with tahini and salad',
        ingredients: ['Chickpeas', 'Tahini', 'Salad', 'Pita'],
        dietary: ['vegetarian'],
        category: 'vegetarian',
        preparationTime: 10,
        popularity: 85,
      },
      {
        id: '2-2',
        name: 'Hummus with Meat',
        price: 15,
        image: require('../assets/images/HummusWithMeat.jpg'),
        description: 'Creamy hummus topped with seasoned meat',
        ingredients: ['Hummus', 'Beef', 'Pine Nuts', 'Pita'],
        dietary: ['meat'],
        category: 'meat',
        preparationTime: 12,
        popularity: 78,
      },
      {
        id: '2-3',
        name: 'Kofta Kebab',
        price: 22,
        image: require('../assets/images/KoftaKebab.jpg'),
        description: 'Grilled meat patties with Middle Eastern spices',
        ingredients: ['Ground Beef', 'Spices', 'Rice', 'Salad'],
        dietary: ['meat'],
        category: 'meat',
        preparationTime: 25,
        popularity: 90,
      },
    ],
  },
  {
    id: '3',
    category: 'Sides & Salads',
    items: [
      {
        id: '3-1',
        name: 'Tabbouleh',
        price: 8,
        image: require('../assets/images/Tabbouleh.jpg'),
        description: 'Fresh parsley salad with bulgur and lemon',
        ingredients: ['Parsley', 'Bulgur', 'Tomato', 'Lemon'],
        dietary: ['vegetarian'],
        category: 'vegetarian',
        preparationTime: 8,
        popularity: 75,
      },
      {
        id: '3-2',
        name: 'Fattoush',
        price: 10,
        image: require('../assets/images/Fattoush.jpg'),
        description: 'Mixed salad with crispy pita bread',
        ingredients: ['Mixed Greens', 'Pita', 'Sumac', 'Olive Oil'],
        dietary: ['vegetarian'],
        category: 'vegetarian',
        preparationTime: 7,
        popularity: 80,
      },
      {
        id: '3-3',
        name: 'French Fries',
        price: 7,
        image: require('../assets/images/FrenchFries.jpg'),
        description: 'Golden crispy potato fries',
        ingredients: ['Potatoes', 'Salt'],
        dietary: ['vegetarian'],
        category: 'vegetarian',
        preparationTime: 12,
        popularity: 95,
      },
    ],
  },
  {
    id: '4',
    category: 'Drinks',
    items: [
      {
        id: '4-1',
        name: 'Ayran (Yogurt Drink)',
        price: 4,
        image: require('../assets/images/AyranYogurtDrink.jpg'),
        description: 'Traditional Turkish yogurt drink',
        ingredients: ['Yogurt', 'Salt', 'Water'],
        dietary: ['drink'],
        category: 'drinks',
        preparationTime: 2,
        popularity: 70,
      },
      {
        id: '4-2',
        name: 'Mint Lemonade',
        price: 3,
        image: require('../assets/images/MintLemonade.jpg'),
        description: 'Fresh lemonade with mint leaves',
        ingredients: ['Lemon', 'Mint', 'Water', 'Sugar'],
        dietary: ['drink'],
        category: 'drinks',
        preparationTime: 3,
        popularity: 85,
      },
      {
        id: '4-3',
        name: 'Turkish Coffee',
        price: 5,
        image: require('../assets/images/TurkishCoffee.jpg'),
        description: 'Strong traditional Turkish coffee',
        ingredients: ['Coffee', 'Sugar'],
        dietary: ['drink'],
        category: 'drinks',
        preparationTime: 5,
        popularity: 65,
      },
    ],
  },
  {
    id: '5',
    category: 'Desserts',
    items: [
      {
        id: '5-1',
        name: 'Baklava',
        price: 12,
        image: require('../assets/images/Baklava.jpg'),
        description: 'Layered pastry filled with nuts and sweet syrup',
        ingredients: ['Phyllo', 'Walnuts', 'Pistachios', 'Syrup'],
        dietary: ['dessert'],
        category: 'desserts',
        preparationTime: 10,
        popularity: 94,
      },
      {
        id: '5-2',
        name: 'Knafeh',
        price: 18,
        image: require('../assets/images/Knafeh.jpg'),
        description: 'Cheese pastry soaked in sweet sugar syrup',
        ingredients: ['Cheese', 'Semolina', 'Syrup', 'Pistachios'],
        dietary: ['dessert'],
        category: 'desserts',
        preparationTime: 20,
        popularity: 88,
      },
      {
        id: '5-3',
        name: 'Basbousa',
        price: 8,
        image: require('../assets/images/Basbousa.jpg'),
        description: 'Semolina cake with coconut and syrup',
        ingredients: ['Semolina', 'Coconut', 'Syrup'],
        dietary: ['dessert'],
        category: 'desserts',
        preparationTime: 6,
        popularity: 82,
      },
    ],
  },
];

const filterCategories = [
  { id: 'all', name: 'All', icon: 'grid-outline' },
  { id: 'meat', name: 'Meat', icon: 'flame-outline' },
  { id: 'vegetarian', name: 'Vegetarian', icon: 'leaf-outline' },
  { id: 'drinks', name: 'Drinks', icon: 'cafe-outline' },
  { id: 'desserts', name: 'Desserts', icon: 'ice-cream-outline' },
];

const categoryBadges = {
  meat: {
    label: 'Protein Feast',
    icon: 'food-steak',
    color: '#f97316',
    background: 'rgba(249, 115, 22, 0.12)',
  },
  vegetarian: {
    label: 'Vegetarian Friendly',
    icon: 'leaf',
    color: '#16a34a',
    background: 'rgba(22, 163, 74, 0.12)',
  },
  drinks: {
    label: 'Refreshments',
    icon: 'cup-water',
    color: '#2563eb',
    background: 'rgba(37, 99, 235, 0.12)',
  },
  desserts: {
    label: 'Sweet Treat',
    icon: 'cupcake',
    color: '#ec4899',
    background: 'rgba(236, 72, 153, 0.12)',
  },
  default: {
    label: 'Chef Special',
    icon: 'chef-hat',
    color: '#facc15',
    background: 'rgba(250, 204, 21, 0.12)',
  },
};

const getCategoryBadge = (category) =>
  categoryBadges[category] || categoryBadges.default;

const createStyles = (colors, isDark) => {
  const base = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 10,
      color: colors.textSecondary,
      fontSize: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      backgroundColor: colors.background,
    },
    errorEmoji: {
      marginBottom: 12,
      color: colors.accent,
    },
    errorTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    errorText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    retryButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 18,
    },
    retryText: {
      color: colors.accentText,
      fontSize: 16,
      fontWeight: '600',
    },
    favoriteToast: {
      position: 'absolute',
      top: 120,
      alignSelf: 'center',
      backgroundColor: colors.accent,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 20,
      shadowColor: colors.shadow,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      elevation: 10,
      zIndex: 100,
    },
    favoriteToastText: {
      color: colors.accentText,
      fontWeight: '600',
    },
    heroHeader: {
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 28,
      backgroundColor: colors.heroBackground,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 24,
      paddingVertical: 24,
      gap: 18,
      shadowColor: colors.shadow,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      elevation: 10,
    },
    heroHeaderTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    heroCopy: {
      gap: 14,
    },
    heroEyebrow: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    heroTitle: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '700',
    },
    heroSubtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    heroStatsRow: {
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
    heroStatChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accentSoft,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
    },
    heroStatText: {
      color: colors.highlight,
      fontSize: 13,
      fontWeight: '600',
    },
    cartButton: {
      backgroundColor: colors.accent,
      width: 56,
      height: 56,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 16,
      elevation: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    badge: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: colors.highlight,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    badgeText: {
      color: colors.highlightText,
      fontSize: 12,
      fontWeight: '700',
    },
    listHeader: {
      gap: 24,
      paddingHorizontal: 20,
      paddingTop: 24,
      marginBottom: 24,
    },
    searchContainer: {
      gap: 12,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    searchIcon: {
      color: colors.iconSecondary,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
    },
    clearSearch: {
      padding: 4,
    },
    suggestionsContainer: {
      marginTop: 12,
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 6,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderMuted,
      gap: 10,
    },
    suggestionIcon: {
      color: colors.accent,
    },
    suggestionText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    quickFavoritesContainer: {
      gap: 12,
    },
    quickFavoritesTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    quickFavorites: {
      flexDirection: 'row',
    },
    quickFavoriteItem: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 12,
      marginRight: 12,
      width: 88,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickFavoriteImage: {
      width: 54,
      height: 54,
      borderRadius: 27,
      marginBottom: 8,
    },
    quickFavoriteName: {
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
    },
    filterContainer: {
      marginTop: 8,
    },
    filterContentContainer: {
      paddingHorizontal: 16,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 18,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 12,
      gap: 8,
    },
    filterButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    filterEmoji: {
      color: colors.iconSecondary,
    },
    filterText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '600',
    },
    filterTextActive: {
      color: colors.accentText,
    },
    categorySection: {
      marginTop: 28,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 18,
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: 20,
    },
    categoryText: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    categoryCount: {
      color: colors.textSecondary,
      fontSize: 13,
      marginTop: 4,
    },
    categoryGrid: {
      paddingHorizontal: 20,
      paddingTop: 18,
      gap: 16,
    },
    menuCard: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 18,
      elevation: 8,
    },
    menuImageWrapper: {
      position: 'relative',
    },
    menuImage: {
      width: '100%',
      height: 140,
    },
    menuFavorite: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: colors.accentSoft,
      borderRadius: 18,
      padding: 8,
    },
    menuPricePill: {
      position: 'absolute',
      left: 12,
      bottom: 12,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    menuPriceText: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '700',
    },
    menuBody: {
      paddingHorizontal: 16,
      paddingVertical: 18,
      gap: 10,
    },
    menuTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    menuTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      flex: 1,
    },
    menuPopularity: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accentSoft,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 4,
    },
    menuPopularityText: {
      color: colors.highlight,
      fontSize: 12,
      fontWeight: '600',
    },
    menuDescription: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    menuTagsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    menuTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      gap: 6,
    },
    menuTagText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    menuActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    quantityButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
    },
    quantityButtonDisabled: {
      backgroundColor: colors.accentSoft,
    },
    quantityCount: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    emptyState: {
      marginTop: 40,
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 28,
      alignItems: 'center',
      gap: 12,
    },
    emptyStateEmoji: {
      marginBottom: 8,
    },
    emptyStateTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    emptyStateText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
    },
    emptyStateButton: {
      marginTop: 6,
      backgroundColor: colors.accent,
      paddingHorizontal: 22,
      paddingVertical: 12,
      borderRadius: 16,
    },
    emptyStateButtonText: {
      color: colors.accentText,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(7, 14, 27, 0.9)' : 'rgba(15, 23, 42, 0.35)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: '92%',
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalHandle: {
      width: 64,
      height: 5,
      backgroundColor: colors.border,
      borderRadius: 3,
      alignSelf: 'center',
      marginVertical: 12,
    },
    modalImage: {
      width: '100%',
      height: 220,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    },
    modalScrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 32,
      gap: 18,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    modalTitle: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '700',
      flex: 1,
    },
    modalFavorite: {
      backgroundColor: colors.accentSoft,
      borderRadius: 24,
      padding: 8,
    },
    modalInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    modalInfoChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
    },
    modalInfoText: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
    modalDescription: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
    },
    modalBadges: {
      flexDirection: 'row',
      gap: 10,
    },
    modalBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.surfaceMuted,
      gap: 6,
    },
    modalBadgeText: {
      fontSize: 12,
      fontWeight: '600',
    },
    ingredientsTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    ingredientsList: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    modalControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    modalBtn: {
      backgroundColor: colors.accent,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnText: {
      color: colors.accentText,
      fontSize: 22,
      fontWeight: '700',
    },
    modalCount: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    closeModal: {
      margin: 24,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    closeModalText: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    cartTitle: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 16,
      textAlign: 'center',
    },
    emptyCart: {
      alignItems: 'center',
      paddingVertical: 60,
      gap: 12,
    },
    emptyCartEmoji: {
      color: colors.iconSecondary,
    },
    emptyCartTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    emptyCartText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
    },
    cartItemsScroll: {
      maxHeight: 320,
    },
    cartItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 12,
      marginBottom: 14,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cartItemImage: {
      width: 56,
      height: 56,
      borderRadius: 12,
      marginRight: 8,
    },
    cartItemDetails: {
      flex: 1,
      gap: 4,
    },
    cartItemName: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    cartItemPrice: {
      color: colors.textSecondary,
      fontSize: 13,
    },
    cartItemControls: {
      alignItems: 'flex-end',
      gap: 6,
    },
    cartQuantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.accentSoft,
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    cartQuantityButton: {
      width: 30,
      height: 30,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
    },
    cartQuantityCount: {
      color: colors.accentText,
      fontSize: 14,
      fontWeight: '700',
    },
    cartItemTotal: {
      color: colors.accent,
      fontSize: 15,
      fontWeight: '700',
    },
    cartTotal: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
      marginTop: 12,
    },
    totalText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    cartActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 18,
    },
    clearCartButton: {
      flex: 1,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
    },
    clearCartText: {
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: '600',
    },
    payButton: {
      flex: 1,
      backgroundColor: colors.accent,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
    },
    payText: {
      color: colors.accentText,
      fontSize: 15,
      fontWeight: '700',
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.heroBackground,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: 20,
      paddingVertical: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    footerPayButton: {
      flex: 0,
      paddingHorizontal: 24,
    },
  });

  return {
    ...base,
    listContent: (totalItems) => ({
      paddingBottom: totalItems > 0 ? 160 : 120,
    }),
  };
};
const HapticService = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};

const ProgressiveImage = ({ source, style, item, ...props }) => {
  const { colors, isDark } = useAppTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const getFallbackSource = () => {
    const categoryColors = {
      meat: '#ff6b6b',
      vegetarian: '#51cf66',
      drinks: '#339af0',
      desserts: '#cc5de8',
    };

    const color = categoryColors[item?.category] || '#868e96';

    return {
      uri: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="${color}"/><text x="50" y="50" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dy=".3em">${item?.name?.charAt(0) ?? 'D'}</text></svg>`,
    };
  };

  return (
    <View style={[style, { position: 'relative' }]}>
      <Image
        source={hasError ? getFallbackSource() : source}
        style={[style, { opacity: isLoading ? 0.3 : 1 }]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...props}
      />
      {isLoading && (
        <View
          style={[
            style,
            {
              ...StyleSheet.absoluteFillObject,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDark
                ? 'rgba(7, 14, 27, 0.6)'
                : 'rgba(255, 255, 255, 0.7)',
            },
          ]}
        >
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      )}
    </View>
  );
};

const MemoizedMenuItem = React.memo(
  ({
    item,
    onPress,
    cartCount,
    isFavorite,
    onToggleFavorite,
    onAddItem,
    onRemoveItem,
    styles,
  }) => {
    const { colors } = useAppTheme();

    const badge = getCategoryBadge(item.category);

    return (
      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => onPress(item)}
        accessibilityLabel={`View details for ${item.name}`}
        accessibilityRole="button"
        activeOpacity={0.92}
      >
        <View style={styles.menuImageWrapper}>
          <ProgressiveImage source={item.image} style={styles.menuImage} item={item} />
          <TouchableOpacity
            style={styles.menuFavorite}
            onPress={() => onToggleFavorite(item.id)}
            accessibilityLabel={
              isFavorite
                ? `Remove ${item.name} from favorites`
                : `Add ${item.name} to favorites`
            }
            accessibilityRole="button"
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? colors.accent : colors.iconSecondary}
            />
          </TouchableOpacity>
          <View style={styles.menuPricePill}>
            <Text style={styles.menuPriceText}>ILS {item.price}</Text>
          </View>
        </View>

        <View style={styles.menuBody}>
          <View style={styles.menuTitleRow}>
            <Text style={styles.menuTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.menuPopularity}>
              <Ionicons name="flame" size={16} color={colors.accent} />
              <Text style={styles.menuPopularityText}>{item.popularity}%</Text>
            </View>
          </View>

          <Text style={styles.menuDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.menuTagsRow}>
            <View style={[styles.menuTag, { backgroundColor: badge.background }]}>
              <MaterialCommunityIcons
                name={badge.icon}
                size={14}
                color={badge.color}
              />
              <Text style={[styles.menuTagText, { color: badge.color }]}>
                {badge.label}
              </Text>
            </View>
            <View style={styles.menuTag}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.menuTagText}>{item.preparationTime} min</Text>
            </View>
          </View>

          <View style={styles.menuActions}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                cartCount === 0 && styles.quantityButtonDisabled,
              ]}
              onPress={() => onRemoveItem(item.id)}
              disabled={cartCount === 0}
              accessibilityLabel={`Remove one ${item.name} from cart`}
              accessibilityRole="button"
              activeOpacity={0.8}
          >
            <Ionicons name="remove" size={18} color={colors.accentText} />
          </TouchableOpacity>
          <Text style={styles.quantityCount}>{cartCount}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onAddItem(item.id)}
            accessibilityLabel={`Add one ${item.name} to cart`}
            accessibilityRole="button"
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color={colors.accentText} />
          </TouchableOpacity>
        </View>
      </View>
      </TouchableOpacity>
    );
  }
);

export default function Orders() {
  const { user, loading: authLoading, role } = useAuth();
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const [expanded, setExpanded] = useState({});
  const [cart, setCart] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentlyFavorited, setRecentlyFavorited] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadPersistentData();
  }, []);

  useEffect(() => {
    if (!loading) {
      savePersistentData();
    }
  }, [cart, favorites, searchHistory, loading]);

  const loadPersistentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [savedCart, savedFavorites, savedSearchHistory] = await Promise.all([
        AsyncStorage.getItem('cart'),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('searchHistory'),
      ]);

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory));
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load your saved selections. Please restart the app.');
    } finally {
      setLoading(false);
    }
  };

  const savePersistentData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('cart', JSON.stringify(cart)),
        AsyncStorage.setItem('favorites', JSON.stringify(favorites)),
        AsyncStorage.setItem('searchHistory', JSON.stringify(searchHistory)),
      ]);
    } catch (err) {
      console.error('Error saving data:', err);
    }
  };

  const toggleExpand = (categoryId) => {
    HapticService.light();
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const addItem = (itemId) => {
    const item = menuData.flatMap((cat) => cat.items).find((i) => i.id === itemId);
    const currentCount = cart[itemId] || 0;

    if (currentCount >= 10) {
      HapticService.warning();
      Alert.alert('Limit Reached', `Maximum 10 ${item.name} per order`);
      return;
    }

    HapticService.medium();
    setCart((prev) => ({ ...prev, [itemId]: currentCount + 1 }));
  };

  const removeItem = (itemId) => {
    HapticService.light();
    setCart((prev) => {
      if (!prev[itemId]) return prev;
      const updated = { ...prev, [itemId]: prev[itemId] - 1 };
      if (updated[itemId] <= 0) delete updated[itemId];
      return updated;
    });
  };

  const toggleFavorite = (itemId) => {
    const isCurrentlyFavorite = favorites.includes(itemId);
    const item = menuData.flatMap((cat) => cat.items).find((i) => i.id === itemId);

    if (isCurrentlyFavorite) {
      HapticService.light();
      setFavorites((prev) => prev.filter((id) => id !== itemId));
    } else {
      HapticService.success();
      setFavorites((prev) => [...prev, itemId]);
      setRecentlyFavorited(item);
      setTimeout(() => setRecentlyFavorited(null), 2000);
    }
  };

  const getTotal = () =>
    Object.entries(cart).reduce((sum, [itemId, quantity]) => {
      const item = menuData.flatMap((cat) => cat.items).find((i) => i.id === itemId);
      return item ? sum + item.price * quantity : sum;
    }, 0);

  const getTotalItems = () =>
    Object.values(cart).reduce((sum, count) => sum + count, 0);

  const selectedItemBadge = selectedItem
    ? getCategoryBadge(selectedItem.category)
    : null;

  const filteredData = useMemo(() => {
    const terms = debouncedSearch
      .toLowerCase()
      .split(' ')
      .filter((term) => term.trim().length > 0);

    return menuData
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const searchableText = [
            item.name,
            item.description,
            item.ingredients.join(' '),
            item.category,
          ]
            .join(' ')
            .toLowerCase();

          const matchesSearch =
            terms.length === 0 ||
            terms.every((term) => searchableText.includes(term));
          const matchesFilter =
            selectedFilter === 'all' || item.category === selectedFilter;

          return matchesSearch && matchesFilter;
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [debouncedSearch, selectedFilter]);

  const enhancedFavorites = useMemo(() => {
    return menuData
      .flatMap((cat) => cat.items)
      .filter((item) => favorites.includes(item.id))
      .sort((a, b) => b.popularity - a.popularity);
  }, [favorites]);

  const searchSuggestions = useMemo(() => {
    const popularItems = menuData
      .flatMap((cat) => cat.items)
      .filter((item) => item.popularity > 80)
      .slice(0, 6)
      .map((item) => item.name);

    return [...new Set([...searchHistory, ...popularItems])].slice(0, 8);
  }, [searchHistory]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setSearchHistory((prev) => [
        searchQuery,
        ...prev.filter((entry) => entry !== searchQuery),
      ]);
      setShowSuggestions(false);
      Keyboard.dismiss();
    }
  };

  const openItemModal = useCallback((item) => {
    HapticService.light();
    setSelectedItem(item);
    setModalVisible(true);
  }, []);

  const openCartModal = () => {
    HapticService.light();
    setCartModalVisible(true);
  };

  const getCartItems = () => {
    const items = [];
    menuData.forEach((category) => {
      category.items.forEach((item) => {
        if (cart[item.id]) {
          items.push({
            ...item,
            quantity: cart[item.id],
            total: cart[item.id] * item.price,
          });
        }
      });
    });
    return items;
  };

  const clearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          HapticService.heavy();
          setCart({});
        },
      },
    ]);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPersistentData().finally(() => setRefreshing(false));
  }, []);

  const modalPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          setModalVisible(false);
          HapticService.light();
        }
      },
    })
  ).current;

  const renderCategory = useCallback(
    ({ item: category }) => (
      <View style={styles.categorySection}>
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() => toggleExpand(category.id)}
          accessibilityLabel={`${category.category} category, ${
            expanded[category.id] ? 'expanded' : 'collapsed'
          }`}
          accessibilityRole="button"
        >
          <View>
            <Text style={styles.categoryText}>{category.category}</Text>
            <Text style={styles.categoryCount}>{category.items.length} items</Text>
          </View>
          <Ionicons
            name={expanded[category.id] ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
        {expanded[category.id] && (
          <View style={styles.categoryGrid}>
            {category.items.map((menuItem) => (
            <MemoizedMenuItem
              key={menuItem.id}
              item={menuItem}
              onPress={openItemModal}
              cartCount={cart[menuItem.id] || 0}
              isFavorite={favorites.includes(menuItem.id)}
              onToggleFavorite={toggleFavorite}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              styles={styles}
            />
            ))}
          </View>
        )}
      </View>
    ),
    [expanded, cart, favorites, openItemModal, styles, colors]
  );

  const renderListHeader = useCallback(() => (
    <View style={styles.listHeader}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.iconSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search dishes, ingredients..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setShowSuggestions(text.length > 0);
            }}
            onSubmitEditing={handleSearchSubmit}
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            returnKeyType="search"
            blurOnSubmit
            accessibilityLabel="Search menu items"
            accessibilityHint="Type to filter menu items by name, description, or ingredients"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setShowSuggestions(false);
                HapticService.light();
              }}
              style={styles.clearSearch}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <Ionicons name="close-circle" size={20} color={colors.iconSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {showSuggestions && searchSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {searchSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => {
                  setSearchQuery(suggestion);
                  setShowSuggestions(false);
                  HapticService.light();
                }}
                accessibilityLabel={`Search for ${suggestion}`}
                accessibilityRole="button"
              >
                <Ionicons
                  name="arrow-forward-circle"
                  size={18}
                  color={colors.accent}
                  style={styles.suggestionIcon}
                />
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {enhancedFavorites.length > 0 && (
        <View style={styles.quickFavoritesContainer}>
          <Text style={styles.quickFavoritesTitle}>Your favourites</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickFavorites}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {enhancedFavorites.slice(0, 8).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickFavoriteItem}
                onPress={() => openItemModal(item)}
                accessibilityLabel={`Quick view ${item.name}`}
                accessibilityRole="button"
              >
                <ProgressiveImage
                  source={item.image}
                  style={styles.quickFavoriteImage}
                  item={item}
                />
                <Text style={styles.quickFavoriteName} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContentContainer}
        >
          {filterCategories.map((filter) => {
            const isActive = selectedFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  isActive && styles.filterButtonActive,
                ]}
                onPress={() => {
                  HapticService.light();
                  setSelectedFilter(filter.id);
                }}
                accessibilityLabel={`Filter by ${filter.name}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Ionicons
                  name={filter.icon}
                  size={16}
                  style={styles.filterEmoji}
                  color={isActive ? colors.accentText : colors.iconSecondary}
                />
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  ), [
    colors.accent,
    colors.accentText,
    colors.iconSecondary,
    colors.textSecondary,
    enhancedFavorites,
    filterCategories,
    openItemModal,
    searchQuery,
    searchSuggestions,
    setSearchQuery,
    setSelectedFilter,
    setShowSuggestions,
    showSuggestions,
    styles,
    selectedFilter,
  ]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons
        name="search-circle-outline"
        size={56}
        color={colors.accent}
        style={styles.emptyStateEmoji}
      />
      <Text style={styles.emptyStateTitle}>No items found</Text>
      <Text style={styles.emptyStateText}>
        {debouncedSearch
          ? `No results for "${debouncedSearch}"`
          : 'Try changing your filters'}
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => {
          setSearchQuery('');
          setSelectedFilter('all');
          HapticService.light();
        }}
        accessibilityLabel="Show all items"
        accessibilityRole="button"
      >
        <Text style={styles.emptyStateButtonText}>Show all items</Text>
      </TouchableOpacity>
    </View>
  ), [colors.accent, debouncedSearch, styles, setSearchQuery, setSelectedFilter]);

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  if (role === 'driver') {
    return <Redirect href="/driver/dashboard" />;
  }

  if (role === 'owner') {
    return <Redirect href="/owner/dashboard" />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading the menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle"
          size={56}
          color={colors.accent}
          style={styles.errorEmoji}
        />
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPersistentData}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        {recentlyFavorited && (
          <View style={styles.favoriteToast}>
            <Text style={styles.favoriteToastText}>
              Added {recentlyFavorited.name} to favorites
            </Text>
          </View>
        )}

        <View style={styles.heroHeader}>
          <View style={styles.heroHeaderTop}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={openCartModal}
              accessibilityLabel={`View cart, ${getTotalItems()} items`}
              accessibilityRole="button"
              activeOpacity={0.85}
            >
              <Ionicons name="bag-handle-outline" size={26} color={colors.accentText} />
              {getTotalItems() > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{getTotalItems()}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Doner Habibi</Text>
            <Text style={styles.heroTitle}>Build your perfect order</Text>
            <Text style={styles.heroSubtitle}>
              Freshly carved doner, mezze, and desserts crafted for your cravings.
            </Text>
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatChip}>
                <Ionicons name="cart-outline" size={16} style={styles.heroStatIcon} />
                <Text style={styles.heroStatText}>{getTotalItems()} in cart</Text>
              </View>
              <View style={styles.heroStatChip}>
                <Ionicons name="heart-outline" size={16} style={styles.heroStatIcon} />
                <Text style={styles.heroStatText}>{favorites.length} favourites</Text>
              </View>
              <View style={styles.heroStatChip}>
                <Ionicons name="cash-outline" size={16} style={styles.heroStatIcon} />
                <Text style={styles.heroStatText}>ILS {getTotal().toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(cat) => cat.id}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderCategory}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent(getTotalItems())}
        />

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          statusBarTranslucent
        >
          <View style={styles.modalOverlay} {...modalPanResponder.panHandlers}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              {selectedItem && (
                <>
                  <ProgressiveImage
                    source={selectedItem.image}
                    style={styles.modalImage}
                    item={selectedItem}
                  />
                  <ScrollView style={styles.modalScrollContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                      <TouchableOpacity
                        onPress={() => toggleFavorite(selectedItem.id)}
                        style={styles.modalFavorite}
                        accessibilityLabel={
                          favorites.includes(selectedItem.id)
                            ? `Remove ${selectedItem.name} from favorites`
                            : `Add ${selectedItem.name} to favorites`
                        }
                        accessibilityRole="button"
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={
                            favorites.includes(selectedItem.id)
                              ? 'heart'
                              : 'heart-outline'
                          }
                          size={24}
                          color={
                            favorites.includes(selectedItem.id)
                              ? colors.accent
                              : colors.iconSecondary
                          }
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalInfo}>
                      <View style={styles.modalInfoChip}>
                        <Ionicons name="cash-outline" size={18} color={colors.accent} />
                        <Text style={styles.modalInfoText}>
                          ILS {selectedItem.price}
                        </Text>
                      </View>
                      <View style={styles.modalInfoChip}>
                        <Ionicons name="timer-outline" size={18} color={colors.iconSecondary} />
                        <Text style={styles.modalInfoText}>
                          {selectedItem.preparationTime} min prep
                        </Text>
                      </View>
                      <View style={styles.modalInfoChip}>
                        <Ionicons name="flame-outline" size={18} color={colors.highlight} />
                        <Text style={styles.modalInfoText}>
                          {selectedItem.popularity}% love it
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.modalDescription}>
                      {selectedItem.description}
                    </Text>

                    <View style={styles.modalBadges}>
                      {selectedItemBadge && (
                        <View
                          style={[
                            styles.modalBadge,
                            { backgroundColor: selectedItemBadge.background },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={selectedItemBadge.icon}
                            size={16}
                            color={selectedItemBadge.color}
                          />
                          <Text
                            style={[
                              styles.modalBadgeText,
                              { color: selectedItemBadge.color },
                            ]}
                          >
                            {selectedItemBadge.label}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.ingredientsTitle}>Ingredients</Text>
                    <Text style={styles.ingredientsList}>
                      {selectedItem.ingredients.join(', ')}
                    </Text>

                    <View style={styles.modalControls}>
                      <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => removeItem(selectedItem.id)}
                        accessibilityLabel={`Remove one ${selectedItem.name} from cart`}
                        accessibilityRole="button"
                      >
                        <Text style={styles.btnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.modalCount}>
                        {cart[selectedItem.id] || 0}
                      </Text>
                      <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => addItem(selectedItem.id)}
                        accessibilityLabel={`Add one ${selectedItem.name} to cart`}
                        accessibilityRole="button"
                      >
                        <Text style={styles.btnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>

                  <TouchableOpacity
                    style={styles.closeModal}
                    onPress={() => setModalVisible(false)}
                    accessibilityLabel="Close details"
                    accessibilityRole="button"
                  >
                    <Text style={styles.closeModalText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={cartModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCartModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, styles.cartModalContent]}>
                <Text style={styles.cartTitle}>
                  Your Cart ({getTotalItems()} items)
                </Text>

                {getCartItems().length === 0 ? (
                  <View style={styles.emptyCart}>
                    <Ionicons
                      name="cart-outline"
                      size={60}
                      color={colors.iconSecondary}
                      style={styles.emptyCartEmoji}
                    />
                    <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
                    <Text style={styles.emptyCartText}>
                      Add some delicious items from our menu!
                    </Text>
                  </View>
                ) : (
                  <>
                    <ScrollView style={styles.cartItemsScroll}>
                      {getCartItems().map((item) => (
                        <View key={item.id} style={styles.cartItem}>
                          <ProgressiveImage
                            source={item.image}
                            style={styles.cartItemImage}
                            item={item}
                          />
                          <View style={styles.cartItemDetails}>
                            <Text style={styles.cartItemName}>{item.name}</Text>
                            <Text style={styles.cartItemPrice}>
                              ILS {item.price} x {item.quantity}
                            </Text>
                          </View>
                          <View style={styles.cartItemControls}>
                            <View style={styles.cartQuantityControls}>
                              <TouchableOpacity
                                style={styles.cartQuantityButton}
                                onPress={() => removeItem(item.id)}
                                accessibilityLabel={`Remove one ${item.name} from cart`}
                                accessibilityRole="button"
                              >
                                <Ionicons name="remove" size={18} color={colors.accentText} />
                              </TouchableOpacity>
                              <Text style={styles.cartQuantityCount}>{item.quantity}</Text>
                              <TouchableOpacity
                                style={styles.cartQuantityButton}
                                onPress={() => addItem(item.id)}
                                accessibilityLabel={`Add one ${item.name} to cart`}
                                accessibilityRole="button"
                              >
                                <Ionicons name="add" size={18} color={colors.accentText} />
                              </TouchableOpacity>
                            </View>
                            <Text style={styles.cartItemTotal}>ILS {item.total}</Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>

                    <View style={styles.cartTotal}>
                      <Text style={styles.totalText}>Total: ILS {getTotal()}</Text>
                    </View>

                    <View style={styles.cartActions}>
                      <TouchableOpacity
                        style={styles.clearCartButton}
                        onPress={clearCart}
                        accessibilityLabel="Clear entire cart"
                        accessibilityRole="button"
                      >
                        <Text style={styles.clearCartText}>Clear Cart</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.payButton}
                        onPress={() => {
                          setCartModalVisible(false);
                          router.push('/payment');
                          HapticService.success();
                        }}
                        accessibilityLabel="Proceed to payment"
                        accessibilityRole="button"
                      >
                        <Text style={styles.payText}>Proceed to Pay</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                <TouchableOpacity
                  style={styles.closeModal}
                  onPress={() => setCartModalVisible(false)}
                  accessibilityLabel="Close cart"
                  accessibilityRole="button"
                >
                  <Text style={styles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {getTotalItems() > 0 && (
          <View style={styles.footer}>
            <Text style={styles.totalText}>
              Total: ILS {getTotal()} ({getTotalItems()} items)
            </Text>
            <TouchableOpacity
              style={[styles.payButton, styles.footerPayButton]}
              onPress={() => {
                router.push('/payment');
                HapticService.success();
              }}
              accessibilityLabel="Proceed to payment"
              accessibilityRole="button"
            >
              <Text style={styles.payText}>Proceed to Pay</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
  );
}


