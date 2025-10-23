import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  TouchableWithoutFeedback,
  View
} from 'react-native';

const SocialFeatures = () => {
  const [reviews, setReviews] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [userLevel, setUserLevel] = useState('Bronze Member');
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    dish: '',
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [helpfulReviews, setHelpfulReviews] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const popularDishes = [
    { name: 'Chicken Döner', rating: 4.8, reviews: 156, image: '🥙', orders: 342 },
    { name: 'Beef Shawarma', rating: 4.7, reviews: 142, image: '🌯', orders: 298 },
    { name: 'Falafel Plate', rating: 4.6, reviews: 98, image: '🧆', orders: 187 },
    { name: 'Baklava', rating: 4.9, reviews: 87, image: '🍯', orders: 234 },
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic)
    }).start();
  }, []);

  const loadData = async () => {
    try {
      const [savedReviews, savedPoints, savedHelpful] = await Promise.all([
        AsyncStorage.getItem('reviews'),
        AsyncStorage.getItem('loyaltyPoints'),
        AsyncStorage.getItem('helpfulReviews')
      ]);

      if (savedReviews) setReviews(JSON.parse(savedReviews));
      if (savedPoints) setLoyaltyPoints(JSON.parse(savedPoints));
      if (savedHelpful) setHelpfulReviews(JSON.parse(savedHelpful));
      
      updateUserLevel(JSON.parse(savedPoints) || 0);
    } catch (error) {
      console.log('Error loading data:', error);
      // Load sample data if no saved data
      setReviews([
        {
          id: 1,
          user: 'Ahmad K.',
          avatar: '👤',
          rating: 5,
          date: '2 days ago',
          comment: 'Amazing döner! The chicken was perfectly seasoned and the service was excellent. Definitely ordering again!',
          dish: 'Chicken Döner',
          helpful: 12,
          images: ['📷', '📷'],
        },
        {
          id: 2,
          user: 'Sara M.',
          avatar: '👤',
          rating: 4,
          date: '1 week ago',
          comment: 'Good food, but delivery took a bit longer than expected. The falafel was crispy and delicious though.',
          dish: 'Falafel Plate',
          helpful: 8,
          images: [],
        },
        {
          id: 3,
          user: 'Omar R.',
          avatar: '👤',
          rating: 5,
          date: '2 weeks ago',
          comment: 'Best shawarma in town! Fresh ingredients, great taste, and reasonable prices. Highly recommend!',
          dish: 'Beef Shawarma',
          helpful: 15,
          images: ['📷'],
        },
      ]);
      setLoyaltyPoints(245);
      updateUserLevel(245);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('reviews', JSON.stringify(reviews)),
        AsyncStorage.setItem('loyaltyPoints', JSON.stringify(loyaltyPoints)),
        AsyncStorage.setItem('helpfulReviews', JSON.stringify(helpfulReviews))
      ]);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  useEffect(() => {
    saveData();
  }, [reviews, loyaltyPoints, helpfulReviews]);

  const updateUserLevel = (points) => {
    if (points >= 500) setUserLevel('Platinum Member');
    else if (points >= 300) setUserLevel('Gold Member');
    else if (points >= 150) setUserLevel('Silver Member');
    else setUserLevel('Bronze Member');
  };

  const renderStars = (rating, size = 16, interactive = false, onPress) => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity
        key={index}
        disabled={!interactive}
        onPress={() => interactive && onPress && onPress(index + 1)}
      >
        <Text style={[styles.star, { fontSize: size }]}>
          {index < rating ? '⭐' : '☆'}
        </Text>
      </TouchableOpacity>
    ));
  };

  const shareMenu = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: 'Check out Döner Habibi! Amazing Turkish food with fresh ingredients and great service. 🥙 Download the app now!',
        title: 'Döner Habibi - Authentic Turkish Cuisine',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share menu');
    }
  };

  const shareDish = async (dish) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `Just tried the ${dish.name} at Döner Habibi - it's amazing! ${dish.rating}⭐ rating from ${dish.reviews} reviews. You should try it! 🍽️`,
        title: `Check out ${dish.name} at Döner Habibi`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share dish');
    }
  };

  const submitReview = () => {
    if (!newReview.rating || !newReview.comment || !newReview.dish) {
      Alert.alert('Error', 'Please fill in all fields and select a rating');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const review = {
      id: Date.now(),
      user: 'You',
      avatar: '😊',
      rating: newReview.rating,
      date: 'Just now',
      comment: newReview.comment,
      dish: newReview.dish,
      helpful: 0,
      images: [],
      isNew: true
    };

    setReviews(prev => [review, ...prev]);
    const newPoints = loyaltyPoints + 10;
    setLoyaltyPoints(newPoints);
    updateUserLevel(newPoints);
    
    setNewReview({ rating: 0, comment: '', dish: '' });
    
    Alert.alert('Success', 'Thank you for your review! You earned 10 loyalty points. 🎉');
  };

  const markHelpful = (reviewId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));

    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: prev[reviewId] ? review.helpful - 1 : review.helpful + 1 }
        : review
    ));
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Bronze Member': return '#CD7F32';
      case 'Silver Member': return '#C0C0C0';
      case 'Gold Member': return '#FFD700';
      case 'Platinum Member': return '#E5E4E2';
      default: return '#666';
    }
  };

  const getLevelBenefits = (level) => {
    switch (level) {
      case 'Bronze Member': return ['5% off all orders', 'Priority support'];
      case 'Silver Member': return ['10% off all orders', 'Free delivery', 'Early access to new items'];
      case 'Gold Member': return ['15% off all orders', 'Free delivery', 'Exclusive offers', 'Birthday gift'];
      case 'Platinum Member': return ['20% off all orders', 'Free delivery always', 'VIP support', 'Monthly free item'];
      default: return [];
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={styles.loadingText}>Loading community features...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView 
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Community & Reviews</Text>
              <Text style={styles.subtitle}>Share your experience and earn rewards</Text>
            </View>
            <TouchableOpacity style={styles.shareButton} onPress={shareMenu}>
              <Text style={styles.shareButtonText}>📤 Share</Text>
            </TouchableOpacity>
          </View>

          {/* Loyalty Program */}
          <View style={styles.section}>
            <View style={styles.loyaltyCard}>
              <View style={styles.loyaltyHeader}>
                <Text style={styles.loyaltyTitle}>🏆 Loyalty Program</Text>
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(userLevel) }]}>
                  <Text style={styles.levelText}>{userLevel}</Text>
                </View>
              </View>
              
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsLabel}>Your Points</Text>
                <Text style={styles.pointsValue}>{loyaltyPoints} pts</Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(loyaltyPoints % 500)}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {500 - (loyaltyPoints % 500)} points to {userLevel === 'Platinum Member' ? 'maintain' : 'next level'}
                </Text>
              </View>

              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Your Benefits:</Text>
                {getLevelBenefits(userLevel).map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✓</Text>
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.rewardsContainer}>
                <Text style={styles.rewardsTitle}>Available Rewards:</Text>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>🎁</Text>
                  <Text style={styles.rewardText}>100 pts = Free Drink</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>🎁</Text>
                  <Text style={styles.rewardText}>200 pts = 15% Off Next Order</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>🎁</Text>
                  <Text style={styles.rewardText}>500 pts = Free Döner + VIP Status</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Popular Dishes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Most Popular Dishes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.popularDishesContainer}>
                {popularDishes.map((dish, index) => (
                  <View key={index} style={styles.popularDishCard}>
                    <Text style={styles.dishEmoji}>{dish.image}</Text>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <View style={styles.dishStats}>
                      <Text style={styles.dishRating}>⭐ {dish.rating}</Text>
                      <Text style={styles.dishReviews}>({dish.reviews})</Text>
                    </View>
                    <Text style={styles.dishOrders}>📦 {dish.orders} orders</Text>
                    <TouchableOpacity
                      style={styles.shareDishButton}
                      onPress={() => shareDish(dish)}
                    >
                      <Text style={styles.shareDishText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Write a Review */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✍️ Write a Review</Text>
            <View style={styles.reviewForm}>
              <Text style={styles.inputLabel}>Which dish did you try? *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Chicken Döner, Baklava..."
                value={newReview.dish}
                onChangeText={(text) => setNewReview({...newReview, dish: text})}
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <Text style={styles.inputLabel}>Your Rating *</Text>
              <View style={styles.starContainer}>
                {renderStars(newReview.rating, 28, true, (rating) => 
                  setNewReview({...newReview, rating})
                )}
                <Text style={styles.ratingLabel}>
                  {newReview.rating > 0 ? `${newReview.rating} star${newReview.rating > 1 ? 's' : ''}` : 'Tap stars to rate'}
                </Text>
              </View>

              <Text style={styles.inputLabel}>Your Review *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share your experience... (Minimum 10 characters)"
                value={newReview.comment}
                onChangeText={(text) => setNewReview({...newReview, comment: text})}
                multiline
                numberOfLines={4}
                maxLength={500}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={true}
              />
              <Text style={styles.charCount}>
                {newReview.comment.length}/500 characters
              </Text>

              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!newReview.rating || !newReview.comment || !newReview.dish || newReview.comment.length < 10) && styles.submitButtonDisabled
                ]} 
                onPress={submitReview}
                disabled={!newReview.rating || !newReview.comment || !newReview.dish || newReview.comment.length < 10}
              >
                <Text style={styles.submitButtonText}>
                  Submit Review {newReview.rating ? `(${newReview.rating}⭐)` : ''} +10 pts
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Customer Reviews */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <View>
                <Text style={styles.sectionTitle}>💬 Customer Reviews</Text>
                <Text style={styles.reviewSubtitle}>What our customers are saying</Text>
              </View>
              <View style={styles.reviewStats}>
                <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
                <Text style={styles.averageRating}>⭐ 4.7 average</Text>
              </View>
            </View>

            {reviews.map((review, index) => (
              <View 
                key={review.id} 
                style={[
                  styles.reviewCard,
                  review.isNew && styles.newReviewCard
                ]}
              >
                <View style={styles.reviewHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.avatar}>{review.avatar}</Text>
                    <View>
                      <Text style={styles.userName}>{review.user}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    {review.isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.dishTag}>
                    <Text style={styles.dishTagText}>{review.dish}</Text>
                  </View>
                </View>

                <View style={styles.reviewRating}>
                  {renderStars(review.rating)}
                  <Text style={styles.ratingText}>{review.rating}.0</Text>
                </View>

                <Text style={styles.reviewComment}>{review.comment}</Text>

                {review.images.length > 0 && (
                  <View style={styles.reviewImages}>
                    {review.images.map((img, imgIndex) => (
                      <View key={imgIndex} style={styles.reviewImage}>
                        <Text style={styles.imageIcon}>{img}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.reviewFooter}>
                  <TouchableOpacity 
                    style={styles.helpfulButton}
                    onPress={() => markHelpful(review.id)}
                  >
                    <Text style={[
                      styles.helpfulIcon,
                      helpfulReviews[review.id] && styles.helpfulIconActive
                    ]}>
                      {helpfulReviews[review.id] ? '👍' : '👍'}
                    </Text>
                    <Text style={styles.helpfulText}>
                      Helpful ({review.helpful})
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.reviewActions}>
                    <Text style={styles.reviewActionText}>Reply</Text>
                    <Text style={styles.reviewActionSeparator}>•</Text>
                    <Text style={styles.reviewActionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Social Media Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📱 Follow Us & Stay Updated</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📘</Text>
                <Text style={styles.socialText}>Facebook</Text>
                <Text style={styles.socialStats}>2.5K followers</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📷</Text>
                <Text style={styles.socialText}>Instagram</Text>
                <Text style={styles.socialStats}>5.2K followers</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>🐦</Text>
                <Text style={styles.socialText}>Twitter</Text>
                <Text style={styles.socialStats}>1.8K followers</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.newsletter}>
              <Text style={styles.newsletterTitle}>📧 Join Our Newsletter</Text>
              <Text style={styles.newsletterText}>
                Get exclusive deals, new menu updates, and special offers delivered to your inbox.
              </Text>
              <TouchableOpacity style={styles.newsletterButton}>
                <Text style={styles.newsletterButtonText}>Subscribe Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Spacer */}
          <View style={styles.footerSpacer} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

// Add useRef import at the top

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff4e6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff4e6',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffcc80',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7d2e14',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#7d2e14',
    opacity: 0.8,
  },
  shareButton: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    margin: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },

  // Loyalty Program Styles
  loyaltyCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  loyaltyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  levelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e67e22',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  benefitsContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginRight: 12,
    fontSize: 16,
  },
  benefitText: {
    fontSize: 14,
    color: '#333',
  },
  rewardsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#fff8f0',
    borderRadius: 8,
  },
  rewardIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  rewardText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  // Popular Dishes Styles
  popularDishesContainer: {
    flexDirection: 'row',
  },
  popularDishCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dishEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  dishName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  dishStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dishRating: {
    fontSize: 12,
    color: '#e67e22',
    fontWeight: '600',
    marginRight: 4,
  },
  dishReviews: {
    fontSize: 12,
    color: '#666',
  },
  dishOrders: {
    fontSize: 11,
    color: '#666',
    marginBottom: 12,
  },
  shareDishButton: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  shareDishText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  // Review Form Styles
  reviewForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#e67e22',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Reviews Styles
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reviewSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  reviewStats: {
    alignItems: 'flex-end',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  averageRating: {
    fontSize: 14,
    color: '#e67e22',
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newReviewCard: {
    borderWidth: 2,
    borderColor: '#e67e22',
    backgroundColor: '#fff8f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    fontSize: 24,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  newBadge: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dishTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e67e22',
  },
  dishTagText: {
    fontSize: 12,
    color: '#e67e22',
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '600',
  },
  reviewComment: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewImages: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  imageIcon: {
    fontSize: 24,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  helpfulIconActive: {
    color: '#e67e22',
  },
  helpfulText: {
    fontSize: 14,
    color: '#666',
  },
  reviewActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewActionText: {
    fontSize: 14,
    color: '#666',
  },
  reviewActionSeparator: {
    fontSize: 14,
    color: '#ccc',
    marginHorizontal: 8,
  },

  // Social Media Styles
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  socialIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  socialText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  socialStats: {
    fontSize: 12,
    color: '#666',
  },
  newsletter: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsletterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  newsletterText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  newsletterButton: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  newsletterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footerSpacer: {
    height: 40,
  },
  star: {
    marginRight: 4,
  },
});

export default SocialFeatures;