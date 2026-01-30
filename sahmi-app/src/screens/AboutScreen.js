import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../lib/theme';

const AboutScreen = () => {
  const openWebsite = () => {
    Linking.openURL('https://mercury-networks.com');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>About Mercury</Text>

        {/* Hero Banner */}
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroBanner}
        >
          <Text style={styles.heroText}>MERCURY</Text>
          <Text style={styles.heroSubtext}>NETWORKS</Text>
        </LinearGradient>

        {/* Content Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who We Are</Text>
          <Text style={styles.sectionText}>
            Mercury Networks is a leading technology solutions provider, delivering 
            innovative services across the Middle East and beyond. With a focus on 
            excellence and customer satisfaction, we partner with businesses to drive 
            their digital transformation journey.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            To empower businesses with cutting-edge technology solutions that drive 
            growth, efficiency, and competitive advantage in an increasingly digital world.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesList}>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceBullet}>•</Text>
              <Text style={styles.serviceText}>Enterprise Solutions</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceBullet}>•</Text>
              <Text style={styles.serviceText}>Cloud Infrastructure</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceBullet}>•</Text>
              <Text style={styles.serviceText}>Digital Transformation</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceBullet}>•</Text>
              <Text style={styles.serviceText}>Managed Services</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceBullet}>•</Text>
              <Text style={styles.serviceText}>Consulting & Advisory</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>📍 Dubai, United Arab Emirates</Text>
            <TouchableOpacity onPress={openWebsite}>
              <Text style={[styles.contactItem, styles.link]}>
                🌐 mercury-networks.com
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Sahmi</Text>
          <Text style={styles.sectionText}>
            Sahmi (سهمي) is Mercury's mobile engagement platform, designed to keep 
            our community connected. The name means "my share" in Arabic, reflecting 
            our commitment to shared success and partnership.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  heroBanner: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heroText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 4,
  },
  heroSubtext: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    letterSpacing: 6,
    marginTop: 4,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  sectionText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  servicesList: {
    marginTop: spacing.sm,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  serviceBullet: {
    fontSize: 16,
    color: colors.secondary,
    marginRight: spacing.sm,
    fontWeight: 'bold',
  },
  serviceText: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  contactInfo: {
    marginTop: spacing.sm,
  },
  contactItem: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  link: {
    color: colors.secondary,
  },
});

export default AboutScreen;
