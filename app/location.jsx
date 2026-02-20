import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { StyleSheet } from 'react-native';
import { useAppTheme } from '../contexts/AppThemeContext';

const LocationServices = () => {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Other',
    name: '',
    address: '',
    details: '',
    icon: '📍',
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const addressTypes = [
    { type: 'Home', icon: '🏠', color: '#4CAF50' },
    { type: 'Work', icon: '🏢', color: '#2196F3' },
    { type: 'Other', icon: '📍', color: '#FF9800' },
  ];

  // Load addresses on component mount
  useEffect(() => {
    loadAddresses();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic)
    }).start();
  }, []);

  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('addresses');
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
        // Set first address as selected if none is selected
        if (parsedAddresses.length > 0 && !selectedAddress) {
          const defaultAddr = parsedAddresses.find(addr => addr.isDefault) || parsedAddresses[0];
          setSelectedAddress(defaultAddr);
        }
      } else {
        // Load sample addresses if no saved data
        const sampleAddresses = [
          {
            id: 1,
            type: 'Home',
            name: 'Home',
            address: 'Al-Najah University, Nablus',
            details: 'Building A, Room 101',
            icon: '🏠',
            isDefault: true,
          },
          {
            id: 2,
            type: 'Work',
            name: 'Office',
            address: 'City Center, Nablus',
            details: 'Floor 3, Office 305',
            icon: '🏢',
            isDefault: false,
          },
        ];
        setAddresses(sampleAddresses);
        setSelectedAddress(sampleAddresses[0]);
      }
    } catch (error) {
      console.log('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAddresses = async (updatedAddresses) => {
    try {
      await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    } catch (error) {
      console.log('Error saving addresses:', error);
    }
  };

  useEffect(() => {
    saveAddresses(addresses);
  }, [addresses]);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location permissions to use this feature.',
          [{ text: 'OK' }]
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      
      // Reverse geocoding to get address
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (geocode.length > 0) {
        const address = geocode[0];
        const formattedAddress = `${address.street || ''} ${address.streetNumber || ''}, ${address.city || ''}, ${address.region || ''}`.trim();
        
        const newLocationAddress = {
          id: Date.now(),
          type: 'Current Location',
          name: 'Current Location',
          address: formattedAddress || 'Location detected',
          details: 'Automatically detected from your device',
          icon: '📍',
          isDefault: false,
          isCurrentLocation: true,
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        };

        setAddresses(prev => [newLocationAddress, ...prev]);
        setSelectedAddress(newLocationAddress);
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Your current location has been detected and saved!');
      }
    } catch (error) {
      console.log('Error getting location:', error);
      Alert.alert('Error', 'Could not detect your current location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const addNewAddress = () => {
    if (!newAddress.name.trim() || !newAddress.address.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const address = {
      id: Date.now(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    const updatedAddresses = [...addresses, address];
    setAddresses(updatedAddresses);
    
    if (addresses.length === 0) {
      setSelectedAddress(address);
    }
    
    setNewAddress({ type: 'Other', name: '', address: '', details: '', icon: '📍' });
    setModalVisible(false);
    
    Alert.alert('Success', 'New address added successfully!');
  };

  const setDefaultAddress = (addressId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
    setSelectedAddress(updatedAddresses.find(addr => addr.id === addressId));
  };

  const deleteAddress = (addressId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
            setAddresses(updatedAddresses);
            
            // If deleted address was selected or default, select the first remaining one
            if ((selectedAddress?.id === addressId || addresses.find(a => a.id === addressId)?.isDefault) && updatedAddresses.length > 0) {
              const newDefault = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0];
              setSelectedAddress(newDefault);
            }
            
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      ]
    );
  };

  const editAddress = (address) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNewAddress({
      type: address.type,
      name: address.name,
      address: address.address,
      details: address.details || '',
      icon: address.icon,
    });
    setModalVisible(true);
    
    // Remove the address being edited
    const updatedAddresses = addresses.filter(addr => addr.id !== address.id);
    setAddresses(updatedAddresses);
  };

  const getTypeColor = (type) => {
    const typeObj = addressTypes.find(t => t.type === type);
    return typeObj ? typeObj.color : '#666';
  };

  const validateAddress = () => {
    return newAddress.name.trim().length > 0 && newAddress.address.trim().length > 0;
  };

  if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading your addresses...</Text>
      </View>
    );
  }

    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTopRow}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      if (router.canGoBack?.()) {
                        router.back();
                      } else {
                        router.push('/');
                      }
                    }}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                  >
                    <Text style={styles.backButtonText}>‹</Text>
                  </TouchableOpacity>
                  <View style={styles.headerTitleBlock}>
                    <Text style={styles.title}>Delivery Addresses</Text>
                    <Text style={styles.subtitle}>Manage your delivery locations</Text>
                  </View>
                </View>
                <View style={styles.headerStats}>
                <Text style={styles.addressCount}>{addresses.length} addresses</Text>
                {selectedAddress && (
                  <Text style={styles.selectedText}>📍 {selectedAddress.name} selected</Text>
                )}
              </View>
            </View>

            {/* Current Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Detect Current Location</Text>
              <TouchableOpacity 
                style={styles.currentLocationCard}
                onPress={getCurrentLocation}
                disabled={locationLoading}
              >
                  {locationLoading ? (
                    <View style={styles.locationLoading}>
                      <ActivityIndicator size="small" color={colors.accent} />
                    <Text style={styles.locationLoadingText}>Detecting your location...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.currentLocationText}>📍 Use my current location</Text>
                    <Text style={styles.currentLocationSubtext}>
                      We'll detect your location automatically using GPS
                    </Text>
                    <View style={styles.locationFeatures}>
                      <Text style={styles.locationFeature}>📡 GPS Accuracy</Text>
                      <Text style={styles.locationFeature}>⚡ Instant Detection</Text>
                      <Text style={styles.locationFeature}>🎯 Precise Location</Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Saved Addresses */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>💾 Saved Addresses</Text>
                  <Text style={styles.sectionSubtitle}>Your frequently used addresses</Text>
                </View>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.addButtonIcon}>+</Text>
                  <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
              </View>

              {addresses.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateEmoji}>🏠</Text>
                  <Text style={styles.emptyStateTitle}>No addresses saved</Text>
                  <Text style={styles.emptyStateText}>
                    Add your first delivery address to get started
                  </Text>
                  <TouchableOpacity 
                    style={styles.emptyStateButton}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={styles.emptyStateButtonText}>Add Address</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                addresses.map((address) => (
                  <TouchableOpacity
                    key={address.id}
                    style={[
                      styles.addressCard,
                      selectedAddress?.id === address.id && styles.selectedAddress,
                      address.isCurrentLocation && styles.currentLocationAddress
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedAddress(address);
                    }}
                  >
                    <View style={styles.addressHeader}>
                      <View style={styles.addressTypeContainer}>
                        <Text style={styles.addressIcon}>{address.icon}</Text>
                        <View>
                          <Text style={styles.addressType}>{address.type}</Text>
                          {address.isDefault && (
                            <Text style={styles.defaultBadge}>Default</Text>
                          )}
                          {address.isCurrentLocation && (
                            <Text style={styles.currentLocationBadge}>Live Location</Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.addressActions}>
                        {!address.isDefault && !address.isCurrentLocation && (
                          <TouchableOpacity
                            style={styles.setDefaultBtn}
                            onPress={() => setDefaultAddress(address.id)}
                          >
                            <Text style={styles.setDefaultText}>Set Default</Text>
                          </TouchableOpacity>
                        )}
                        {!address.isCurrentLocation && (
                          <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => editAddress(address)}
                          >
                            <Text style={styles.editText}>✏️</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => deleteAddress(address.id)}
                        >
                          <Text style={styles.deleteText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <Text style={styles.addressName}>{address.name}</Text>
                    <Text style={styles.addressText}>{address.address}</Text>
                    {address.details && (
                      <Text style={styles.addressDetails}>{address.details}</Text>
                    )}
                    
                    {address.isCurrentLocation && address.coordinates && (
                      <View style={styles.coordinates}>
                        <Text style={styles.coordinatesText}>
                          📍 {address.coordinates.latitude.toFixed(4)}, {address.coordinates.longitude.toFixed(4)}
                        </Text>
                      </View>
                    )}
                    
                    {selectedAddress?.id === address.id && (
                      <View style={styles.selectedIndicator}>
                        <Text style={styles.selectedText}>✓ Selected for delivery</Text>
                        <Text style={styles.deliveryEstimate}>Estimated delivery: 25-35 min</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* Delivery Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚚 Delivery Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>⏱️</Text>
                  <View>
                    <Text style={styles.infoTitle}>Delivery Time</Text>
                    <Text style={styles.infoText}>25-45 minutes</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>💰</Text>
                  <View>
                    <Text style={styles.infoTitle}>Delivery Fee</Text>
                    <Text style={styles.infoText}>₪5.00 (Free over ₪50)</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>🎯</Text>
                  <View>
                    <Text style={styles.infoTitle}>Delivery Area</Text>
                    <Text style={styles.infoText}>Nablus and surrounding areas</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Order Tracking Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📱 Order Tracking</Text>
              <View style={styles.trackingCard}>
                <Text style={styles.trackingTitle}>Real-time Order Tracking</Text>
                <Text style={styles.trackingText}>
                  Once you place an order, track your delivery in real-time with live updates
                </Text>
                <View style={styles.trackingSteps}>
                  <View style={styles.trackingStep}>
                    <Text style={styles.stepNumber}>1</Text>
                    <View>
                      <Text style={styles.stepTitle}>Order Confirmed</Text>
                      <Text style={styles.stepDescription}>We receive your order</Text>
                    </View>
                  </View>
                  <View style={styles.trackingStep}>
                    <Text style={styles.stepNumber}>2</Text>
                    <View>
                      <Text style={styles.stepTitle}>Being Prepared</Text>
                      <Text style={styles.stepDescription}>Chef starts cooking</Text>
                    </View>
                  </View>
                  <View style={styles.trackingStep}>
                    <Text style={styles.stepNumber}>3</Text>
                    <View>
                      <Text style={styles.stepTitle}>Out for Delivery</Text>
                      <Text style={styles.stepDescription}>Rider picks up your order</Text>
                    </View>
                  </View>
                  <View style={styles.trackingStep}>
                    <Text style={styles.stepNumber}>4</Text>
                    <View>
                      <Text style={styles.stepTitle}>Delivered</Text>
                      <Text style={styles.stepDescription}>Enjoy your meal!</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Footer Spacer */}
            <View style={styles.footerSpacer} />
          </ScrollView>

          {/* Add Address Modal */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Add New Address</Text>
                    <TouchableOpacity 
                      style={styles.closeModalButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeModalText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Address Type Selection */}
                  <Text style={styles.inputLabel}>Address Type</Text>
                  <View style={styles.typeSelector}>
                    {addressTypes.map((type) => (
                      <TouchableOpacity
                        key={type.type}
                        style={[
                          styles.typeButton,
                          newAddress.type === type.type && styles.selectedType,
                          { borderColor: type.color }
                        ]}
                        onPress={() => setNewAddress({
                          ...newAddress,
                          type: type.type,
                          icon: type.icon
                        })}
                      >
                        <Text style={styles.typeIcon}>{type.icon}</Text>
                        <Text style={[
                          styles.typeText,
                          newAddress.type === type.type && styles.selectedTypeText
                        ]}>
                          {type.type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Address Name */}
                  <Text style={styles.inputLabel}>
                    Address Name <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Home, Office, Friend's Place"
                    value={newAddress.name}
                    onChangeText={(text) => setNewAddress({...newAddress, name: text})}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />

                  {/* Address */}
                  <Text style={styles.inputLabel}>
                    Full Address <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Street address, building number, area"
                    value={newAddress.address}
                    onChangeText={(text) => setNewAddress({...newAddress, address: text})}
                    multiline
                    numberOfLines={3}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />

                  {/* Additional Details */}
                  <Text style={styles.inputLabel}>Additional Details</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Floor, apartment, landmark, additional instructions for delivery"
                    value={newAddress.details}
                    onChangeText={(text) => setNewAddress({...newAddress, details: text})}
                    multiline
                    numberOfLines={2}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={true}
                  />

                  <View style={styles.validationInfo}>
                    <Text style={styles.validationText}>
                      {validateAddress() ? '✅ All required fields are filled' : '⚠️ Fill in required fields'}
                    </Text>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setModalVisible(false);
                        setNewAddress({ type: 'Other', name: '', address: '', details: '', icon: '📍' });
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.saveButton,
                        !validateAddress() && styles.saveButtonDisabled
                      ]}
                      onPress={addNewAddress}
                      disabled={!validateAddress()}
                    >
                      <Text style={styles.saveButtonText}>Add Address</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  )
  }
  
const createStyles = (colors) =>
  StyleSheet.create({
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
      fontSize: 16,
      color: colors.textSecondary,
    },
  scrollView: {
    flex: 1,
  },
    header: {
      padding: 20,
      paddingTop: 60,
      backgroundColor: colors.heroBackground,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 12,
    },
    backButton: {
      padding: 8,
      borderRadius: 999,
      backgroundColor: colors.heroOverlay,
    },
    backButtonText: {
      fontSize: 18,
      color: colors.textPrimary,
      fontWeight: '600',
    },
    headerTitleBlock: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
  headerStats: {
    marginTop: 8,
  },
    addressCount: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    selectedText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  section: {
    margin: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    addButton: {
      backgroundColor: colors.accent,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
    },
    addButtonIcon: {
      color: colors.accentText,
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 6,
    },
    addButtonText: {
      color: colors.accentText,
      fontSize: 14,
      fontWeight: '600',
    },
    currentLocationCard: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.accent,
    borderStyle: 'dashed',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
    locationLoadingText: {
      marginLeft: 12,
      fontSize: 16,
      color: colors.accent,
      fontWeight: '600',
    },
    currentLocationText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.accent,
      marginBottom: 8,
    },
    currentLocationSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
  locationFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
    locationFeature: {
      fontSize: 12,
      color: colors.accent,
      backgroundColor: colors.accentSoft,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      overflow: 'hidden',
    },
    emptyState: {
      backgroundColor: colors.surface,
      padding: 40,
      borderRadius: 16,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
    },
    emptyStateButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    emptyStateButtonText: {
      color: colors.accentText,
      fontSize: 16,
      fontWeight: '600',
    },
    addressCard: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: colors.borderMuted,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    selectedAddress: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    currentLocationAddress: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressIcon: {
    fontSize: 24,
    marginRight: 12,
  },
    addressType: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    defaultBadge: {
      backgroundColor: colors.accent,
      color: colors.accentText,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    fontSize: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
    currentLocationBadge: {
      backgroundColor: colors.highlight,
      color: colors.highlightText,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    fontSize: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    setDefaultBtn: {
      backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
    setDefaultText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
  editBtn: {
    padding: 6,
    marginRight: 8,
  },
  editText: {
    fontSize: 16,
  },
  deleteBtn: {
    padding: 6,
  },
  deleteText: {
    fontSize: 16,
  },
    addressName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    addressText: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 4,
    },
  addressDetails: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
    coordinates: {
      marginTop: 8,
      padding: 8,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 8,
    },
    coordinatesText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: 'monospace',
    },
    selectedIndicator: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.accent,
    },
    deliveryEstimate: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    infoCard: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 16,
  },
    infoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    trackingCard: {
      backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
    trackingTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    trackingText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 20,
      lineHeight: 20,
    },
  trackingSteps: {
    gap: 16,
  },
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    color: 'white',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
    marginRight: 16,
  },
    stepTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    stepDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  footerSpacer: {
    height: 40,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
    modalContent: {
      backgroundColor: colors.surface,
      margin: 20,
      borderRadius: 20,
      padding: 24,
      maxHeight: '80%',
      width: '90%',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
  closeModalButton: {
    padding: 8,
  },
    closeModalText: {
      fontSize: 20,
      color: colors.textSecondary,
      fontWeight: 'bold',
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
      marginTop: 16,
    },
  required: {
    color: '#e74c3c',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
    typeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedType: {
      backgroundColor: colors.accentSoft,
    },
  typeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
    typeText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    selectedTypeText: {
      color: colors.accent,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.borderMuted,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      backgroundColor: colors.inputBackground,
      marginBottom: 8,
    },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  validationInfo: {
    marginTop: 12,
    marginBottom: 8,
  },
    validationText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.surfaceMuted,
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
    saveButton: {
      flex: 1,
      backgroundColor: colors.accent,
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
    },
    saveButtonDisabled: {
      backgroundColor: colors.borderMuted,
    },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationServices;
