import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, defaultClocks } from '../lib/theme';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import WorldClocks from '../components/WorldClocks';

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    
    if (!mobile || !password) {
      setError('Please enter mobile number and password');
      return;
    }

    setLoading(true);
    const result = await login(mobile, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/sahmi-logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Your gateway to Mercury</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <Input
              label="UAE Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              placeholder="+971 5X XXX XXXX"
              keyboardType="phone-pad"
            />
            
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button 
              title="Login" 
              onPress={handleLogin}
              loading={loading}
            />

            <View style={styles.registerLink}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLinkText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* World Clocks */}
          <View style={styles.clocksSection}>
            <Text style={styles.clocksTitle}>— World Clocks —</Text>
            <WorldClocks clocks={defaultClocks} compact />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  logo: {
    width: 220,
    height: 80,
  },
  tagline: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  form: {
    marginBottom: spacing.xl,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  registerText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  registerLinkText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  clocksSection: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
  },
  clocksTitle: {
    textAlign: 'center',
    color: colors.text.muted,
    fontSize: 12,
    marginBottom: spacing.md,
  },
});

export default LoginScreen;
