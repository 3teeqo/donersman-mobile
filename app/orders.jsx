import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Enhanced menu data with CORRECTED image references
const menuData = [
  {
    id: "1",
    category: "Doner & Shawarma",
    items: [
      { 
        id: "1-1", 
        name: "Chicken Doner", 
        price: 15,
        image: require('../assets/images/ChickenDoner.jpg'), // FIXED PATH
        description: "Tender chicken with fresh vegetables and garlic sauce",
        ingredients: ["Chicken", "Tomato", "Onion", "Garlic Sauce", "Pita"],
        dietary: ["🌶️"],
        category: "meat",
        preparationTime: 15,
        popularity: 95
      },
      { 
        id: "1-2", 
        name: "Beef Shawarma", 
        price: 18,
        image: require('../assets/images/BeefShawarma.jpg'), // FIXED PATH
        description: "Marinated beef with tahini and fresh herbs",
        ingredients: ["Beef", "Tahini", "Parsley", "Onion", "Pita"],
        dietary: ["🌶️"],
        category: "meat",
        preparationTime: 20,
        popularity: 88
      },
      { 
        id: "1-3", 
        name: "Mixed Doner Plate", 
        price: 16,
        image: require('../assets/images/MixedDonerPlate.jpg'), // FIXED PATH
        description: "Best of both worlds - chicken and beef combo",
        ingredients: ["Chicken", "Beef", "Rice", "Salad", "Sauce"],
        dietary: ["🌶️"],
        category: "meat",
        preparationTime: 18,
        popularity: 92
      },
    ],
  },
  {
    id: "2",
    category: "Oriental Dishes",
    items: [
      { 
        id: "2-1", 
        name: "Falafel Plate", 
        price: 8,
        image: require('../assets/images/FalafelPlate.jpg'), // FIXED PATH
        description: "Crispy chickpea balls with tahini and salad",
        ingredients: ["Chickpeas", "Tahini", "Salad", "Pita"],
        dietary: ["🌱"],
        category: "vegetarian",
        preparationTime: 10,
        popularity: 85
      },
      { 
        id: "2-2", 
        name: "Hummus with Meat", 
        price: 15,
        image: require('../assets/images/HummusWithMeat.jpg'), // FIXED PATH
        description: "Creamy hummus topped with seasoned meat",
        ingredients: ["Hummus", "Beef", "Pine Nuts", "Pita"],
        dietary: [],
        category: "meat",
        preparationTime: 12,
        popularity: 78
      },
      { 
        id: "2-3", 
        name: "Kofta Kebab", 
        price: 22,
        image: require('../assets/images/KoftaKebab.jpg'), // FIXED PATH
        description: "Grilled meat patties with Middle Eastern spices",
        ingredients: ["Ground Beef", "Spices", "Rice", "Salad"],
        dietary: ["🌶️"],
        category: "meat",
        preparationTime: 25,
        popularity: 90
      },
    ],
  },
  {
    id: "3",
    category: "Sides & Salads",
    items: [
      { 
        id: "3-1", 
        name: "Tabbouleh", 
        price: 8,
        image: require('../assets/images/Tabbouleh.jpg'), // FIXED PATH
        description: "Fresh parsley salad with bulgur and lemon",
        ingredients: ["Parsley", "Bulgur", "Tomato", "Lemon"],
        dietary: ["🌱"],
        category: "vegetarian",
        preparationTime: 8,
        popularity: 75
      },
      { 
        id: "3-2", 
        name: "Fattoush", 
        price: 10,
        image: require('../assets/images/Fattoush.jpg'), // FIXED PATH
        description: "Mixed salad with crispy pita bread",
        ingredients: ["Mixed Greens", "Pita", "Sumac", "Olive Oil"],
        dietary: ["🌱"],
        category: "vegetarian",
        preparationTime: 7,
        popularity: 80
      },
      { 
        id: "3-3", 
        name: "French Fries", 
        price: 7,
        image: require('../assets/images/FrenchFries.jpg'), // FIXED PATH
        description: "Golden crispy potato fries",
        ingredients: ["Potatoes", "Salt"],
        dietary: ["🌱"],
        category: "vegetarian",
        preparationTime: 12,
        popularity: 95
      },
    ],
  },
  {
    id: "4",
    category: "Drinks",
    items: [
      { 
        id: "4-1", 
        name: "Ayran (Yogurt Drink)", 
        price: 4,
        image: require('../assets/images/AyranYogurtDrink.jpg'), // FIXED PATH
        description: "Traditional Turkish yogurt drink",
        ingredients: ["Yogurt", "Salt", "Water"],
        dietary: [],
        category: "drinks",
        preparationTime: 2,
        popularity: 70
      },
      { 
        id: "4-2", 
        name: "Mint Lemonade", 
        price: 3,
        image: require('../assets/images/MintLemonade.jpg'), // FIXED PATH
        description: "Fresh lemonade with mint leaves",
        ingredients: ["Lemon", "Mint", "Water", "Sugar"],
        dietary: ["🌱"],
        category: "drinks",
        preparationTime: 3,
        popularity: 85
      },
      { 
        id: "4-3", 
        name: "Turkish Coffee", 
        price: 5,
        image: require('../assets/images/TurkishCoffee.jpg'), // FIXED PATH
        description: "Strong traditional Turkish coffee",
        ingredients: ["Coffee", "Sugar"],
        dietary: [],
        category: "drinks",
        preparationTime: 5,
        popularity: 65
      },
    ],
  },
  {
    id: "5",
    category: "Desserts",
    items: [
      { 
        id: "5-1", 
        name: "Baklava", 
        price: 12,
        image: require('../assets/images/Baklava.jpg'), // FIXED PATH
        description: "Sweet pastry with nuts and honey",
        ingredients: ["Phyllo", "Nuts", "Honey", "Butter"],
        dietary: ["🥜"],
        category: "desserts",
        preparationTime: 5,
        popularity: 92
      },
      { 
        id: "5-2", 
        name: "Knafeh", 
        price: 15,
        image: require('../assets/images/Knafeh.jpg'), // FIXED PATH
        description: "Cheese pastry soaked in sweet syrup",
        ingredients: ["Cheese", "Phyllo", "Syrup"],
        dietary: [],
        category: "desserts",
        preparationTime: 8,
        popularity: 88
      },
      { 
        id: "5-3", 
        name: "Basbousa", 
        price: 8,
        image: require('../assets/images/Basbousa.jpg'), // FIXED PATH
        description: "Semolina cake with coconut and syrup",
        ingredients: ["Semolina", "Coconut", "Syrup"],
        dietary: [],
        category: "desserts",
        preparationTime: 6,
        popularity: 82
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

const getCategoryBadge = (category) => categoryBadges[category] || categoryBadges.default;

// Enhanced Haptic Service
const HapticService = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

// Progressive Image Component
const ProgressiveImage = ({ source, style, item, ...props }) => {
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
      desserts: '#cc5de8'
    };
    
    const color = categoryColors[item?.category] || '#868e96';
    
    return { 
      uri: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="${color}"/><text x="50" y="50" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dy=".3em">${item?.name.charAt(0)}</text></svg>`
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
        <View style={[style, styles.loadingOverlay]}>
          <ActivityIndicator size="small" color="#e67e22" />
        </View>
      )}
    </View>
  );
};

// Memoized Menu Item Component
const MemoizedMenuItem = React.memo(({
  item,
  onPress,
  cartCount,
  isFavorite,
  onToggleFavorite,
  onAddItem,
  onRemoveItem,
}) => {
  const badge = getCategoryBadge(item.category);

export default function Orders() {
  const [expanded, setExpanded] = useState({});
  const [cart, setCart] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
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

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load persistent data
  useEffect(() => {
    loadPersistentData();
  }, []);

  // Save cart when it changes
  useEffect(() => {
    savePersistentData();
  }, [cart, favorites]);

  const loadPersistentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [savedCart, savedFavorites, savedSearchHistory] = await Promise.all([
        AsyncStorage.getItem('cart'),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('searchHistory')
      ]);
      
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory));
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load your data. Please restart the app.');
    } finally {
      setLoading(false);
    }
  };

  const savePersistentData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('cart', JSON.stringify(cart)),
        AsyncStorage.setItem('favorites', JSON.stringify(favorites)),
        AsyncStorage.setItem('searchHistory', JSON.stringify(searchHistory))
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const toggleExpand = (categoryId) => {
    HapticService.light();
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const addItem = (itemId) => {
    const item = menuData.flatMap(cat => cat.items).find(i => i.id === itemId);
    const currentCount = cart[itemId] || 0;
    
    if (currentCount >= 10) {
      HapticService.warning();
      Alert.alert("Limit Reached", `Maximum 10 ${item.name} per order`);
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
    const item = menuData.flatMap(cat => cat.items).find(i => i.id === itemId);
    
    if (isCurrentlyFavorite) {
      HapticService.light();
      setFavorites(prev => prev.filter(id => id !== itemId));
    } else {
      HapticService.success();
      setFavorites(prev => [...prev, itemId]);
      setRecentlyFavorited(item);
      setTimeout(() => setRecentlyFavorited(null), 2000);
    }
  };

  const getTotal = () => {
    let total = 0;
    menuData.forEach((cat) =>
      cat.items.forEach((item) => {
        if (cart[item.id]) total += cart[item.id] * item.price;
      })
    );
    return total;
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const selectedItemBadge = selectedItem ? getCategoryBadge(selectedItem.category) : null;

  // Enhanced filtered data with debounced search
  const filteredData = useMemo(() => {
    return menuData.map(category => ({
      ...category,
      items: category.items.filter(item => {
        const searchableText = `
          ${item.name} 
          ${item.description} 
          ${item.ingredients.join(' ')} 
          ${item.category}
        `.toLowerCase();
        
        const searchTerms = debouncedSearch.toLowerCase().split(' ');
        const matchesSearch = debouncedSearch ? 
          searchTerms.every(term => searchableText.includes(term)) : true;
        const matchesFilter = selectedFilter === "all" || item.category === selectedFilter;
        return matchesSearch && matchesFilter;
      })
    })).filter(category => category.items.length > 0);
  }, [debouncedSearch, selectedFilter]);

  // Enhanced favorites
  const enhancedFavorites = useMemo(() => {
    const favoriteItems = menuData.flatMap(cat => 
      cat.items.filter(item => favorites.includes(item.id))
    );
    return favoriteItems.sort((a, b) => b.popularity - a.popularity);
  }, [favorites]);

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    const allItems = menuData.flatMap(cat => cat.items);
    const popularItems = allItems
      .filter(item => item.popularity > 80)
      .slice(0, 5)
      .map(item => item.name);
    
    return [...new Set([...searchHistory, ...popularItems])].slice(0, 8);
  }, [searchHistory]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setSearchHistory(prev => 
        [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 10)
      );
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
    const cartItems = [];
    menuData.forEach(category => {
      category.items.forEach(item => {
        if (cart[item.id]) {
          cartItems.push({
            ...item,
            quantity: cart[item.id],
            total: cart[item.id] * item.price
          });
        }
      });
    });
    return cartItems;
  };

  const clearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            HapticService.heavy();
            setCart({});
          }
        },
      ]
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPersistentData().finally(() => setRefreshing(false));
  }, []);

  // Enhanced modal with gesture (simplified)
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

  const renderCategory = useCallback(({ item: category }) => (
    <View style={styles.categorySection}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => toggleExpand(category.id)}
        accessibilityLabel={`${category.category} category, ${expanded[category.id] ? 'expanded' : 'collapsed'}`}
        accessibilityRole="button"
      >
        <View>
          <Text style={styles.categoryText}>{category.category}</Text>
          <Text style={styles.categoryCount}>{category.items.length} items</Text>
        </View>
        <Ionicons
          name={expanded[category.id] ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#f8fafc"
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
            />
          ))}
        </View>
      )}
    </View>
  ), [expanded, cart, favorites]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPersistentData}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        {/* Hero header */}
        <View style={styles.heroHeader}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Doner Habibi</Text>
            <Text style={styles.heroTitle}>Build your perfect order</Text>
            <Text style={styles.heroSubtitle}>
              Freshly carved doner, mezze, and desserts crafted for your cravings.
            </Text>
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatChip}>
                <Ionicons name="cart-outline" size={16} color="#fde68a" />
                <Text style={styles.heroStatText}>{getTotalItems()} in cart</Text>
              </View>
              <View style={styles.heroStatChip}>
                <Ionicons name="heart-outline" size={16} color="#fde68a" />
                <Text style={styles.heroStatText}>{favorites.length} favourites</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={openCartModal}
            accessibilityLabel={`View cart, ${getTotalItems()} items`}
            accessibilityRole="button"
            activeOpacity={0.85}
          >
            <Ionicons name="bag-handle-outline" size={26} color="#0f172a" />
            {getTotalItems() > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Enhanced Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={18} color="#94a3b8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes, ingredients..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowSuggestions(text.length > 0);
              }}
              onSubmitEditing={handleSearchSubmit}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              returnKeyType="search"
              blurOnSubmit={true}
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
                <Ionicons name="close-circle" size={20} color="#cbd5f5" />
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
                  <Ionicons name="arrow-forward-circle" size={18} color="#f97316" style={styles.suggestionIcon} />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick Favorites */}
        {enhancedFavorites.length > 0 && (
          <View style={styles.quickFavoritesContainer}>
            <Text style={styles.quickFavoritesTitle}>Your Favorites</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickFavorites}>
              {enhancedFavorites.slice(0, 8).map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quickFavoriteItem}
                  onPress={() => openItemModal(item)}
                  accessibilityLabel={`Quick add ${item.name}`}
                  accessibilityRole="button"
                >
                  <ProgressiveImage source={item.image} style={styles.quickFavoriteImage} item={item} />
                  <Text style={styles.quickFavoriteName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recently Favorited Toast */}
        {recentlyFavorited && (
          <View style={styles.favoriteToast}>
            <Text style={styles.favoriteToastText}>❤️ Added to favorites!</Text>
          </View>
        )}

        {/* Filter Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContentContainer}
        >
          {filterCategories.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => {
                HapticService.light();
                setSelectedFilter(filter.id);
              }}
              accessibilityLabel={`Filter by ${filter.name}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedFilter === filter.id }}
            >
              <Ionicons
                name={filter.icon}
                size={16}
                style={styles.filterEmoji}
                color={selectedFilter === filter.id ? '#0f172a' : '#94a3b8'}
              />
              <Text
                style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
              ]}
              >
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu List */}
        {filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-circle-outline" size={56} color="#f97316" style={styles.emptyStateEmoji} />
            <Text style={styles.emptyStateTitle}>No items found</Text>
            <Text style={styles.emptyStateText}>
              {debouncedSearch ? `No results for "${debouncedSearch}"` : 'Try changing your filters'}
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
              <Text style={styles.emptyStateButtonText}>Show All Items</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(cat) => cat.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={renderCategory}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        )}

        {/* Enhanced Item Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          statusBarTranslucent={true}
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
                        accessibilityLabel={favorites.includes(selectedItem.id) ? `Remove ${selectedItem.name} from favorites` : `Add ${selectedItem.name} to favorites`}
                        accessibilityRole="button"
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={favorites.includes(selectedItem.id) ? 'heart' : 'heart-outline'}
                          size={24}
                          color={favorites.includes(selectedItem.id) ? '#ef4444' : '#f8fafc'}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalInfo}>
                      <View style={styles.modalInfoChip}>
                        <Ionicons name="cash-outline" size={18} color="#f97316" />
                        <Text style={styles.modalInfoText}>ILS {selectedItem.price}</Text>
                      </View>
                      <View style={styles.modalInfoChip}>
                        <Ionicons name="timer-outline" size={18} color="#38bdf8" />
                        <Text style={styles.modalInfoText}>{selectedItem.preparationTime} min prep</Text>
                      </View>
                      <View style={styles.modalInfoChip}>
                        <Ionicons name="flame-outline" size={18} color="#facc15" />
                        <Text style={styles.modalInfoText}>{selectedItem.popularity}% love it</Text>
                      </View>
                    </View>
                    <Text style={styles.modalDescription}>{selectedItem.description}</Text>

                    <View style={styles.modalBadges}>
                      {selectedItemBadge && (
                        <View style={[styles.modalBadge, { backgroundColor: selectedItemBadge.background }]}>
                          <MaterialCommunityIcons
                            name={selectedItemBadge.icon}
                            size={16}
                            color={selectedItemBadge.color}
                          />
                          <Text style={[styles.modalBadgeText, { color: selectedItemBadge.color }]}>
                            {selectedItemBadge.label}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.ingredientsTitle}>Ingredients</Text>
                    <Text style={styles.ingredientsList}>
                      {selectedItem.ingredients.join(", ")}
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
                      <Text style={styles.modalCount}>{cart[selectedItem.id] || 0}</Text>
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

        {/* Cart Modal */}
        <Modal
          visible={cartModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setCartModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, styles.cartModalContent]}>
                <Text style={styles.cartTitle}>Your Cart ({getTotalItems()} items)</Text>
                
                {getCartItems().length === 0 ? (
                  <View style={styles.emptyCart}>
                    <Text style={styles.emptyCartEmoji}>🛒</Text>
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
                            <Text style={styles.cartItemPrice}>ILS {item.price} x {item.quantity}</Text>
                          </View>
                          <Text style={styles.cartItemTotal}>ILS {item.total}</Text>
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
                          router.push("/payment");
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

        {/* Footer with total and proceed button */}
        {getTotalItems() > 0 && (
          <View style={styles.footer}>
            <Text style={styles.totalText}>
              Total: ILS {getTotal()} ({getTotalItems()} items)
            </Text>
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => {
                router.push("/payment");
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
    </TouchableWithoutFeedback>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff4e6" },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff4e6",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff4e6",
    padding: 20,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d35400',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffcc80",
    borderBottomWidth: 1,
    borderColor: "#e0a96d",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7d2e14",
  },
  cartIcon: {
    position: "relative",
    padding: 8,
  },
  cartEmoji: {
    fontSize: 24,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#d35400",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    margin: 15,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearSearch: {
    padding: 5,
  },
  clearSearchText: {
    fontSize: 18,
    color: '#666',
  },
  suggestionsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionText: {
    fontSize: 14,
    color: "#666",
  },
  quickFavoritesContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  quickFavoritesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7d2e14",
    marginBottom: 8,
  },
  quickFavorites: {
    flexDirection: 'row',
  },
  quickFavoriteItem: {
    alignItems: 'center',
    marginRight: 12,
    width: 70,
  },
  quickFavoriteImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  quickFavoriteName: {
    fontSize: 12,
    color: "#333",
    textAlign: 'center',
  },
  favoriteToast: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(230, 126, 34, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1000,
  },
  favoriteToastText: {
    color: 'white',
    fontWeight: '600',
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterContentContainer: {
    paddingHorizontal: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    width: 100,
    height: 40,
    justifyContent: "center",
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: "#e67e22",
  },
  filterEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  filterText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "white",
    fontWeight: "500",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffcc80",
    borderBottomWidth: 1,
    borderColor: "#e0a96d",
  },
  categoryText: { fontSize: 18, fontWeight: "600", color: "#7d2e14" },
  expandIcon: { fontSize: 16, color: "#7d2e14" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#333",
    flex: 1,
  },
  favoriteButton: {
    padding: 5,
  },
  heartIcon: {
    fontSize: 16,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  itemPrice: { 
    fontSize: 14, 
    color: "#e67e22",
    fontWeight: "500",
    marginRight: 10,
  },
  preparationTime: {
    fontSize: 12,
    color: "#666",
  },
  dietaryIcons: {
    flexDirection: "row",
  },
  dietaryIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  controls: { 
    flexDirection: "row", 
    alignItems: "center",
    marginLeft: 10,
  },
  btn: {
    backgroundColor: "#e67e22",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { backgroundColor: "#ccc" },
  btnText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold",
    lineHeight: 18,
  },
  count: { 
    marginHorizontal: 12, 
    fontSize: 16, 
    minWidth: 20, 
    textAlign: "center",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#ffe0b2",
  },
  totalText: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginBottom: 10, 
    color: "#7d2e14" 
  },
  payButton: {
    backgroundColor: "#d35400",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  payText: { fontSize: 18, fontWeight: "600", color: "white" },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalScrollContent: {
    padding: 20,
  },
  cartModalContent: {
    maxHeight: "70%",
  },
  modalImage: {
    width: "100%",
    height: 200,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  modalFavorite: {
    padding: 5,
  },
  modalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 20,
    color: "#e67e22",
    fontWeight: "bold",
  },
  modalPreparationTime: {
    fontSize: 14,
    color: "#666",
  },
  modalPopularity: {
    fontSize: 14,
    color: "#666",
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    lineHeight: 22,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  ingredientsList: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  dietarySection: {
    marginBottom: 20,
  },
  dietaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  modalDietaryIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  noDietary: {
    fontSize: 14,
    color: "#999",
    fontStyle: 'italic',
  },
  modalControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalBtn: {
    backgroundColor: "#e67e22",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCount: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  closeModal: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  closeModalText: {
    fontSize: 16,
    color: "#333",
  },
  
  // Cart Modal Styles
  cartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  emptyCart: {
    alignItems: 'center',
    padding: 40,
  },
  emptyCartEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cartItemsScroll: {
    maxHeight: 300,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cartItemPrice: {
    fontSize: 14,
    color: "#666",
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e67e22",
  },
  cartTotal: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 15,
    marginTop: 15,
  },
  cartActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  clearCartButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearCartText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});
