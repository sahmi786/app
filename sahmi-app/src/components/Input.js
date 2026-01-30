import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../lib/theme';

const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false,
  keyboardType = 'default',
  required = false,
  error = null,
  ...props 
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.input.background,
    borderWidth: 1.5,
    borderColor: colors.input.border,
    borderRadius: borderRadius.md,
    padding: 14,
    fontSize: 15,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
