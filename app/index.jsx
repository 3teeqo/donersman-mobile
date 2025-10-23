import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const HIGHLIGHT_CHIPS = [
  { id: 'delivery', icon: 'fast-food-outline', label: 'Fast delivery across Ramallah' },
  { id: 'rating', icon: 'star-outline', label: '4.8 community rating' },
  { id: 'loyalty', icon: 'ribbon-outline', label: 'Loyalty rewards ready' },
];

const ACTION_CARDS = [
  {
    id: 'orders',
    title: 'Order Now',
    subtitle: 'Build your favorite plate or sandwich',
    href: '/orders',
    icon: 'food-variant',
    accent: '#f15a29',
  },
  {
    id: 'location',
    title: 'Delivery Addresses',
    subtitle: 'Manage saved drop off spots',
    href: '/location',
    icon: 'map-marker-radius',
    accent: '#1f7a8c',
  },
  {
    id: 'social',
    title: 'Reviews and Loyalty',
    subtitle: 'See community love and perks',
    href: '/social',
    icon: 'account-group',
    accent: '#6b4eff',
  },
  {
    id: 'contacts',
    title: 'Contact Us',
    subtitle: 'We are one tap away',
    href: '/contacts',
    icon: 'phone-in-talk',
    accent: '#0f9d58',
  },
];

const BUSINESS_HOURS = '10:00 AM - 11:00 PM';
const BUSINESS_PHONE = '+970 599 324 988';
const BUSINESS_ADDRESS = 'Doner Street 5, Stephen Platz, Vienna City';

const HomeScreen = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      setCurrentTime(`${displayHours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Habibi!';
    if (hour < 18) return 'Good afternoon, Habibi!';
    return 'Good evening, Habibi!';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/images/Doner1.png')}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.currentTime}>{currentTime}</Text>
            <Text style={styles.headline}>Welcome to Doner Habibi</Text>
            <Text style={styles.subHeadline}>
              Authentic Turkish street flavors, prepared fresh all day.
            </Text>
            <View style={styles.chipRow}>
              {HIGHLIGHT_CHIPS.map((chip) => (
                <View key={chip.id} style={styles.chip}>
                  <Ionicons name={chip.icon} size={16} color="#f15a29" />
                  <Text style={styles.chipLabel}>{chip.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick actions</Text>
                <Text style={styles.sectionSubtitle}>Pick up right where you left off</Text>
              </View>

              <View style={styles.actionList}>
                {ACTION_CARDS.map((card) => (
                  <Link key={card.id} href={card.href} asChild>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionCard,
                        { borderLeftColor: card.accent },
                        pressed && styles.actionCardPressed,
                      ]}
                    >
                      <View style={[styles.iconWrap, { backgroundColor: `${card.accent}1a` }]}>
                        <MaterialCommunityIcons name={card.icon} size={24} color={card.accent} />
                      </View>
                      <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>{card.title}</Text>
                        <Text style={styles.actionSubtitleText}>{card.subtitle}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#a1a1a1" />
                    </Pressable>
                  </Link>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <View style={[styles.sectionContainer, styles.sectionContainerDense]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Plan your visit</Text>
                <Text style={styles.sectionSubtitle}>Need a hand? We are ready</Text>
              </View>

              <View>
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={22} color="#f15a29" />
                  <View style={styles.infoCopy}>
                    <Text style={styles.infoLabel}>Today</Text>
                    <Text style={styles.infoValue}>{BUSINESS_HOURS}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={22} color="#1f7a8c" />
                  <View style={styles.infoCopy}>
                    <Text style={styles.infoLabel}>Call us</Text>
                    <Text style={styles.infoValue}>{BUSINESS_PHONE}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={22} color="#6b4eff" />
                  <View style={styles.infoCopy}>
                    <Text style={styles.infoLabel}>Visit</Text>
                    <Text style={styles.infoValue}>{BUSINESS_ADDRESS}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageBackground: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2b2b2b',
  },
  currentTime: {
    fontSize: 14,
    color: '#6d6d6d',
    marginTop: 4,
    marginBottom: 12,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
  },
  subHeadline: {
    fontSize: 16,
    color: '#4d4d4d',
    marginTop: 8,
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 18,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff4ef',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  chipLabel: {
    marginLeft: 6,
    fontSize: 12,
    color: '#4d4d4d',
    fontWeight: '600',
  },
  sectionBlock: {
    marginTop: 32,
  },
  sectionContainer: {
    backgroundColor: 'rgba(255, 240, 228, 0.96)',
    borderRadius: 28,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  sectionContainerDense: {
    paddingBottom: 28,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#b24f1b',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8a6a55',
    marginTop: 4,
  },
  actionList: {
    marginTop: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  actionCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202020',
  },
  actionSubtitleText: {
    fontSize: 13,
    color: '#6a6a6a',
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  infoCopy: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#707070',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 15,
    color: '#2b2b2b',
    marginTop: 4,
  },
});
