import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, defaultClocks } from '../lib/theme';
import { useAuth } from '../contexts/AuthContext';
import WorldClocks from '../components/WorldClocks';
import Button from '../components/Button';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userClocks = user?.clocks || defaultClocks;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <Text style={styles.welcome}>Welcome, {user?.firstName || 'User'}! 👋</Text>
        <Text style={styles.greeting}>{getGreeting()}</Text>

        {/* World Clocks Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>World Clocks</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditClocks')}>
              <Text style={styles.editButton}>✏️ Edit</Text>
            </TouchableOpacity>
          </View>
          <WorldClocks clocks={userClocks} />
        </View>

        {/* Quick Links Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Links</Text>
          <View style={styles.quickLinks}>
            <TouchableOpacity 
              style={styles.quickLink}
              onPress={() => navigation.navigate('About')}
            >
              <Text style={styles.quickLinkIcon}>ℹ️</Text>
              <Text style={styles.quickLinkText}>About</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickLink}
              onPress={() => navigation.navigate('Contact')}
            >
              <Text style={styles.quickLinkIcon}>✉️</Text>
              <Text style={styles.quickLinkText}>Contact</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickLink}>
              <Text style={styles.quickLinkIcon}>⚙️</Text>
              <Text style={styles.quickLinkText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Profile</Text>
          <View style={styles.profileInfo}>
            <Text style={styles.profileLabel}>Name</Text>
            <Text style={styles.profileValue}>
              {user?.firstName} {user?.surname}
            </Text>
            
            <Text style={styles.profileLabel}>Mobile</Text>
            <Text style={styles.profileValue}>{user?.mobile}</Text>
            
            {user?.email && (
              <>
                <Text style={styles.profileLabel}>Email</Text>
                <Text style={styles.profileValue}>{user?.email}</Text>
              </>
            )}
          </View>
        </View>

        {/* Logout Button */}
        <Button 
          title="Logout" 
          variant="secondary"
          onPress={logout}
          style={styles.logoutButton}
        />
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
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  editButton: {
    fontSize: 13,
    color: colors.secondary,
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  quickLink: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginHorizontal: 4,
  },
  quickLinkIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  quickLinkText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  profileInfo: {
    marginTop: spacing.sm,
  },
  profileLabel: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 2,
  },
  profileValue: {
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.md,
  },
});

export default DashboardScreen;
