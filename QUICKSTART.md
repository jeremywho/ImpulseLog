# Quick Start Guide

Get up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
cd packages/shared && npm run build && cd ../..
```

## 2. Start the Backend

```bash
# Terminal 1
cd packages/backend
dotnet run
```

Backend runs at `http://localhost:5000`

## 3. Start Electron (Desktop)

```bash
# Terminal 2
cd packages/electron
npm install
npm run dev
```

## 4. Start React Native (Mobile)

### Android
```bash
# Terminal 3
cd packages/mobile
npm install
npm start

# Terminal 4
cd packages/mobile
npm run android
```

### iOS (macOS only)
```bash
# Terminal 3
cd packages/mobile
npm install
cd ios && pod install && cd ..
npm start

# Terminal 4
cd packages/mobile
npm run ios
```

## First Time Setup

1. Register a new account in the Electron or mobile app
2. Login with your credentials
3. Navigate to the account page to update your profile
4. (Electron only) Check out the Settings page to configure system tray behavior
5. Test the logout functionality

## Common Commands

```bash
# Backend
npm run backend              # Start backend

# Electron
npm run electron            # Start Electron dev mode
npm run build:electron      # Build for production

# React Native
npm run mobile              # Start Metro bundler
npm run mobile:android      # Run on Android
npm run mobile:ios          # Run on iOS
```

## Troubleshooting

**Backend won't start**: Make sure .NET 9 SDK is installed (`dotnet --version`)

**Electron won't start**: Delete `node_modules` and run `npm install` again

**React Native won't build**:
- Android: Make sure Android Studio and SDK are installed
- iOS: Make sure Xcode and CocoaPods are installed
- Clear Metro cache: `npm start -- --reset-cache`

**Can't connect to backend from mobile**:
- Android Emulator: Use `http://10.0.2.2:5000` in AuthContext
- iOS Simulator: Use `http://localhost:5000`
- Physical Device: Use `http://YOUR_COMPUTER_IP:5000`

## Next Steps

See the main [README.md](README.md) for comprehensive documentation.
