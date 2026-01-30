import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============ COLORS ============
const colors = {
  primary: '#1E4D8C',
  secondary: '#22B8CF',
  background: '#F8FAFC',
  white: '#FFFFFF',
  text: '#333333',
  textMuted: '#999999',
  error: '#E74C3C',
  success: '#27AE60',
};

// ============ AUTH CONTEXT ============
const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('user').then(data => {
      if (data) setUser(JSON.parse(data));
      setLoading(false);
    });
  }, []);

  const login = async (mobile, password) => {
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const found = users.find(u => u.mobile === mobile && u.password === password);
    if (found) {
      await AsyncStorage.setItem('user', JSON.stringify(found));
      setUser(found);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (data) => {
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    if (users.find(u => u.mobile === data.mobile)) {
      return { success: false, error: 'Mobile already registered' };
    }
    const newUser = { id: Date.now(), ...data };
    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// ============ CLOCK COMPONENT ============
const ClockFace = ({ hours, minutes, size = 80 }) => {
  const hourDeg = ((hours % 12) + minutes / 60) * 30;
  const minDeg = minutes * 6;
  
  return (
    <View style={[clockStyles.face, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={clockStyles.center} />
      <View style={[clockStyles.hand, clockStyles.hourHand, {
        height: size * 0.25,
        top: size / 2 - size * 0.25,
        left: size / 2 - 2,
        transform: [{ rotate: `${hourDeg}deg` }]
      }]} />
      <View style={[clockStyles.hand, clockStyles.minHand, {
        height: size * 0.35,
        top: size / 2 - size * 0.35,
        left: size / 2 - 1.5,
        transform: [{ rotate: `${minDeg}deg` }]
      }]} />
    </View>
  );
};

const clockStyles = StyleSheet.create({
  face: { backgroundColor: '#fff', borderWidth: 3, borderColor: colors.primary, position: 'relative' },
  center: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: colors.secondary, top: '50%', left: '50%', marginTop: -5, marginLeft: -5, zIndex: 10 },
  hand: { position: 'absolute', borderRadius: 2, transformOrigin: 'bottom' },
  hourHand: { width: 4, backgroundColor: colors.primary },
  minHand: { width: 3, backgroundColor: colors.secondary },
});

const WorldClocks = () => {
  const [time, setTime] = useState(new Date());
  const clocks = [
    { city: 'Dubai', offset: 4 },
    { city: 'London', offset: 0 },
  ];

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
      {clocks.map((c, idx) => {
        const utc = time.getTime() + time.getTimezoneOffset() * 60000;
        const local = new Date(utc + c.offset * 3600000);
        return (
          <View key={idx} style={{ alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12 }}>
            <ClockFace hours={local.getHours()} minutes={local.getMinutes()} />
            <Text style={{ marginTop: 10, fontWeight: '600', color: colors.primary }}>{c.city}</Text>
          </View>
        );
      })}
    </View>
  );
};

// ============ SCREENS ============
const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    if (!mobile || !password) {
      setError('Please fill all fields');
      return;
    }
    const result = await login(mobile, password);
    if (!result.success) setError(result.error);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('./assets/icon.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Welcome to Sahmi</Text>
      
      <WorldClocks />
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="UAE Mobile Number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({ firstName: '', surname: '', mobile: '', password: '', email: '', phoneType: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!form.firstName || !form.surname || !form.mobile || !form.password) {
      setError('Please fill required fields');
      return;
    }
    const result = await register(form);
    if (!result.success) setError(result.error);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="First Name *" value={form.firstName} onChangeText={v => setForm({...form, firstName: v})} />
        <TextInput style={styles.input} placeholder="Surname *" value={form.surname} onChangeText={v => setForm({...form, surname: v})} />
        <TextInput style={styles.input} placeholder="UAE Mobile Number *" value={form.mobile} onChangeText={v => setForm({...form, mobile: v})} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Password *" value={form.password} onChangeText={v => setForm({...form, password: v})} secureTextEntry />
        <TextInput style={styles.input} placeholder="Email (optional)" value={form.email} onChangeText={v => setForm({...form, email: v})} keyboardType="email-address" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, {user?.firstName}!</Text>
      <WorldClocks />
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.error, marginTop: 30 }]} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const AboutScreen = () => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>About Mercury</Text>
    <Text style={styles.text}>
      Mercury Networks is a global communications company connecting communities worldwide. 
      With over 100,000 users, we provide reliable, affordable connectivity services.
    </Text>
    <Text style={styles.text}>
      Our mission is to bridge distances and bring people closer together through innovative 
      technology solutions.
    </Text>
  </ScrollView>
);

const ContactScreen = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ fontSize: 50 }}>✅</Text>
        <Text style={styles.title}>Message Sent!</Text>
        <Text style={styles.text}>We'll get back to you soon.</Text>
        <TouchableOpacity style={styles.button} onPress={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
          <Text style={styles.buttonText}>Send Another</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Name *" value={form.name} onChangeText={v => setForm({...form, name: v})} />
        <TextInput style={styles.input} placeholder="Email *" value={form.email} onChangeText={v => setForm({...form, email: v})} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Subject" value={form.subject} onChangeText={v => setForm({...form, subject: v})} />
        <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Message *" value={form.message} onChangeText={v => setForm({...form, message: v})} multiline />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ============ NAVIGATION ============
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ name }) => {
  const icons = { Home: '🏠', About: 'ℹ️', Contact: '✉️' };
  return <Text style={{ fontSize: 22 }}>{icons[name]}</Text>;
};

const AuthTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    tabBarIcon: () => <TabIcon name={route.name} />,
    tabBarActiveTintColor: colors.primary,
    headerStyle: { backgroundColor: colors.primary },
    headerTintColor: '#fff',
  })}>
    <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'Dashboard' }} />
    <Tab.Screen name="About" component={AboutScreen} />
    <Tab.Screen name="Contact" component={ContactScreen} />
  </Tab.Navigator>
);

const PublicTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    tabBarIcon: () => <TabIcon name={route.name} />,
    tabBarActiveTintColor: colors.primary,
    headerShown: route.name !== 'Home',
    headerStyle: { backgroundColor: colors.primary },
    headerTintColor: '#fff',
  })}>
    <Tab.Screen name="Home" component={LoginScreen} />
    <Tab.Screen name="About" component={AboutScreen} />
    <Tab.Screen name="Contact" component={ContactScreen} />
  </Tab.Navigator>
);

const MainNav = () => {
  const { user, loading } = useAuth();
  if (loading) return <View style={[styles.container, { justifyContent: 'center' }]}><Text>Loading...</Text></View>;
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Auth" component={AuthTabs} />
      ) : (
        <>
          <Stack.Screen name="Public" component={PublicTabs} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, title: 'Register', headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

// ============ APP ============
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNav />
      </NavigationContainer>
    </AuthProvider>
  );
}

// ============ STYLES ============
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, alignItems: 'center' },
  logo: { width: 200, height: 70, marginTop: 40, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginVertical: 15 },
  text: { fontSize: 16, color: colors.text, textAlign: 'center', marginBottom: 15, lineHeight: 24 },
  form: { width: '100%', maxWidth: 400 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: colors.secondary, textAlign: 'center', marginTop: 20 },
  error: { color: colors.error, marginBottom: 10 },
});
