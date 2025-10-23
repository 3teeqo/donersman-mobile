import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Import or define the same menuData structure as in orders.jsx
const menuData = [
  {
    id: "1",
    category: "Doner & Shawarma",
    items: [
      { 
        id: "1-1", 
        name: "Chicken Doner", 
        price: 15,
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

export default function Payment() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderType, setOrderType] = useState("delivery");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Calculate cart totals from AsyncStorage
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

        // Calculate totals and get cart items
        menuData.forEach(category => {
          category.items.forEach(item => {
            if (cart[item.id]) {
              const quantity = cart[item.id];
              const itemTotal = quantity * item.price;
              
              totalPrice += itemTotal;
              count += quantity;
              
              items.push({
                ...item,
                quantity,
                total: itemTotal
              });
            }
          });
        });

        setCartItems(items);
        setSubtotal(totalPrice);
        setItemCount(count);
      } catch (error) {
        console.log('Error loading cart data:', error);
        Alert.alert("Error", "Failed to load cart data");
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, []);

  const deliveryFee = orderType === "delivery" ? 5 : 0;
  const total = subtotal + deliveryFee;

  const handlePayment = async () => {
    if (paymentMethod === "card" && (!cardNumber || !expiry || !cvv || !name)) {
      Alert.alert("Error", "Please fill all card details");
      return;
    }

    if (itemCount === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    try {
      // Clear the cart after successful payment
      await AsyncStorage.removeItem('cart');
      
      Alert.alert(
        "Order Confirmed ✅",
        `Payment via ${paymentMethod === "card"
          ? "Visa/Mastercard"
          : paymentMethod === "applepay"
          ? "Apple Pay"
          : "Cash"} (${orderType}) successful!\nTotal: ₪${total.toFixed(2)}`,
        [
          {
            text: "OK",
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error) {
      console.log('Error processing payment:', error);
      Alert.alert("Error", "Failed to process payment");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e67e22" />
          <Text style={styles.loadingText}>Loading payment details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (itemCount === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payment</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add some delicious items to your cart first!
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Order Items Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items ({itemCount})</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  ₪{item.price} × {item.quantity}
                </Text>
              </View>
              <Text style={styles.itemTotal}>₪{item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                paymentMethod === "applepay" && styles.optionSelected,
              ]}
              onPress={() => setPaymentMethod("applepay")}
            >
              <Text style={styles.optionText}> Apple Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                paymentMethod === "card" && styles.optionSelected,
              ]}
              onPress={() => setPaymentMethod("card")}
            >
              <Text style={styles.optionText}>💳 Visa / Mastercard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                paymentMethod === "cash" && styles.optionSelected,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <Text style={styles.optionText}>💵 Cash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card Inputs */}
        {paymentMethod === "card" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Cardholder Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              maxLength={16}
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="MM/YY"
                value={expiry}
                onChangeText={setExpiry}
                maxLength={5}
              />

              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>
        )}

        {/* Pickup or Delivery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Type</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                orderType === "delivery" && styles.optionSelected,
              ]}
              onPress={() => setOrderType("delivery")}
            >
              <Text style={styles.optionText}>🚚 Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                orderType === "pickup" && styles.optionSelected,
              ]}
              onPress={() => setOrderType("pickup")}
            >
              <Text style={styles.optionText}>🏪 Pickup</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal ({itemCount} items)</Text>
            <Text style={styles.summaryText}>₪{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {orderType === "delivery" ? "Delivery Fee" : "Pickup"}
            </Text>
            <Text style={styles.summaryText}>
              ₪{deliveryFee.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryTotal}>₪{total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payButton} 
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {paymentMethod === "cash" ? `Confirm Order - ₪${total.toFixed(2)}` : `Pay Now - ₪${total.toFixed(2)}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    backgroundColor: "#e67e22",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e67e22",
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 4,
  },
  optionSelected: {
    backgroundColor: "#e67e22",
  },
  optionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  summary: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    marginTop: 5,
  },
  summaryText: {
    fontSize: 16,
    color: "#666",
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e67e22",
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  payButton: {
    backgroundColor: "#e67e22",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  payButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    padding: 15,
    alignItems: "center",
  },
  backButtonText: {
    color: "#666",
    fontSize: 16,
  },
});