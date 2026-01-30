import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../lib/theme';
import Input from '../components/Input';
import Button from '../components/Button';

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.email.trim()) return 'Please enter your email';
    if (!formData.email.includes('@')) return 'Please enter a valid email';
    if (!formData.subject.trim()) return 'Please enter a subject';
    if (!formData.message.trim()) return 'Please enter a message';
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    
    // Simulate API call - in production, this would send to your backend
    // which would then email to me@gshah.co.uk
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For POC, we'll just show success
      // In production, this would be an actual API call:
      // await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   body: JSON.stringify({ ...formData, to: 'me@gshah.co.uk' })
      // });
      
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Message Sent!</Text>
          <Text style={styles.successText}>
            Thank you for contacting us. We'll get back to you as soon as possible.
          </Text>
          <Button 
            title="Send Another Message" 
            variant="secondary"
            onPress={resetForm}
            style={styles.anotherButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>We'd love to hear from you</Text>

          <View style={styles.form}>
            <Input
              label="Your Name"
              value={formData.name}
              onChangeText={(v) => updateField('name', v)}
              placeholder="Enter your name"
            />
            
            <Input
              label="Email Address"
              value={formData.email}
              onChangeText={(v) => updateField('email', v)}
              placeholder="email@example.com"
              keyboardType="email-address"
            />
            
            <Input
              label="Subject"
              value={formData.subject}
              onChangeText={(v) => updateField('subject', v)}
              placeholder="What is this about?"
            />

            <View style={styles.textareaContainer}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={styles.textarea}
                value={formData.message}
                onChangeText={(v) => updateField('message', v)}
                placeholder="Type your message here..."
                placeholderTextColor={colors.text.muted}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button 
              title="Send Message" 
              onPress={handleSubmit}
              loading={loading}
            />
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
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
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
  textareaContainer: {
    marginBottom: spacing.md,
  },
  textarea: {
    backgroundColor: colors.input.background,
    borderWidth: 1.5,
    borderColor: colors.input.border,
    borderRadius: borderRadius.md,
    padding: 14,
    fontSize: 15,
    color: colors.text.primary,
    minHeight: 120,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  // Success state styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successIconText: {
    color: colors.white,
    fontSize: 40,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  successText: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  anotherButton: {
    width: '100%',
  },
});

export default ContactScreen;
