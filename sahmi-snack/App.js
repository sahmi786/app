import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform, Linking,
  ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';

// ============ THEME ============
const colors = {
  primary: '#1E4D8C',
  secondary: '#22B8CF',
  gradient: ['#1E4D8C', '#22B8CF'],
  background: '#F8FAFC',
  white: '#FFFFFF',
  text: { primary: '#333', secondary: '#666', muted: '#999' },
  input: { background: '#FAFAFA', border: '#E0E0E0' },
  success: '#27AE60',
  error: '#E74C3C',
};

const defaultClocks = [
  { id: '1', city: 'Dubai', timezone: 'Asia/Dubai' },
  { id: '2', city: 'Mumbai', timezone: 'Asia/Kolkata' },
  { id: '3', city: 'Karachi', timezone: 'Asia/Karachi' },
  { id: '4', city: 'Lagos', timezone: 'Africa/Lagos' },
];

// ============ AUTH CONTEXT ============
const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkUser(); }, []);

  const checkUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    } catch (e) {} 
    finally { setLoading(false); }
  };

  const login = async (mobile, password) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      const foundUser = users.find(u => u.mobile === mobile && u.password === password);
      if (foundUser) {
        const { password: _, ...safe } = foundUser;
        await AsyncStorage.setItem('user', JSON.stringify(safe));
        setUser(safe);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (e) { return { success: false, error: e.message }; }
  };

  const register = async (userData) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      if (users.find(u => u.mobile === userData.mobile)) {
        return { success: false, error: 'Mobile already registered' };
      }
      const newUser = { id: Date.now().toString(), ...userData, createdAt: new Date().toISOString() };
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      const { password: _, ...safe } = newUser;
      await AsyncStorage.setItem('user', JSON.stringify(safe));
      setUser(safe);
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
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

// ============ COMPONENTS ============
const Input = ({ label, required, error, ...props }) => (
  <View style={styles.inputContainer}>
    {label && <Text style={styles.label}>{label} {required && <Text style={{color: colors.error}}>*</Text>}</Text>}
    <TextInput style={[styles.input, error && {borderColor: colors.error}]} placeholderTextColor="#999" {...props} />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const Button = ({ title, onPress, variant = 'primary', loading: isLoading, style }) => {
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={isLoading} style={style}>
        <LinearGradient colors={colors.gradient} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.btnPrimary}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextPrimary}>{title}</Text>}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btnSecondary, style]}>
      <Text style={styles.btnTextSecondary}>{title}</Text>
    </TouchableOpacity>
  );
};

const WorldClocks = ({ clocks = defaultClocks }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const getTime = (tz) => {
    try {
      return new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
    } catch { return '--:--'; }
  };

  return (
    <View style={styles.clocksRow}>
      {clocks.map(c => (
        <View key={c.id} style={styles.clock}>
          <Text style={styles.clockTime}>{getTime(c.timezone)}</Text>
          <Text style={styles.clockCity}>{c.city}</Text>
        </View>
      ))}
    </View>
  );
};

// ============ SCREENS ============
const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!mobile || !password) { setError('Please fill all fields'); return; }
    setLoading(true);
    const result = await login(mobile, password);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <LinearGradient colors={colors.gradient} style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>سهمي</Text>
            <Text style={styles.logoSubtext}>Sahmi</Text>
          </LinearGradient>
          <Text style={styles.tagline}>Your gateway to Mercury</Text>
        </View>

        <Input label="UAE Mobile Number" value={mobile} onChangeText={setMobile} placeholder="+971 5X XXX XXXX" keyboardType="phone-pad" />
        <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <Button title="Login" onPress={handleLogin} loading={loading} />
        
        <View style={styles.linkRow}>
          <Text style={styles.linkText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.divider}>— World Clocks —</Text>
        <WorldClocks />
      </ScrollView>
    </SafeAreaView>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({ firstName: '', surname: '', mobile: '', password: '', email: '', phoneType: '' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleRegister = async () => {
    if (!form.firstName || !form.surname || !form.mobile || !form.password) {
      setError('Please fill all required fields'); return;
    }
    if (form.password.length < 8) { setError('Password must be 8+ characters'); return; }
    if (!agreed) { setError('Please agree to terms'); return; }
    
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the Sahmi community</Text>

          <Input label="First Name" value={form.firstName} onChangeText={v => update('firstName', v)} placeholder="Enter first name" required />
          <Input label="Surname" value={form.surname} onChangeText={v => update('surname', v)} placeholder="Enter surname" required />
          <Input label="UAE Mobile Number" value={form.mobile} onChangeText={v => update('mobile', v)} placeholder="+971 5X XXX XXXX" keyboardType="phone-pad" required />
          <Input label="Password" value={form.password} onChangeText={v => update('password', v)} placeholder="Min 8 characters" secureTextEntry required />
          <Input label="Email (Optional)" value={form.email} onChangeText={v => update('email', v)} placeholder="email@example.com" keyboardType="email-address" />

          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>I agree to the Terms of Service</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          <Button title="Create Account" onPress={handleRegister} loading={loading} />
          
          <View style={styles.linkRow}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcome}>Welcome, {user?.firstName}! 👋</Text>
        <Text style={styles.greeting}>{greeting}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>World Clocks</Text>
          <WorldClocks />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Links</Text>
          <View style={styles.quickLinks}>
            <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('About')}>
              <Text style={styles.qlIcon}>ℹ️</Text>
              <Text style={styles.qlText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('Contact')}>
              <Text style={styles.qlIcon}>✉️</Text>
              <Text style={styles.qlText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink}>
              <Text style={styles.qlIcon}>⚙️</Text>
              <Text style={styles.qlText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button title="Logout" variant="secondary" onPress={logout} style={{marginTop: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const AboutScreen = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>About Mercury</Text>
      <LinearGradient colors={colors.gradient} style={styles.heroBanner}>
        <Text style={styles.heroText}>MERCURY</Text>
        <Text style={styles.heroSubtext}>NETWORKS</Text>
      </LinearGradient>
      <Text style={styles.sectionTitle}>Who We Are</Text>
      <Text style={styles.bodyText}>Mercury Networks is a leading technology solutions provider, delivering innovative services across the Middle East and beyond.</Text>
      <Text style={styles.sectionTitle}>Our Mission</Text>
      <Text style={styles.bodyText}>To empower businesses with cutting-edge technology solutions that drive growth and efficiency.</Text>
      <Text style={styles.sectionTitle}>Our Services</Text>
      <Text style={styles.bodyText}>• Enterprise Solutions{'\n'}• Cloud Infrastructure{'\n'}• Digital Transformation{'\n'}• Managed Services</Text>
      <Text style={styles.sectionTitle}>About Sahmi</Text>
      <Text style={styles.bodyText}>Sahmi (سهمي) means "my share" in Arabic, reflecting our commitment to shared success and partnership.</Text>
    </ScrollView>
  </SafeAreaView>
);

const ContactScreen = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please fill all fields'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}><Text style={styles.successIconText}>✓</Text></View>
          <Text style={styles.successTitle}>Message Sent!</Text>
          <Text style={styles.successText}>We'll get back to you soon.</Text>
          <Button title="Send Another" variant="secondary" onPress={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.subtitle}>We'd love to hear from you</Text>
        <Input label="Your Name" value={form.name} onChangeText={v => setForm(p => ({...p, name: v}))} placeholder="Enter name" />
        <Input label="Email" value={form.email} onChangeText={v => setForm(p => ({...p, email: v}))} placeholder="email@example.com" keyboardType="email-address" />
        <Input label="Subject" value={form.subject} onChangeText={v => setForm(p => ({...p, subject: v}))} placeholder="What is this about?" />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput style={[styles.input, {height: 100, textAlignVertical: 'top'}]} value={form.message} onChangeText={v => setForm(p => ({...p, message: v}))} placeholder="Your message..." multiline />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Send Message" onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ NAVIGATION ============
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ name }) => {
  const icons = { Home: '🏠', About: 'ℹ️', Contact: '✉️' };
  return <Text style={{fontSize: 20}}>{icons[name]}</Text>;
};

const AuthTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    tabBarIcon: () => <TabIcon name={route.name} />,
    tabBarActiveTintColor: colors.primary,
    tabBarStyle: { paddingBottom: 8, paddingTop: 8, height: 60 },
    headerStyle: { backgroundColor: colors.primary },
    headerTintColor: '#fff',
  })}>
    <Tab.Screen name="Home" component={DashboardScreen} options={{title: 'Dashboard'}} />
    <Tab.Screen name="About" component={AboutScreen} options={{title: 'About Mercury'}} />
    <Tab.Screen name="Contact" component={ContactScreen} options={{title: 'Contact Us'}} />
  </Tab.Navigator>
);

const PublicTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    tabBarIcon: () => <TabIcon name={route.name} />,
    tabBarActiveTintColor: colors.primary,
    tabBarStyle: { paddingBottom: 8, paddingTop: 8, height: 60 },
    headerShown: route.name !== 'Home',
    headerStyle: { backgroundColor: colors.primary },
    headerTintColor: '#fff',
  })}>
    <Tab.Screen name="Home" component={LoginScreen} />
    <Tab.Screen name="About" component={AboutScreen} options={{title: 'About Mercury'}} />
    <Tab.Screen name="Contact" component={ContactScreen} options={{title: 'Contact Us'}} />
  </Tab.Navigator>
);

const MainNav = () => {
  const { user, loading } = useAuth();
  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={AuthTabs} />
      ) : (
        <>
          <Stack.Screen name="Public" component={PublicTabs} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, title: 'Create Account', headerStyle: {backgroundColor: colors.primary}, headerTintColor: '#fff' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

// ============ APP ============
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainNav />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// ============ STYLES ============
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 24, flexGrow: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  
  // Logo
  logoContainer: { alignItems: 'center', marginVertical: 30 },
  logoPlaceholder: { width: 180, height: 80, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  logoSubtext: { fontSize: 16, color: '#fff', opacity: 0.9 },
  tagline: { marginTop: 12, color: colors.text.secondary, fontSize: 14 },

  // Typography
  title: { fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.text.secondary, marginBottom: 24 },
  welcome: { fontSize: 24, fontWeight: '700', color: colors.primary },
  greeting: { fontSize: 15, color: colors.text.secondary, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.primary, marginTop: 20, marginBottom: 8 },
  bodyText: { fontSize: 15, color: colors.text.secondary, lineHeight: 22 },
  divider: { textAlign: 'center', color: colors.text.muted, marginVertical: 20 },
  error: { color: colors.error, textAlign: 'center', marginBottom: 16 },

  // Input
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 13, color: colors.text.secondary, marginBottom: 6, fontWeight: '500' },
  input: { backgroundColor: colors.input.background, borderWidth: 1.5, borderColor: colors.input.border, borderRadius: 12, padding: 14, fontSize: 15 },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4 },

  // Buttons
  btnPrimary: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  btnTextPrimary: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnSecondary: { padding: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#fff', borderWidth: 2, borderColor: colors.primary, marginBottom: 12 },
  btnTextSecondary: { color: colors.primary, fontSize: 16, fontWeight: '600' },

  // Links
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  linkText: { color: colors.text.secondary },
  link: { color: colors.secondary, fontWeight: '600' },

  // Clocks
  clocksRow: { flexDirection: 'row', justifyContent: 'space-between' },
  clock: { flex: 1, alignItems: 'center', padding: 12, marginHorizontal: 4, backgroundColor: '#F8FAFC', borderRadius: 10 },
  clockTime: { fontSize: 18, fontWeight: '700', color: colors.primary },
  clockCity: { fontSize: 10, color: colors.text.secondary, marginTop: 4 },

  // Cards
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.primary, marginBottom: 12 },

  // Quick Links
  quickLinks: { flexDirection: 'row', justifyContent: 'space-between' },
  quickLink: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: colors.background, borderRadius: 12, marginHorizontal: 4 },
  qlIcon: { fontSize: 24, marginBottom: 4 },
  qlText: { fontSize: 12, color: colors.text.secondary },

  // Terms
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: colors.primary, borderRadius: 4, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: colors.primary },
  checkmark: { color: '#fff', fontWeight: 'bold' },
  termsText: { flex: 1, fontSize: 13, color: colors.text.secondary },

  // Hero
  heroBanner: { padding: 30, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  heroText: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 4 },
  heroSubtext: { fontSize: 12, color: '#fff', opacity: 0.9, letterSpacing: 6 },

  // Success
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successIconText: { color: '#fff', fontSize: 40 },
  successTitle: { fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: 8 },
  successText: { fontSize: 15, color: colors.text.secondary, marginBottom: 30 },
});
