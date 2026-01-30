import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius } from '../lib/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false,
  disabled = false,
  style = {},
}) => {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={isDisabled}
        style={[styles.button, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, isDisabled && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textPrimary}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={isDisabled}
        style={[styles.button, styles.secondaryButton, isDisabled && styles.disabled, style]}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.textSecondary}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'text') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={isDisabled}
        style={[styles.textButton, style]}
        activeOpacity={0.6}
      >
        <Text style={styles.textLink}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 12,
  },
  gradient: {
    padding: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  textButton: {
    padding: 8,
    alignItems: 'center',
  },
  textPrimary: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  textSecondary: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  textLink: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
