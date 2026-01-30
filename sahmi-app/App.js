import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { colors } from './src/lib/theme';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AboutScreen from './src/screens/AboutScreen';
import ContactScreen from './src/screens/ContactScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icon Component
const TabIcon = ({ name, focused }) => {
  const icons = {
    Home: '🏠',
    About: 'ℹ️',
    Contact: '✉️',
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{icons[name]}</Text>
    </View>
  );
};

// Authenticated Tab Navigator
const AuthenticatedTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen}
        options={{ title: 'About Mercury' }}
      />
      <Tab.Screen 
        name="Contact" 
        component={ContactScreen}
        options={{ title: 'Contact Us' }}
      />
    </Tab.Navigator>
  );
};

// Public Tab Navigator (for non-logged in users)
const PublicTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={LoginScreen}
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen}
        options={{ 
          headerShown: true,
          title: 'About Mercury',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
        }}
      />
      <Tab.Screen 
        name="Contact" 
        component={ContactScreen}
        options={{ 
          headerShown: true,
          title: 'Contact Us',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigator
const MainNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.primary, fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={AuthenticatedTabs} />
      ) : (
        <>
          <Stack.Screen name="PublicTabs" component={PublicTabs} />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{
              headerShown: true,
              title: 'Create Account',
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

// App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
