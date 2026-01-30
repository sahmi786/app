import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, borderRadius } from '../lib/theme';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const phoneTypes = [
  { label: 'Select phone type...', value: '' },
  { label: 'Apple (iPhone)', value: 'apple' },
  { label: 'Samsung', value: 'samsung' },
  { label: 'Huawei', value: 'huawei' },
  { label: 'Google (Pixel)', value: 'google' },
  { label: 'Other', value: 'other' },
];

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    mobile: '',
    password: '',
    email: '',
    phoneType: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return 'First name is required';
    }
    if (!formData.surname.trim()) {
      return 'Surname is required';
    }
    if (!formData.mobile.trim()) {
      return 'UAE mobile number is required';
    }
    if (!formData.password || formData.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!agreedToTerms) {
      return 'Please agree to the Terms of Service';
    }
    return null;
  };

  const handleRegister = async () => {
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const result = await register(formData);
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the Sahmi community</Text>

          <View style={styles.form}>
            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={(v) => updateField('firstName', v)}
              placeholder="Enter first name"
              required
            />
            
            <Input
              label="Surname"
              value={formData.surname}
              onChangeText={(v) => updateField('surname', v)}
              placeholder="Enter surname"
              required
            />
            
            <Input
              label="UAE Mobile Number"
              value={formData.mobile}
              onChangeText={(v) => updateField('mobile', v)}
              placeholder="+971 5X XXX XXXX"
              keyboardType="phone-pad"
              required
            />
            
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(v) => updateField('password', v)}
              placeholder="Min 8 characters"
              secureTextEntry
              required
            />
            
            <Input
              label="Email"
              value={formData.email}
              onChangeText={(v) => updateField('email', v)}
              placeholder="email@example.com (optional)"
              keyboardType="email-address"
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Phone Type (Optional)</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.phoneType}
                  onValueChange={(v) => updateField('phoneType', v)}
                  style={styles.picker}
                >
                  {phoneTypes.map((type) => (
                    <Picker.Item 
                      key={type.value} 
                      label={type.label} 
                      value={type.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity 
              style={styles.termsRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the Terms of Service and Privacy Policy
              </Text>
            </TouchableOpacity>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button 
              title="Create Account" 
              onPress={handleRegister}
              loading={loading}
            />

            <View style={styles.loginLink}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkText}>Login</Text>
              </TouchableOpacity>
            </View>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  pickerContainer: {
    marginBottom: spacing.md,
  },
  pickerWrapper: {
    backgroundColor: colors.input.background,
    borderWidth: 1.5,
    borderColor: colors.input.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  loginText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  loginLinkText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;
