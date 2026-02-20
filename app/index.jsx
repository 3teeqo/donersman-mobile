import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, Redirect } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ThemeToggle from '../components/ThemeToggle';
import { useAppTheme } from '../contexts/AppThemeContext';
import { useAuth } from '../contexts/AuthContext';

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
    accent: '#f97316',
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
const BUSINESS_PHONE = '+970 599 000 000';
const BUSINESS_ADDRESS = 'Al-Sa\'a Roundabout, Ramallah';

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    imageBackground: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.heroOverlay,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 48,
      gap: 20,
    },
    heroCard: {
      backgroundColor: colors.heroBackground,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: 0.18,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 20,
      elevation: 8,
      gap: 18,
    },
    heroTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    greeting: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
    currentTime: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 4,
      marginBottom: 12,
    },
    headline: {
      color: colors.textPrimary,
      fontSize: 24,
      fontWeight: '700',
    },
    subHeadline: {
      color: colors.textSecondary,
      fontSize: 16,
      marginTop: 8,
      lineHeight: 22,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
      gap: 10,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accentSoft,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      gap: 6,
    },
    chipLabel: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '600',
    },
    sectionBlock: {
      gap: 16,
    },
    sectionHeader: {
      gap: 4,
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
      backgroundColor: colors.heroOverlay,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      alignSelf: 'flex-start',
    },
    sectionSubtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      backgroundColor: colors.heroOverlay,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      alignSelf: 'flex-start',
    },
    actionSurface: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.borderMuted,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
      gap: 12,
    },
    actionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceAlt,
      borderRadius: 18,
      paddingHorizontal: 18,
      paddingVertical: 16,
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.borderMuted,
    },
    actionCardPressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.92,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
      backgroundColor: colors.accentSoft,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    actionSubtitleText: {
      color: colors.textSecondary,
      fontSize: 13,
      marginTop: 4,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.borderMuted,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
      gap: 18,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderMuted,
    },
    infoCopy: {
      flex: 1,
      gap: 4,
    },
    infoLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.4,
    },
    infoValue: {
      color: colors.textPrimary,
      fontSize: 15,
    },
    infoCta: {
      marginTop: 6,
      backgroundColor: colors.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 16,
      paddingVertical: 14,
    },
    infoCtaPressed: {
      opacity: 0.9,
    },
    infoCtaText: {
      color: colors.accentText,
      fontSize: 15,
      fontWeight: '600',
    },
    heroHeaderActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  });

const HomeScreen = () => {
  const { user, role, loading } = useAuth();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [currentTime, setCurrentTime] = useState('');
  const [redirectTo, setRedirectTo] = useState(null);

  // Stable redirect without changing hooks order between renders
  useEffect(() => {
    if (loading) return;
    if (!user) setRedirectTo('/auth/login');
    else if (role === 'driver') setRedirectTo('/driver/dashboard');
    else if (role === 'owner') setRedirectTo('/owner/dashboard');
    else setRedirectTo(null);
  }, [loading, user, role]);

  if (redirectTo) {
    return <Redirect href={redirectTo} />;
  }

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
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.currentTime}>{currentTime}</Text>
                <Text style={styles.headline}>Welcome to DönersMan</Text>
                <Text style={styles.subHeadline}>
                  Authentic Turkish street flavors, prepared fresh all day.
                </Text>
              </View>
              <View style={styles.heroHeaderActions}>
                <ThemeToggle />
              </View>
            </View>

            <View style={styles.chipRow}>
              {HIGHLIGHT_CHIPS.map((chip) => (
                <View key={chip.id} style={styles.chip}>
                  <Ionicons name={chip.icon} size={16} color={colors.accent} />
                  <Text style={styles.chipLabel}>{chip.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick actions</Text>
              <Text style={styles.sectionSubtitle}>Pick up right where you left off</Text>
            </View>

            <View style={styles.actionSurface}>
              {ACTION_CARDS.map((card) => (
                <Link key={card.id} href={card.href} asChild>
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionCard,
                      { borderLeftWidth: 4, borderLeftColor: card.accent },
                      pressed && styles.actionCardPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.iconWrap,
                        { backgroundColor: `${card.accent}20` },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={card.icon}
                        size={24}
                        color={card.accent}
                      />
                    </View>
                    <View style={styles.actionContent}>
                      <Text style={styles.actionTitle}>{card.title}</Text>
                      <Text style={styles.actionSubtitleText}>{card.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Plan your visit</Text>
              <Text style={styles.sectionSubtitle}>Need a hand? We are ready</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={22} color={colors.accent} />
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
              {/* Removed contact center CTA as requested */}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
