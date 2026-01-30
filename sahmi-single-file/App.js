import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = { primary: '#1E4D8C', secondary: '#22B8CF', background: '#F8FAFC', white: '#FFFFFF', text: '#333333', error: '#E74C3C' };

const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { AsyncStorage.getItem('user').then(d => { if(d) setUser(JSON.parse(d)); setLoading(false); }); }, []);
  const login = async (mobile, password) => {
    const data = await AsyncStorage.getItem('users');
    const users = data ? JSON.parse(data) : [];
    const found = users.find(u => u.mobile === mobile && u.password === password);
    if (found) { await AsyncStorage.setItem('user', JSON.stringify(found)); setUser(found); return { success: true }; }
    return { success: false, error: 'Invalid credentials' };
  };
  const register = async (d) => {
    const data = await AsyncStorage.getItem('users');
    const users = data ? JSON.parse(data) : [];
    if (users.find(u => u.mobile === d.mobile)) return { success: false, error: 'Mobile already registered' };
    const newUser = { id: Date.now(), ...d };
    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };
  const logout = async () => { await AsyncStorage.removeItem('user'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};
const useAuth = () => useContext(AuthContext);

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const { login } = useAuth();
  const handleLogin = async () => {
    if (!mobile || !password) { setError('Please fill all fields'); return; }
    const r = await login(mobile, password);
    if (!r.success) setError(r.error);
  };
  return (
    <ScrollView contentContainerStyle={s.container}>
      <Image source={require('./assets/icon.png')} style={{ width: 200, height: 70, marginTop: 40 }} resizeMode="contain" />
      <Text style={s.title}>Welcome to Sahmi</Text>
      <View style={{ width: '100%', maxWidth: 400, marginTop: 30 }}>
        <TextInput style={s.input} placeholder="UAE Mobile Number" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
        <TextInput style={s.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text style={{ color: colors.error, marginBottom: 10 }}>{error}</Text> : null}
        <TouchableOpacity style={s.btn} onPress={handleLogin}><Text style={s.btnTxt}>Login</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={{ color: colors.secondary, textAlign: 'center', marginTop: 20 }}>Don't have an account? Register</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const RegisterScreen = () => {
  const [form, setForm] = useState({ firstName: '', surname: '', mobile: '', password: '', email: '' }); const [error, setError] = useState('');
  const { register } = useAuth();
  const handleReg = async () => {
    if (!form.firstName || !form.surname || !form.mobile || !form.password) { setError('Fill required fields'); return; }
    const r = await register(form);
    if (!r.success) setError(r.error);
  };
  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>Create Account</Text>
      <View style={{ width: '100%', maxWidth: 400 }}>
        <TextInput style={s.input} placeholder="First Name *" value={form.firstName} onChangeText={v => setForm({...form, firstName: v})} />
        <TextInput style={s.input} placeholder="Surname *" value={form.surname} onChangeText={v => setForm({...form, surname: v})} />
        <TextInput style={s.input} placeholder="UAE Mobile *" value={form.mobile} onChangeText={v => setForm({...form, mobile: v})} keyboardType="phone-pad" />
        <TextInput style={s.input} placeholder="Password *" value={form.password} onChangeText={v => setForm({...form, password: v})} secureTextEntry />
        <TextInput style={s.input} placeholder="Email (optional)" value={form.email} onChangeText={v => setForm({...form, email: v})} />
        {error ? <Text style={{ color: colors.error, marginBottom: 10 }}>{error}</Text> : null}
        <TouchableOpacity style={s.btn} onPress={handleReg}><Text style={s.btnTxt}>Register</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  return (
    <ScrollView contentContainerStyle={s.container}>
      <Image source={require('./assets/icon.png')} style={{ width: 180, height: 60, marginTop: 20 }} resizeMode="contain" />
      <Text style={s.title}>Welcome, {user?.firstName}!</Text>
      <Text style={{ fontSize: 16, color: colors.text, textAlign: 'center', marginTop: 10 }}>You are now logged in to Sahmi.</Text>
      <TouchableOpacity style={[s.btn, { backgroundColor: colors.error, marginTop: 40 }]} onPress={logout}><Text style={s.btnTxt}>Logout</Text></TouchableOpacity>
    </ScrollView>
  );
};

const AboutScreen = () => (
  <ScrollView contentContainerStyle={s.container}>
    <Text style={s.title}>About Mercury</Text>
    <Text style={{ fontSize: 16, color: colors.text, textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 }}>Mercury Networks connects communities worldwide with over 100,000 users. Our mission is to bridge distances through innovative technology.</Text>
  </ScrollView>
);

const ContactScreen = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' }); const [sent, setSent] = useState(false);
  if (sent) return <View style={[s.container, { justifyContent: 'center' }]}><Text style={{ fontSize: 50 }}>✅</Text><Text style={s.title}>Sent!</Text><TouchableOpacity style={s.btn} onPress={() => setSent(false)}><Text style={s.btnTxt}>Send Another</Text></TouchableOpacity></View>;
  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>Contact Us</Text>
      <View style={{ width: '100%', maxWidth: 400 }}>
        <TextInput style={s.input} placeholder="Name *" value={form.name} onChangeText={v => setForm({...form, name: v})} />
        <TextInput style={s.input} placeholder="Email *" value={form.email} onChangeText={v => setForm({...form, email: v})} />
        <TextInput style={s.input} placeholder="Subject" value={form.subject} onChangeText={v => setForm({...form, subject: v})} />
        <TextInput style={[s.input, { height: 100 }]} placeholder="Message *" value={form.message} onChangeText={v => setForm({...form, message: v})} multiline />
        <TouchableOpacity style={s.btn} onPress={() => { if (form.name && form.email && form.message) setSent(true); else Alert.alert('Error', 'Fill required fields'); }}><Text style={s.btnTxt}>Send</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TabIcon = ({ name }) => <Text style={{ fontSize: 22 }}>{{ Home: '🏠', About: 'ℹ️', Contact: '✉️' }[name]}</Text>;

const AuthTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({ tabBarIcon: () => <TabIcon name={route.name} />, tabBarActiveTintColor: colors.primary, headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff' })}>
    <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'Dashboard' }} />
    <Tab.Screen name="About" component={AboutScreen} />
    <Tab.Screen name="Contact" component={ContactScreen} />
  </Tab.Navigator>
);

const PublicTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({ tabBarIcon: () => <TabIcon name={route.name} />, tabBarActiveTintColor: colors.primary, headerShown: route.name !== 'Home', headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff' })}>
    <Tab.Screen name="Home" component={LoginScreen} />
    <Tab.Screen name="About" component={AboutScreen} />
    <Tab.Screen name="Contact" component={ContactScreen} />
  </Tab.Navigator>
);

const MainNav = () => {
  const { user, loading } = useAuth();
  if (loading) return <View style={[s.container, { justifyContent: 'center' }]}><Text>Loading...</Text></View>;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? <Stack.Screen name="Auth" component={AuthTabs} /> : (
        <><Stack.Screen name="Public" component={PublicTabs} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, title: 'Register', headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff' }} /></>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return <AuthProvider><NavigationContainer><MainNav /></NavigationContainer></AuthProvider>;
}

const s = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginVertical: 15 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, marginBottom: 12, fontSize: 16 },
  btn: { backgroundColor: colors.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
