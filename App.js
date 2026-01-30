import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============ SUPABASE CONFIG ============
const SUPABASE_URL = 'https://rdqszmkpaunzofsdcjrr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcXN6bWtwYXVuem9mc2RjanJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTcwNTksImV4cCI6MjA4NTM3MzA1OX0.TQrqKSeA7UabBgkqFaaTVgvUDxlpWreRfbZawIpD2-U';

const supabase = {
  from: (table) => ({
    select: async (columns = '*') => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },
    insert: async (rows) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify(rows)
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },
    selectWhere: async (column, value) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    }
  })
};

const colors = { primary: '#1E4D8C', secondary: '#22B8CF', background: '#F8FAFC', white: '#FFFFFF', text: '#333333', error: '#E74C3C' };

const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => { 
    AsyncStorage.getItem('user').then(d => { 
      if(d) setUser(JSON.parse(d)); 
      setLoading(false); 
    }); 
  }, []);

  const login = async (mobile, password) => {
    try {
      const { data, error } = await supabase.from('profiles').selectWhere('mobile', mobile);
      if (error) return { success: false, error: 'Connection error' };
      
      const found = data?.find(u => u.password === password);
      if (found) { 
        const userData = { id: found.id, firstName: found.first_name, surname: found.surname, mobile: found.mobile, email: found.email };
        await AsyncStorage.setItem('user', JSON.stringify(userData)); 
        setUser(userData); 
        return { success: true }; 
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (e) {
      return { success: false, error: 'Connection error' };
    }
  };

  const register = async (d) => {
    try {
      // Check if mobile exists
      const { data: existing } = await supabase.from('profiles').selectWhere('mobile', d.mobile);
      if (existing && existing.length > 0) {
        return { success: false, error: 'Mobile already registered' };
      }

      // Insert new user
      const { data, error } = await supabase.from('profiles').insert({
        mobile: d.mobile,
        password: d.password,
        first_name: d.firstName,
        surname: d.surname,
        email: d.email || null,
        phone_type: d.phoneType || null
      });

      if (error) {
        return { success: false, error: error.message || 'Registration failed' };
      }

      const newUser = data?.[0];
      if (newUser) {
        const userData = { id: newUser.id, firstName: newUser.first_name, surname: newUser.surname, mobile: newUser.mobile, email: newUser.email };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (e) {
      return { success: false, error: 'Connection error' };
    }
  };

  const logout = async () => { 
    await AsyncStorage.removeItem('user'); 
    setUser(null); 
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};
const useAuth = () => useContext(AuthContext);

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const handleLogin = async () => {
    if (!mobile || !password) { setError('Please fill all fields'); return; }
    setLoading(true); setError('');
    const r = await login(mobile, password);
    setLoading(false);
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
        <TouchableOpacity style={[s.btn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
          <Text style={s.btnTxt}>{loading ? 'Loading...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={{ color: colors.secondary, textAlign: 'center', marginTop: 20 }}>Don't have an account? Register</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const RegisterScreen = () => {
  const [form, setForm] = useState({ firstName: '', surname: '', mobile: '', password: '', email: '', phoneType: '' }); 
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const handleReg = async () => {
    if (!form.firstName || !form.surname || !form.mobile || !form.password) { setError('Fill required fields'); return; }
    setLoading(true); setError('');
    const r = await register(form);
    setLoading(false);
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
        <TouchableOpacity style={[s.btn, loading && { opacity: 0.7 }]} onPress={handleReg} disabled={loading}>
          <Text style={s.btnTxt}>{loading ? 'Registering...' : 'Register'}</Text>
        </TouchableOpacity>
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
