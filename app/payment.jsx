import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
        description: 'Layered pastry filled with nuts and sweet syrup',
        ingredients: ['Phyllo', 'Walnuts', 'Pistachios', 'Syrup'],
        dietary: ['dessert'],
        category: 'desserts',
        preparationTime: 10,
        popularity: 94,
      },
      {
        id: '5-2',
        name: 'Kunafa',
        price: 18,
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

const PAYMENT_METHODS = [
  {
    id: 'applepay',
    label: 'Apple Pay',
    helper: 'Authenticate with Face ID or Touch ID',
    icon: 'logo-apple',
  },
  {
    id: 'card',
    label: 'Visa / Mastercard',
    helper: 'Pay securely with your card',
    icon: 'card-outline',
  },
  {
    id: 'cash',
    label: 'Cash',
    helper: 'Pay when your order arrives',
    icon: 'cash-outline',
  },
];

const ORDER_TYPES = [
  {
    id: 'delivery',
    label: 'Delivery',
    helper: 'We will bring it to your door',
    icon: 'bicycle-outline',
    fee: 5,
  },
  {
    id: 'pickup',
    label: 'Pickup',
    helper: 'Collect in-store when it is ready',
    icon: 'walk-outline',
    fee: 0,
  },
];

const TIP_PRESETS = [0, 3, 5, 10];

const formatCurrency = (value) => `ILS ${value.toFixed(2)}`;

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
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
      fontSize: 24,
      fontWeight: '700',
    },
    heroSubtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    heroStatsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
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
    content: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 200,
      gap: 20,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 22,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      elevation: 8,
      gap: 18,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    sectionSubtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      marginTop: 4,
    },
    sectionChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      gap: 6,
    },
    sectionChipText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    // Order items list styles
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderMuted,
    },
    itemRowLast: {
      borderBottomWidth: 0,
    },
    itemMeta: {
      flex: 1,
      gap: 6,
    },
    itemName: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    itemDetailsRow: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    itemQuantityPill: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderWidth: 1,
      borderColor: colors.borderMuted,
    },
    itemQuantityText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    itemDetailText: {
      color: colors.textSecondary,
      fontSize: 13,
    },
    itemTotal: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    methodGrid: {
      gap: 12,
    },
    methodCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceAlt,
      padding: 16,
      gap: 14,
    },
    methodCardActive: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    methodIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSoft,
    },
    methodCopy: {
      flex: 1,
      gap: 4,
    },
    methodTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    methodHelper: {
      color: colors.textSecondary,
      fontSize: 13,
    },
    methodTrailing: {
      alignItems: 'flex-end',
      gap: 6,
    },
    fieldGroup: {
      gap: 6,
    },
    inputLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      color: colors.textPrimary,
      fontSize: 15,
    },
    inlineFields: {
      flexDirection: 'row',
      gap: 14,
    },
    inlineField: {
      flex: 1,
    },
    tipSection: {
      gap: 12,
    },
    tipTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    tipSubtitle: {
      color: colors.textSecondary,
      fontSize: 13,
    },
    tipOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    tipChip: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: colors.surfaceMuted,
    },
    tipChipActive: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    tipChipText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
    tipChipTextActive: {
      color: colors.accent,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    summaryLabel: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    summaryValue: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    summaryDivider: {
      height: 1,
      backgroundColor: colors.borderMuted,
      marginVertical: 12,
    },
    summaryTotalRow: {
      alignItems: 'center',
    },
    summaryTotalLabel: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    summaryTotalValue: {
      color: colors.accent,
      fontSize: 18,
      fontWeight: '700',
    },
    footerBar: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 28,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.heroBackground,
    },
    payButton: {
      backgroundColor: colors.accent,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
    },
    payButtonDisabled: {
      opacity: 0.4,
    },
    payButtonText: {
      color: colors.accentText,
      fontSize: 16,
      fontWeight: '700',
    },
    secondaryButton: {
      alignItems: 'center',
      marginTop: 14,
    },
    secondaryButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '600',
    },
    centerState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      gap: 16,
    },
    centerStateText: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 22,
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '700',
    },
    heroStatIcon: {
      color: colors.highlight,
    },
  });

export default function Payment() {
  const { user, role, loading: authLoading } = useAuth();
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderType, setOrderType] = useState('delivery');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const loadCartData = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cart');
        if (!cartData) {
          setLoading(false);
          return;
        }

        const cart = JSON.parse(cartData);
        let totalPrice = 0;
        let count = 0;
        const items = [];

        menuData.forEach((category) => {
          category.items.forEach((item) => {
            if (cart[item.id]) {
              const quantity = cart[item.id];
              const itemTotal = quantity * item.price;

              totalPrice += itemTotal;
              count += quantity;

              items.push({
                ...item,
                quantity,
                total: itemTotal,
              });
            }
          });
        });

        setCartItems(items);
        setSubtotal(totalPrice);
        setItemCount(count);
      } catch (error) {
        console.log('Error loading cart data:', error);
        Alert.alert('Error', 'Failed to load your cart. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, []);

  const deliveryFee = useMemo(() => {
    const type = ORDER_TYPES.find((entry) => entry.id === orderType);
    return type ? type.fee : 0;
  }, [orderType]);

  const total = useMemo(
    () => subtotal + deliveryFee + tip,
    [subtotal, deliveryFee, tip]
  );

  const estimatedPrep = useMemo(() => {
    if (!cartItems.length) return 20;
    return cartItems.reduce(
      (max, item) => Math.max(max, item.preparationTime || 15),
      15
    );
  }, [cartItems]);

  const isCard = paymentMethod === 'card';
  const sanitizedCardNumber = cardNumber.replace(/\s/g, '');
  const isCardComplete =
    cardholder.trim().length > 0 &&
    sanitizedCardNumber.length === 16 &&
    expiry.length === 5 &&
    cvv.length === 3;

  const selectedPayment = PAYMENT_METHODS.find(
    (method) => method.id === paymentMethod
  );
  const selectedOrderType = ORDER_TYPES.find(
    (type) => type.id === orderType
  );

  const handleCardNumberChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    setCardNumber(groups ? groups.join(' ') : '');
  };

  const handleExpiryChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length === 0) {
      setExpiry('');
    } else if (digits.length <= 2) {
      setExpiry(digits);
    } else {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2, 4)}`);
    }
  };

  const handleCvvChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 3);
    setCvv(digits);
  };

  const handleTipPreset = (amount) => {
    setTip(amount);
    setCustomTip(amount === 0 ? '' : amount.toString());
  };

  const handleTipInputChange = (value) => {
    const digits = value.replace(/[^\d]/g, '');
    setCustomTip(digits);
    const numeric = Number(digits);
    setTip(Number.isNaN(numeric) ? 0 : numeric);
  };

  const canPay = itemCount > 0 && (!isCard || isCardComplete);

  const handlePayment = async () => {
    if (!canPay) {
      Alert.alert(
        'Incomplete Details',
        isCard
          ? 'Please complete all card details before continuing.'
          : 'Add items to your cart before placing an order.'
      );
      return;
    }

    try {
      await AsyncStorage.removeItem('cart');

      const paymentLabel = selectedPayment?.label ?? paymentMethod;
      const orderLabel = selectedOrderType?.label ?? orderType;

      Alert.alert(
        'Order Confirmed!',
        `Payment via ${paymentLabel} (${orderLabel}) successful!\nTotal charged: ${formatCurrency(
          total
        )}${
          instructions.trim()
            ? `\nNotes for our team: ${instructions.trim()}`
            : ''
        }`,
        [
          {
            text: 'Great!',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error) {
      console.log('Error processing payment:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    }
  };

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
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.centerStateText}>Loading your order…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (itemCount === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.heroHeader}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Checkout</Text>
            <Text style={styles.heroTitle}>No items yet</Text>
            <Text style={styles.heroSubtitle}>
              Add a few dishes to start the payment process.
            </Text>
          </View>
        </View>

        <View style={styles.centerState}>
          <Ionicons name="cart-outline" size={72} color={colors.iconSecondary} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.centerStateText}>
            Browse the menu and add your cravings before you check out.
          </Text>
        </View>

        <View style={styles.footerBar}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => router.back()}
          >
            <Text style={styles.payButtonText}>Return to the menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const payLabel = paymentMethod === 'cash' ? 'Confirm Order' : 'Pay Securely';
  const payButtonText = `${payLabel} - ${formatCurrency(total)}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroHeader}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroEyebrow}>Checkout</Text>
          <Text style={styles.heroTitle}>Finalize & Pay</Text>
          <Text style={styles.heroSubtitle}>
            Review your order and choose how you'd like to pay.
          </Text>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatChip}>
              <Ionicons name="bag-handle-outline" size={16} style={styles.heroStatIcon} />
              <Text style={styles.heroStatText}>{itemCount} items</Text>
            </View>
            <View style={styles.heroStatChip}>
              <Ionicons name="time-outline" size={16} style={styles.heroStatIcon} />
              <Text style={styles.heroStatText}>{estimatedPrep} min prep</Text>
            </View>
            <View style={styles.heroStatChip}>
              <Ionicons name="cash-outline" size={16} style={styles.heroStatIcon} />
              <Text style={styles.heroStatText}>{formatCurrency(total)}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Order Items</Text>
              <Text style={styles.sectionSubtitle}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Text>
            </View>
            <View style={styles.sectionChip}>
              <Ionicons name="restaurant-outline" size={16} color={colors.iconSecondary} />
              <Text style={styles.sectionChipText}>Doner Habibi</Text>
            </View>
          </View>
          {cartItems.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index === cartItems.length - 1 && styles.itemRowLast,
              ]}
            >
              <View style={styles.itemMeta}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemDetailsRow}>
                  <View style={styles.itemQuantityPill}>
                    <Text style={styles.itemQuantityText}>x{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemDetailText}>
                    {formatCurrency(item.price)}
                  </Text>
                </View>
              </View>
              <Text style={styles.itemTotal}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <Text style={styles.sectionSubtitle}>
                Choose how you'd like to pay
              </Text>
            </View>
          </View>
          <View style={styles.methodGrid}>
            {PAYMENT_METHODS.map((method) => {
              const isActive = paymentMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    isActive && styles.methodCardActive,
                  ]}
                  activeOpacity={0.9}
                  onPress={() => setPaymentMethod(method.id)}
                >
                  <View style={styles.methodIconWrap}>
                    <Ionicons
                      name={method.icon}
                      size={20}
                      color={isActive ? colors.accent : colors.iconSecondary}
                    />
                  </View>
                  <View style={styles.methodCopy}>
                    <Text style={styles.methodTitle}>{method.label}</Text>
                    <Text style={styles.methodHelper}>{method.helper}</Text>
                  </View>
                  <View style={styles.methodTrailing}>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={colors.accent}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {isCard && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Card Details</Text>
                <Text style={styles.sectionSubtitle}>
                  Enter the card you'd like to use
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                value={cardholder}
                onChangeText={setCardholder}
                placeholder="Name on card"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inlineFields}>
              <View style={styles.inlineField}>
                <Text style={styles.inputLabel}>Expiry</Text>
                <TextInput
                  style={styles.input}
                  value={expiry}
                  onChangeText={handleExpiryChange}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View style={styles.inlineField}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={handleCvvChange}
                  placeholder="123"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Order preferences</Text>
              <Text style={styles.sectionSubtitle}>
                Schedule, tips, and delivery notes
              </Text>
            </View>
          </View>

          <View style={styles.methodGrid}>
            {ORDER_TYPES.map((type) => {
              const isActive = orderType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.methodCard,
                    isActive && styles.methodCardActive,
                  ]}
                  activeOpacity={0.9}
                  onPress={() => setOrderType(type.id)}
                >
                 <View style={styles.methodIconWrap}>
                   <Ionicons
                     name={type.icon}
                     size={20}
                      color={isActive ? colors.accent : colors.iconSecondary}
                    />
                 </View>
                 <View style={styles.methodCopy}>
                    <Text style={styles.methodTitle}>{type.label}</Text>
                    <Text style={styles.methodHelper}>{type.helper}</Text>
                  </View>
                  <View style={styles.methodTrailing}>
                    <Text style={styles.methodHelper}>
                      {type.fee > 0 ? formatCurrency(type.fee) : 'Free'}
                    </Text>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={colors.accent}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.tipSection}>
            <Text style={styles.tipTitle}>Tip your courier</Text>
            <Text style={styles.tipSubtitle}>
              100% of tips go directly to your rider
            </Text>
            <View style={styles.tipOptions}>
              {TIP_PRESETS.map((amount) => {
                const isActive = tip === amount;
                return (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.tipChip,
                      isActive && styles.tipChipActive,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => handleTipPreset(amount)}
                  >
                    <Text
                      style={[
                        styles.tipChipText,
                        isActive && styles.tipChipTextActive,
                      ]}
                    >
                      {amount === 0 ? 'No tip' : formatCurrency(amount)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

           <TextInput
             style={styles.input}
             value={customTip}
             onChangeText={handleTipInputChange}
              placeholder="Custom tip amount"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Delivery notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Add apartment code, buzzer number, or special requests"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical='top'
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order summary</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {orderType === 'delivery' ? 'Delivery fee' : 'Pickup'}
            </Text>
            <Text style={styles.summaryValue}>
              {orderType === 'delivery'
                ? formatCurrency(deliveryFee)
                : 'Free'}
            </Text>
          </View>

          {tip > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tip</Text>
              <Text style={styles.summaryValue}>{formatCurrency(tip)}</Text>
            </View>
          )}

          <View style={styles.summaryDivider} />

          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.summaryTotalLabel}>Total due</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerBar}>
        <TouchableOpacity
          style={[styles.payButton, !canPay && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={!canPay}
        >
          <Text style={styles.payButtonText}>{payButtonText}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>Back to cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


