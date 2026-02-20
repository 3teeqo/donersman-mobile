import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppTheme } from '../contexts/AppThemeContext';

const Contacts = () => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [copiedText, setCopiedText] = useState('');

  useState(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })
    ]).start();
  }, []);

  const contactInfo = {
    phone: '+970 599000000',
    email: 'donersman@example.com',
    address: 'Al-Sa\'a Roundabout, Ramallah',
    hours: {
      weekdays: '10:00 AM - 11:00 PM',
      weekends: '10:00 AM - 12:00 AM'
    },
    social: {
      facebook: 'DönersMan',
      instagram: '@donersman',
      twitter: '@DonersMan'
    }
  };

  const handlePhonePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Linking.openURL(`tel:${contactInfo.phone}`);
    } catch (error) {
      Alert.alert('Error', 'Could not make phone call');
    }
  };

  const handleEmailPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Linking.openURL(`mailto:${contactInfo.email}`);
    } catch (error) {
      Alert.alert('Error', 'Could not open email app');
    }
  };

  const handleAddressPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const url = `https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`;
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open maps');
    }
  };

  const copyToClipboard = async (text, label) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  const handleSocialPress = (platform) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      `${platform}`,
      `Follow us on ${platform}: ${contactInfo.social[platform.toLowerCase()]}`,
      [
        { text: 'Copy', onPress: () => copyToClipboard(contactInfo.social[platform.toLowerCase()], platform) },
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  const ContactItem = ({ icon, title, value, onPress, copyValue, showCopy = true }) => (
    <TouchableOpacity style={styles.contactItem} onPress={onPress}>
      <Text style={styles.contactIcon}>{icon}</Text>
      <View style={styles.contactDetails}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
      {showCopy && (
        <TouchableOpacity 
          style={styles.copyButton}
          onPress={() => copyToClipboard(copyValue || value, title)}
        >
          <Text style={styles.copyIcon}>📋</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contact Us</Text>
          <Text style={styles.headerSubtitle}>We're here to help you!</Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Get In Touch</Text>
          
          <ContactItem
            icon="📞"
            title="Phone Number"
            value={contactInfo.phone}
            onPress={handlePhonePress}
            copyValue={contactInfo.phone.replace(/\s/g, '')}
          />
          
          <ContactItem
            icon="📧"
            title="Email Address"
            value={contactInfo.email}
            onPress={handleEmailPress}
          />
          
          <ContactItem
            icon="📍"
            title="Restaurant Address"
            value={contactInfo.address}
            onPress={handleAddressPress}
          />
        </View>

        {/* Business Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕒 Opening Hours</Text>
          <View style={styles.hoursCard}>
            <View style={styles.hourItem}>
              <Text style={styles.hourDays}>Monday - Friday</Text>
              <Text style={styles.hourTime}>{contactInfo.hours.weekdays}</Text>
            </View>
            <View style={styles.hourSeparator} />
            <View style={styles.hourItem}>
              <Text style={styles.hourDays}>Saturday - Sunday</Text>
              <Text style={styles.hourTime}>{contactInfo.hours.weekends}</Text>
            </View>
          </View>
          <Text style={styles.hoursNote}>
            💡 We accept orders until 30 minutes before closing
          </Text>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 Follow Us</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('Facebook')}
            >
              <Text style={styles.socialIcon}>📘</Text>
              <Text style={styles.socialText}>Facebook</Text>
              <Text style={styles.socialHandle}>{contactInfo.social.facebook}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('Instagram')}
            >
              <Text style={styles.socialIcon}>📷</Text>
              <Text style={styles.socialText}>Instagram</Text>
              <Text style={styles.socialHandle}>{contactInfo.social.instagram}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('Twitter "X"') }
            >
              <Text style={styles.socialIcon}>🐦</Text>
              <Text style={styles.socialText}>Twitter "X" </Text>
              <Text style={styles.socialHandle}>{contactInfo.social.twitter}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>What are your delivery areas?</Text>
              <Text style={styles.faqAnswer}>
                We deliver throughout Ramallah and surrounding areas. Delivery fee may vary by location.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Do you offer catering?</Text>
              <Text style={styles.faqAnswer}>
                Yes! We offer catering for events and parties. Contact us for custom orders.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Can I modify my order?</Text>
              <Text style={styles.faqAnswer}>
                Order modifications are possible before we start preparation. Call us immediately after ordering.
              </Text>
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Need Immediate Help?</Text>
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyIcon}>⚠️</Text>
            <Text style={styles.emergencyTitle}>Urgent Support</Text>
            <Text style={styles.emergencyText}>
              For order issues, delivery problems, or urgent matters, call us directly at:
            </Text>
            <TouchableOpacity 
              style={styles.emergencyButton}
              onPress={handlePhonePress}
            >
              <Text style={styles.emergencyButtonText}>Call {contactInfo.phone}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Your Feedback Matters</Text>
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>
              We're constantly working to improve our service. Your feedback helps us serve you better!
            </Text>
            <TouchableOpacity 
              style={styles.feedbackButton}
              onPress={handleEmailPress}
            >
              <Text style={styles.feedbackButtonText}>Send Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Copied Indicator */}
      {copiedText && (
        <View style={styles.copiedIndicator}>
          <Text style={styles.copiedText}>✓ {copiedText} copied</Text>
        </View>
      )}
    </Animated.View>
  )
  }
  
const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  scrollView: {
    flex: 1,
  },
    header: {
      padding: 24,
      paddingTop: 80,
      backgroundColor: colors.heroBackground,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
  section: {
    margin: 20,
    marginTop: 24,
  },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  contactDetails: {
    flex: 1,
  },
    contactTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    contactValue: {
      fontSize: 16,
      color: colors.textSecondary,
    },
  copyButton: {
    padding: 8,
  },
    copyIcon: {
      fontSize: 18,
      color: colors.textSecondary,
    },
    hoursCard: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
    hourDays: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    hourTime: {
      fontSize: 16,
      color: colors.accent,
      fontWeight: '600',
    },
    hourSeparator: {
      height: 1,
      backgroundColor: colors.borderMuted,
      marginVertical: 12,
    },
    hoursNote: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 12,
      fontStyle: 'italic',
    },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
    socialButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: 16,
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
    fontSize: 24,
    marginBottom: 8,
  },
    socialText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    socialHandle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    faqContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    faqItem: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderMuted,
    },
    faqQuestion: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    faqAnswer: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    emergencyCard: {
      backgroundColor: colors.accentSoft,
      padding: 20,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.accent,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  emergencyIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
    emergencyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    emergencyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
    },
    emergencyButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    emergencyButtonText: {
      color: colors.accentText,
      fontSize: 16,
      fontWeight: 'bold',
    },
    feedbackCard: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    feedbackText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
    },
    feedbackButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    feedbackButtonText: {
      color: colors.accentText,
      fontSize: 16,
      fontWeight: '600',
    },
  footerSpacer: {
    height: 40,
  },
    copiedIndicator: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    copiedText: {
      color: colors.accentText,
      fontSize: 14,
      fontWeight: '600',
    },
})

export default Contacts
