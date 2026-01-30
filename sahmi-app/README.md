# Sahmi - Mercury Mobile App

📱 A mobile engagement platform for Mercury Networks.

## Quick Start (Test on Your Phone)

### Option 1: Using Expo Go (Recommended)

1. **Install Expo Go** on your phone:
   - iPhone: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Install Node.js** on your computer (if not already):
   - Download from [nodejs.org](https://nodejs.org)

3. **Run the app**:
   ```bash
   cd sahmi-app
   npm install
   npx expo start
   ```

4. **Scan the QR code** with:
   - iPhone: Camera app
   - Android: Expo Go app

### Option 2: Using Expo Snack (No Install Required)

Upload the project to [snack.expo.dev](https://snack.expo.dev) for instant browser-based preview.

## Features

- ✅ Login with UAE mobile number + password
- ✅ User registration (with phone type tracking)
- ✅ Dashboard with personalised greeting
- ✅ 4 customisable world clocks (UAE, India, Pakistan, Nigeria)
- ✅ About Mercury page
- ✅ Contact form
- ✅ Clean, modern UI with Sahmi branding

## Tech Stack

- **Frontend**: React Native + Expo
- **Navigation**: React Navigation (tabs + stack)
- **State**: React Context + AsyncStorage
- **UI**: Custom components with brand theming

## Project Structure

```
sahmi-app/
├── App.js                 # Main app entry
├── app.json               # Expo config
├── assets/
│   └── sahmi-logo.png     # Logo
└── src/
    ├── components/        # Reusable UI components
    │   ├── Button.js
    │   ├── Input.js
    │   └── WorldClocks.js
    ├── contexts/
    │   └── AuthContext.js # Auth state management
    ├── lib/
    │   ├── supabase.js    # Backend client (to be configured)
    │   └── theme.js       # Brand colors & constants
    └── screens/
        ├── LoginScreen.js
        ├── RegisterScreen.js
        ├── DashboardScreen.js
        ├── AboutScreen.js
        └── ContactScreen.js
```

## Brand Colors

- Primary (Dark Blue): `#1E4D8C`
- Secondary (Teal): `#22B8CF`
- Gradient: Dark Blue → Teal

## Next Steps for Production

1. Set up Supabase backend (database, auth)
2. Configure email service for contact form
3. Add push notifications
4. Build for App Store & Play Store
5. Submit for review

## Backend Setup (When Ready)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key to `src/lib/supabase.js`
4. Set up database tables for users

---

Built with ❤️ for Mercury Networks
