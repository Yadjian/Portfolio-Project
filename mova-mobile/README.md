# 📱 mova-mobile

**mova-mobile** is the mobile application for the Mova project, built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/).  
It provides a matching experience between candidates and recruiters, with profile management, swipes, notifications, job offers, and more.

---

## 🚀 Main Features

- **Secure authentication** (login, registration, JWT token management)
- **Candidate and recruiter profiles** (edit, photo, presentation, experience, etc.)
- **Matching & Swipes** (profile discovery, swipe left/right, match history)
- **Job offers** (creation, editing, deletion for recruiters)
- **Notifications** (badge, display, management)
- **Smooth navigation** (custom stack navigation, bottom tab bar)
- **Address search** (Google Places autocomplete)
- **Dark mode ready** (centralized color management)
- **Responsive design** (adapts to all screen sizes)
- **Security** (secure token storage with `expo-secure-store`)

---

## 🗂️ Project Structure

```
mova-mobile/
│
├── .env                   # Environment variables (API keys, etc.)
├── .gitignore             # Files/folders to ignore in git
├── app.config.js          # Expo app configuration
├── babel.config.js        # Babel configuration for React Native
├── eas.json               # Expo Application Services configuration
├── expo-env.d.ts          # Expo TypeScript environment types (auto-generated)
├── package.json           # Project dependencies and scripts
├── README.md              # This file
├── tsconfig.json          # TypeScript configuration
│
├── app/                   # Main app source (Expo Router structure)
│   ├── _layout.tsx            # Root layout for Expo Router (navigation container)
│   ├── +html.tsx              # Custom HTML root for web builds (meta, CSS, etc.)
│   ├── +not-found.tsx         # Custom 404/Not Found screen (web & mobile)
│   ├── modal.tsx              # Modal screen (optional, for info/settings popups)
│   ├── (tabs)/                # Tab navigation layouts (Expo Router)
│   │   └── _layout.tsx        # Tab bar layout for Expo Router
│   ├── navigation/            # Navigation stacks and tab navigators
│   │   ├── AppTabs.tsx            # Bottom tab navigator (React Navigation)
│   │   ├── AuthStack.tsx           # Authentication stack (login, register, onboarding)
│   │   └── index.tsx               # Navigation entry point (switches between stacks)
│   ├── screens/                # All app screens
│   │   ├── CandidateCVScreen.tsx
│   │   ├── HistoricalScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── MatchDetailScreen.tsx
│   │   ├── RecruiterJobOfferScreen.tsx
│   │   ├── SwipeNotificationScreen.tsx
│   │   ├── UserHomeScreen.tsx
│   │   ├── ProfileScreens/         # Profile-related screens
│   │   │   ├── CandidateProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   └── RecruiterProfileScreen.tsx
│   │   └── RegisterScreens/        # Registration & onboarding screens
│   │       ├── ChooseRegisterTypeScreen.tsx
│   │       ├── CreateAccountScreen.tsx
│   │       ├── CreateCompanyScreen.tsx
│   │       └── JoinCompanyScreen.tsx
│
├── assets/                 # Static assets (images, fonts, etc.)
│   └── fonts/              # Custom fonts
│
├── components/             # Reusable UI components and hooks
│   ├── Themed.tsx              # Theme-aware Text/View components (light/dark mode)
│   ├── useClientOnlyValue.ts   # (Web only) SSR/client value hook (can be removed if not using web)
│   ├── useClientOnlyValue.web.ts
│   ├── useColorScheme.ts       # Color scheme hook (re-export from react-native)
│   ├── useColorScheme.web.ts
│   └── ui/                     # UI components
│       ├── ActiveToggle.tsx            # Animated toggle switch (active/inactive)
│       ├── BackButton.tsx              # Custom back button for headers
│       ├── BottomTabBar.tsx            # Custom bottom tab bar
│       ├── ColorBackground.tsx         # Gradient background wrapper
│       ├── CustomPlacesAutocomplete.tsx# Google Places autocomplete input
│       ├── EditProfileButton.tsx       # Edit profile icon button
│       ├── HomeButton.tsx              # Home icon button for headers
│       ├── MovaLogo.tsx                # Main app logo component
│       ├── NotificationButton.tsx      # Notification bell with badge
│       ├── ProfileSection.tsx          # Card section for profile screens
│       ├── SwipeCard.tsx               # Card for swipe/match interface
│       └── TextInput.tsx               # Stylized text input with gradient border
│
├── constants/               # Centralized app constants
│   ├── Colors.ts                 # Color palette for light/dark themes
│   ├── Layout.ts                 # Screen dimensions, status bar height, etc.
│   └── tabsConfig.ts             # Tab bar configuration for candidate/recruiter
│
├── contexts/                # React Contexts
│   └── AuthContext.tsx           # Authentication context (login, logout, user state)
│
├── lib/                     # Shared TypeScript types
│   └── types.ts                  # Navigation types, user types, API URL getter
│
├── services/                # API calls and backend helpers
│   └── api.ts                    # All API requests (auth, profile, offers, etc.)
```

---

## 🛠️ Installation & Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### 2. Install dependencies

```bash
cd mova-mobile
yarn install
# or
npm install
```

### 3. Environment Variables

Create a `.env` file at the root of `mova-mobile`:

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

### 4. Start the app

```bash
expo start
```
- Scan the QR code with the Expo Go app (iOS/Android)
- Or launch on an emulator

---

## 🔑 Authentication & Security

- JWT tokens are securely stored using [`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/).
- The `AuthContext` manages login state, user profile, and token persistence.
- All API calls use the token for authentication.

---

## 🧭 Navigation

- **Stack navigation**: For authentication, onboarding, profile, etc. (`app/navigation/AuthStack.tsx`)
- **Bottom tab bar**: Main navigation, customized per user type (`constants/tabsConfig.ts`)
- **Expo Router**: Layouts, modals, 404 handling, etc.

---

## 🎨 Theming & Dark Mode

- **Centralized palette** in `constants/Colors.ts`
- **Theme-aware components** (`components/Themed.tsx`) for automatic light/dark adaptation
- **Ready for dark mode**: just fill in the `dark` colors in `Colors.ts` and use Themed components

---

## 🧩 Main UI Components

- `ActiveToggle`: Animated active/inactive switch
- `BottomTabBar`: Custom bottom navigation bar
- `ProfileSection`: Card sections for profile screens
- `CustomPlacesAutocomplete`: Google Places address autocomplete
- `SwipeCard`: Profile card for swipe interface
- `MovaLogo` / `SmallMovaLogo`: App logos
- `NotificationButton`: Bell icon with badge
- `TextInput`: Gradient-bordered input field

---

## 📝 TypeScript & Types

- All navigation and user types are centralized in `lib/types.ts` for type-safe navigation and API calls.

---

## 🌐 API Integration

- All API calls are centralized in `services/api.ts` (login, register, profile, offers, swipes, etc.).
- Uses `SecureStore` for token management.
- Handles error responses and authentication headers.

---

## 📦 Useful Scripts

- `expo start`: Start the project in development mode
- `expo build`: Build the app for production
- `yarn lint`: (if configured) Lint the codebase

---

## 📝 Best Practices

- **Use Themed components** for text and views to prepare for dark mode.
- **Centralize colors** in `Colors.ts` for easy maintenance.
- **Use AuthContext** to access user and authentication state throughout the app.
- **Store sensitive keys in `.env`** (never commit them publicly).

---

## 🧑‍🎨 Customization

- To change colors, edit `constants/Colors.ts`.
- To add or modify tabs, edit `constants/tabsConfig.ts` and navigation files.
- To add screens, create a file in `app/screens/` and add it to navigation.

---

## 🏗️ Contribution

1. Fork the repo
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'feat: new feature'`)
4. Push the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

---

## 🛡️ Security & Privacy

- **Never share your `.env` file** or API keys publicly.
- Add `.env` and `expo-env.d.ts` to your `.gitignore`.

---

## 📝 License

This project is licensed under the MIT License.

---

**Contact:**  
For any questions or suggestions, contact the Mova team.

---