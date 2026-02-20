import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Keyboard,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme } from '../contexts/AppThemeContext';

const SAMPLE_REVIEWS = [
  {
    id: 1,
    user: 'Ahmad K.',
    rating: 5,
    date: '2 days ago',
    comment:
      'Amazing doner! The chicken was perfectly seasoned and the service was excellent. Definitely ordering again!',
    dish: 'Chicken Doner',
    helpful: 12,
    images: [],
  },
  {
    id: 2,
    user: 'Sara M.',
    rating: 4,
    date: '1 week ago',
    comment:
      'Good food, but delivery took a bit longer than expected. The falafel was crispy and delicious though.',
    dish: 'Falafel Plate',
    helpful: 8,
    images: [],
  },
  {
    id: 3,
    user: 'Omar R.',
    rating: 5,
    date: '2 weeks ago',
    comment:
      'Best shawarma in town! Fresh ingredients, great taste, and reasonable prices. Highly recommend! ',
    dish: 'Beef Shawarma',
    helpful: 15,
    images: [],
  },
];

const POPULAR_DISHES = [
  { name: 'Chicken Doner', rating: 4.8, reviews: 156, orders: 342 },
  { name: 'Beef Shawarma', rating: 4.7, reviews: 142, orders: 298 },
  { name: 'Falafel Plate', rating: 4.6, reviews: 98, orders: 187 },
  { name: 'Baklava', rating: 4.9, reviews: 87, orders: 234 },
];

const STORAGE_KEYS = {
  reviews: 'reviews',
  points: 'loyaltyPoints',
  helpful: 'helpfulReviews',
};

const createStyles = (colors, isDark) =>
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
      color: colors.textSecondary,
      fontSize: 16,
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
      gap: 14,
      shadowColor: colors.shadow,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      elevation: 10,
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
    content: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 120,
      gap: 20,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      elevation: 8,
      gap: 16,
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
    },
    // Loyalty
    loyaltyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    levelBadge: {
      backgroundColor: colors.accent,
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    levelText: { color: colors.accentText, fontSize: 12, fontWeight: '700' },
    pointsRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
    pointsLabel: { color: colors.textSecondary, fontSize: 13 },
    pointsValue: { color: colors.textPrimary, fontSize: 28, fontWeight: '700' },
    progressBar: {
      height: 10,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 6,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.accent,
    },
    progressText: { color: colors.textSecondary, fontSize: 12 },
    benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    benefitText: { color: colors.textSecondary, fontSize: 13 },
    // Popular dishes
    popularRow: { flexDirection: 'row' },
    popularCard: {
      backgroundColor: colors.surfaceAlt,
      width: 160,
      borderRadius: 18,
      padding: 14,
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
      alignItems: 'flex-start',
    },
    dishName: { color: colors.textPrimary, fontWeight: '600' },
    dishMetaRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    dishMeta: { color: colors.textSecondary, fontSize: 12 },
    shareDishButton: {
      marginTop: 6,
      backgroundColor: colors.accent,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    shareDishText: { color: colors.accentText, fontWeight: '700', fontSize: 12 },
    // Review form
    fieldLabel: {
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
    textArea: { height: 100, textAlignVertical: 'top' },
    starRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    starHint: { color: colors.textSecondary, fontSize: 12 },
    submitButton: {
      backgroundColor: colors.accent,
      borderRadius: 16,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    submitButtonDisabled: { opacity: 0.4 },
    submitButtonText: { color: colors.accentText, fontWeight: '700' },
    // Reviews list
    reviewItem: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceAlt,
      padding: 14,
      gap: 10,
    },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    reviewUser: { color: colors.textPrimary, fontWeight: '600' },
    reviewDate: { color: colors.textSecondary, fontSize: 12 },
    reviewComment: { color: colors.textPrimary, fontSize: 14, lineHeight: 20 },
    helpfulRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    helpfulBtn: {
      flexDirection: 'row', gap: 8, alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    helpfulText: { color: colors.textSecondary, fontWeight: '600' },
    // Misc
    headerActions: { flexDirection: 'row', justifyContent: 'flex-end' },
    shareButton: { backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
    shareButtonText: { color: colors.accentText, fontWeight: '700' },
  });

export default function SocialFeatures() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const [reviews, setReviews] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [userLevel, setUserLevel] = useState('Bronze Member');
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', dish: '' });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [helpfulReviews, setHelpfulReviews] = useState({});

  useEffect(() => {
    const run = async () => {
      try {
        const [savedReviews, savedPoints, savedHelpful] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.reviews),
          AsyncStorage.getItem(STORAGE_KEYS.points),
          AsyncStorage.getItem(STORAGE_KEYS.helpful),
        ]);

        const r = savedReviews ? JSON.parse(savedReviews) : SAMPLE_REVIEWS;
        const pts = savedPoints ? JSON.parse(savedPoints) : 245;
        const h = savedHelpful ? JSON.parse(savedHelpful) : {};
        setReviews(r);
        setLoyaltyPoints(pts);
        setHelpfulReviews(h);
        updateUserLevel(pts);
      } finally {
        setLoading(false);
      }
    };
    run();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);

  useEffect(() => {
    AsyncStorage.multiSet([
      [STORAGE_KEYS.reviews, JSON.stringify(reviews)],
      [STORAGE_KEYS.points, JSON.stringify(loyaltyPoints)],
      [STORAGE_KEYS.helpful, JSON.stringify(helpfulReviews)],
    ]).catch(() => {});
  }, [reviews, loyaltyPoints, helpfulReviews]);

  const updateUserLevel = (points) => {
    if (points >= 500) setUserLevel('Platinum Member');
    else if (points >= 300) setUserLevel('Gold Member');
    else if (points >= 150) setUserLevel('Silver Member');
    else setUserLevel('Bronze Member');
  };

  const renderStars = (rating, size = 18, interactive = false, onSelect) => {
    const arr = Array.from({ length: 5 });
    return (
      <View style={styles.starRow}>
        {arr.map((_, i) => (
          <TouchableOpacity
            key={i}
            disabled={!interactive}
            onPress={() => interactive && onSelect && onSelect(i + 1)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={i < rating ? 'star' : 'star-outline'}
              size={size}
              color={i < rating ? colors.highlight : colors.iconSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const shareMenu = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message:
          'Check out Doner Habibi! Amazing Turkish food with fresh ingredients and great service. Download the app now!',
        title: 'Doner Habibi - Authentic Turkish Cuisine',
      });
    } catch (_) {
      Alert.alert('Error', 'Could not share menu');
    }
  };

  const shareDish = async (dish) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `Just tried the ${dish.name} at Doner Habibi - it's amazing! ${dish.rating}★ from ${dish.reviews} reviews. You should try it!`,
        title: `Check out ${dish.name} at Doner Habibi`,
      });
    } catch (_) {
      Alert.alert('Error', 'Could not share dish');
    }
  };

  const submitReview = () => {
    if (!newReview.rating || !newReview.comment || !newReview.dish || newReview.comment.length < 10) {
      Alert.alert('Error', 'Please fill in all fields and select a rating');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const review = {
      id: Date.now(),
      user: 'You',
      rating: newReview.rating,
      date: 'Just now',
      comment: newReview.comment,
      dish: newReview.dish,
      helpful: 0,
      images: [],
    };
    setReviews((prev) => [review, ...prev]);
    const newPts = loyaltyPoints + 10;
    setLoyaltyPoints(newPts);
    updateUserLevel(newPts);
    setNewReview({ rating: 0, comment: '', dish: '' });
    Alert.alert('Thanks!', 'Thank you for your review! You earned 10 loyalty points.');
  };

  const markHelpful = (reviewId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHelpfulReviews((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful: (helpfulReviews[reviewId] ? r.helpful - 1 : r.helpful + 1) } : r))
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading community features…</Text>
      </View>
    );
  }

  const nextLevelCap = 500; // simple cap for demo
  const progressPct = Math.min(100, Math.round((loyaltyPoints % nextLevelCap) / nextLevelCap * 100));

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }] }>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroHeader}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.heroEyebrow}>Community</Text>
              <Text style={styles.heroTitle}>Reviews & Loyalty</Text>
              <Text style={styles.heroSubtitle}>Share your experience and earn rewards</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.shareButton} onPress={shareMenu}>
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.loyaltyRow}>
            <Text style={styles.sectionTitle}>Loyalty Program</Text>
            <View style={styles.levelBadge}><Text style={styles.levelText}>{userLevel}</Text></View>
          </View>
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Your Points</Text>
            <Text style={styles.pointsValue}>{loyaltyPoints} pts</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.progressText}>{nextLevelCap - (loyaltyPoints % nextLevelCap)} points to next level</Text>
          <View>
            <Text style={styles.sectionSubtitle}>Your Benefits</Text>
            <View style={styles.benefitItem}><Ionicons name="checkmark-circle" size={16} color={colors.accent} /><Text style={styles.benefitText}>Priority support</Text></View>
            <View style={styles.benefitItem}><Ionicons name="checkmark-circle" size={16} color={colors.accent} /><Text style={styles.benefitText}>Exclusive offers</Text></View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Popular Dishes</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.popularRow}>
              {POPULAR_DISHES.map((dish) => (
                <View key={dish.name} style={styles.popularCard}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <View style={styles.dishMetaRow}>
                    {renderStars(Math.round(dish.rating), 14, false)}
                    <Text style={styles.dishMeta}>{dish.rating.toFixed(1)}</Text>
                    <Text style={styles.dishMeta}>({dish.reviews})</Text>
                  </View>
                  <Text style={styles.dishMeta}>{dish.orders} orders</Text>
                  <TouchableOpacity style={styles.shareDishButton} onPress={() => shareDish(dish)}>
                    <Text style={styles.shareDishText}>Share</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Write a Review</Text>
          </View>
          <Text style={styles.fieldLabel}>Which dish did you try? *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Chicken Doner, Baklava..."
            placeholderTextColor={colors.textSecondary}
            value={newReview.dish}
            onChangeText={(text) => setNewReview({ ...newReview, dish: text })}
            returnKeyType="next"
          />
          <Text style={styles.fieldLabel}>Your Rating *</Text>
          <View style={styles.starRow}>
            {renderStars(newReview.rating, 28, true, (rating) => setNewReview({ ...newReview, rating }))}
            <Text style={styles.starHint}>
              {newReview.rating > 0 ? `${newReview.rating} ${newReview.rating > 1 ? 'stars' : 'star'}` : 'Tap a star to rate'}
            </Text>
          </View>
          <Text style={styles.fieldLabel}>Your Review *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Share your experience... (Minimum 10 characters)"
            placeholderTextColor={colors.textSecondary}
            value={newReview.comment}
            onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
            multiline
            numberOfLines={4}
            onSubmitEditing={Keyboard.dismiss}
          />
          <TouchableOpacity
            style={[styles.submitButton, (!newReview.rating || !newReview.comment || !newReview.dish || newReview.comment.length < 10) && styles.submitButtonDisabled]}
            onPress={submitReview}
            disabled={!newReview.rating || !newReview.comment || !newReview.dish || newReview.comment.length < 10}
          >
            <Text style={styles.submitButtonText}>Submit Review +10 pts</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
          </View>
          <View style={{ gap: 12 }}>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{review.user}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                {renderStars(review.rating)}
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <View style={styles.helpfulRow}>
                  <TouchableOpacity style={styles.helpfulBtn} onPress={() => markHelpful(review.id)}>
                    <Ionicons
                      name={helpfulReviews[review.id] ? 'heart' : 'heart-outline'}
                      size={16}
                      color={helpfulReviews[review.id] ? colors.accent : colors.iconSecondary}
                    />
                    <Text style={styles.helpfulText}>Helpful ({review.helpful})</Text>
                  </TouchableOpacity>
                  <Text style={styles.sectionSubtitle}>{review.dish}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

