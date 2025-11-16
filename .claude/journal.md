# StarterTemplates Project Journal

## Project Overview

This is a comprehensive full-stack starter template designed for rapid prototyping of new projects. It provides a complete foundation with desktop (Electron), mobile (React Native), and backend (.NET) applications sharing a common authentication system.

## Original Requirements

The user requested a starter template with these specifications:

### Technology Stack
- **Desktop:** Electron for Mac/Windows/Linux
  - Must support auto-updates
  - Use Vite instead of Webpack
- **Mobile:** React Native for Android/iOS
  - React Native CLI (not Expo)
- **Backend:** .NET 9 with SQLite
  - SQLite for starter template
  - Easy to swap to MSSQL/Postgres for production
- **State Management:** Simple approach using useEffects only
  - No complex data libraries

### Core Functionality
- User authentication system
  - User registration
  - User login
  - JWT-based authentication
- Landing/home page after login
- Account page for updating user profile
- Keep everything "super basic" - user system should be the only complexity

### Version Management
- All packages using their latest versions
- Automated dependency updates (or easy monthly updates)

### User Configuration Choices
When asked about specific implementation details, the user chose:
- **Monorepo structure:** All packages in one repository (vs separate repos)
- **Authentication:** JWT tokens (stateless)
- **Auto-updates:** electron-updater with GitHub Releases
- **Dependency management:** GitHub Dependabot with weekly scheduled updates
- **React Native:** CLI version (not Expo)

### Additional Requirements (Added Later)

#### System Tray Functionality (November 2025)
The user requested system tray integration for the Electron desktop app:
- **Windows:** Task tray icon that can keep app running when main window is closed
- **macOS/Linux:** Similar behavior appropriate for each platform (menu bar/system tray)
- **Interactions:**
  - Click/double-click tray icon to reopen/toggle window
  - Right-click for context menu with Quit option
- **Configuration:**
  - Developer can set default behaviors in code
  - User can adjust settings via Settings page in the app
  - Configurable options: close to tray vs quit, minimize to tray, start minimized

## Architecture

### Monorepo Structure
```
StarterTemplates/
├── packages/
│   ├── backend/          # .NET 9 Web API
│   ├── electron/         # Desktop app (Electron + React + Vite)
│   ├── mobile/           # Mobile app (React Native CLI)
│   └── shared/           # Shared TypeScript types and API client
├── .github/workflows/    # CI/CD workflows
└── .claude/             # Project documentation
```

### Backend (`packages/backend/`)
- **Framework:** ASP.NET Core 9 Web API
- **Database:** SQLite with Entity Framework Core 9
- **Authentication:** JWT tokens with BCrypt password hashing
- **API Endpoints:**
  - `POST /api/auth/register` - Create new user
  - `POST /api/auth/login` - Login and get JWT token
  - `GET /api/users/me` - Get current user profile (authenticated)
  - `PUT /api/users/me` - Update user profile (authenticated)
- **Configuration:**
  - JWT settings in `appsettings.json`
  - SQLite connection string: `Data Source=app.db`
  - CORS enabled for development (localhost:5173, localhost:5000)
  - Runs on port 5000 (HTTP) and 5001 (HTTPS) when debugging in Visual Studio
- **Visual Studio:** `StarterTemplateBackend.sln` solution file included

### Shared Package (`packages/shared/`)
- **Purpose:** Share TypeScript types and API client between Electron and Mobile
- **Exports:**
  - TypeScript interfaces: User, RegisterDto, LoginDto, UpdateUserDto, AuthResponse, ApiError
  - API client class with methods for all backend endpoints
- **API Client Features:**
  - Token storage and automatic injection in request headers
  - Error handling with typed responses
  - Methods: register(), login(), getCurrentUser(), updateCurrentUser(), logout()

### Electron (`packages/electron/`)
- **Framework:** Electron 39 + React 19 + Vite 7
- **Routing:** React Router 7
- **Auto-updates:** electron-updater configured for GitHub Releases
- **Build:** electron-builder for cross-platform packaging
- **Settings Management:** electron-store for persistent user preferences
- **System Tray:**
  - Always present in taskbar (Windows) / menu bar (macOS) / system tray (Linux)
  - Click to show/hide window (Windows), double-click on macOS/Linux
  - Right-click context menu with "Show App" and "Quit" options
  - Configurable behavior: close to tray vs quit, minimize to tray, start minimized
- **Pages:**
  - Login page
  - Register page
  - Home page (after login)
  - Account page (profile management)
  - Settings page (system tray and app preferences)
- **Authentication:** JWT token persisted in localStorage, cleared on logout
- **API:** Connects to backend at `http://localhost:5000`
- **Scripts:**
  - `npm run dev` - Development mode
  - `npm run build` - Full build with packaging
  - `npm run build:ci` - CI build (compilation only, no packaging)

### Mobile (`packages/mobile/`)
- **Framework:** React Native 0.82 CLI with TypeScript
- **Navigation:** React Navigation 7 (native stack)
- **Authentication:** JWT token persisted in AsyncStorage
- **Screens:**
  - Login screen
  - Register screen
  - Home screen (after login)
  - Account screen (profile management)
- **API Configuration:**
  - Android emulator: `http://10.0.2.2:5000`
  - iOS simulator: `http://localhost:5000`
- **Build:**
  - Android: Gradle builds APK (debug and release)
  - iOS: Xcode builds app for simulator/device

## Key Technical Decisions

### Dependency Management
- **Lock files gitignored:** `package-lock.json` and `yarn.lock` are in `.gitignore`
- **Rationale:** Allows Dependabot to easily update to latest compatible versions
- **CI/CD:** Workflows use `npm install` instead of `npm ci`

### Build Outputs Gitignored
- `node_modules/`
- `dist/`, `build/`, `out/`, `release/`
- `dist-electron/`
- `.NET bin/obj/`
- `*.db` files (SQLite databases)
- All standard IDE and temporary files

### CI/CD Workflows (GitHub Actions)

#### Backend CI
- Runs on: Ubuntu
- Triggers: Push/PR to master/main/develop affecting backend files
- Steps: Restore, Build (Release), Test, Security audit
- Uses: `StarterTemplateBackend.sln`

#### Electron CI
- Runs on: Ubuntu, macOS, Windows (matrix)
- Triggers: Push/PR affecting electron or shared packages
- Steps: Build shared, Build electron (without packaging), TypeScript checks
- Uploads: Build artifacts (Ubuntu only)

#### Mobile CI
- Jobs: lint-and-test, build-android, build-ios
- Runs on: Ubuntu (Android/lint), macOS (iOS)
- Special handling:
  - Symlinks root node_modules to packages/mobile/node_modules for Gradle
  - chmod +x gradlew for Android builds
- Uploads: Android APK artifact

#### Code Quality
- Security audits (npm and .NET)
- TypeScript checks across all packages
- Runs weekly on schedule + on push/PR

#### Release Workflow
- Triggered by version tags (v*.*.*)
- Builds Electron for all platforms
- Creates GitHub Release
- Uploads platform-specific installers (dmg, exe, AppImage)

### Known Issues and Solutions

#### Issue: npm workspaces hoisting
**Problem:** React Native's Gradle expects `@react-native/gradle-plugin` in `packages/mobile/node_modules/` but npm workspaces hoists dependencies to root.
**Solution:** CI workflow creates symlink from `packages/mobile/node_modules` to root `node_modules`.

#### Issue: gradlew permissions on Windows
**Problem:** Git on Windows doesn't preserve Unix execute permissions.
**Solution:** CI workflow runs `chmod +x gradlew` before Android builds.

#### Issue: ESLint 9 compatibility
**Problem:** Mobile package uses `.eslintrc.js` which isn't compatible with ESLint 9's flat config.
**Solution:** Downgraded mobile package to ESLint 8.57.1.

#### Issue: Electron packaging in CI
**Problem:** electron-builder can't detect Electron version during CI builds with npm workspaces.
**Solution:** Created separate `build:ci` script that skips electron-builder. Full packaging only happens on releases.

## Current State

### All Systems Operational ✅
- Backend builds and runs successfully
- Electron desktop app builds and runs
- Mobile Android app builds successfully
- Mobile iOS app builds successfully
- All CI/CD workflows passing
- Dependabot configured and monitoring weekly

### Completed Features
- [x] User registration with validation
- [x] User login with JWT authentication
- [x] Token persistence (localStorage for Electron, AsyncStorage for mobile)
- [x] Protected routes/screens requiring authentication
- [x] User profile viewing
- [x] User profile updates
- [x] Auto-logout on invalid token
- [x] Electron auto-update configuration
- [x] System tray integration (Windows/macOS/Linux)
- [x] Configurable close/minimize behavior (close to tray vs quit)
- [x] Persistent app settings with electron-store
- [x] Settings page for user preferences
- [x] Cross-platform builds (Windows, macOS, Linux, Android, iOS)
- [x] GitHub Actions CI/CD
- [x] Dependabot automated dependency updates

### Development Workflow

#### Running Locally
```bash
# Backend (from packages/backend/)
dotnet run
# OR open StarterTemplateBackend.sln in Visual Studio and F5

# Electron (from packages/electron/)
npm run dev

# Mobile (from packages/mobile/)
npm run android  # or npm run ios
```

#### Testing the Flow
1. Start backend (port 5000)
2. Start Electron app
3. Register a new user
4. Login with credentials
5. View/update profile on Account page
6. Logout

### Dependencies (Latest Versions as of Setup)
- **React:** 19.2.0
- **Electron:** 39.2.0
- **electron-store:** 10.0.0 (settings persistence)
- **Vite:** 7.2.2
- **React Native:** 0.82.1
- **React Navigation:** 7.x
- **.NET:** 9.0
- **Entity Framework Core:** 9.0

### Important Notes for Future Development

1. **Database:** The `app.db` SQLite file is auto-created on first run. To reset, just delete it.

2. **Ports:**
   - Backend: 5000 (HTTP), 5001 (HTTPS)
   - Electron dev server: 5173
   - Mobile connects to: 10.0.2.2:5000 (Android) or localhost:5000 (iOS)

3. **JWT Secret:** Currently using "your-super-secret-key-change-this-in-production" in `appsettings.json` - MUST change for production.

4. **Auto-updates:** Configure `publish.owner` and `publish.repo` in `packages/electron/package.json` for your GitHub repo.

5. **Mobile Development:** Requires Android Studio (Android) or Xcode (iOS) for local development. CI handles builds automatically.

6. **TypeScript:** Shared package must be built (`npm run build` in shared/) before building Electron or Mobile locally.

7. **System Tray Icon:** The app currently uses a placeholder blue square icon. To customize:
   - Add a 16x16 or 32x32 PNG to `packages/electron/public/tray-icon.png`
   - For macOS, create a template image (black and transparent) named `tray-iconTemplate.png`
   - Update `createTray()` in `packages/electron/electron/main.ts` to use your icon

8. **System Tray Settings:** App behavior can be configured by developers in `packages/electron/electron/settings.ts`:
   - `closeToTray: true` - Default: closing window minimizes to tray instead of quitting
   - `minimizeToTray: true` - Default: minimize button sends to tray instead of taskbar
   - `startMinimized: false` - Default: app shows main window on startup
   - Users can override these defaults in the Settings page

## Future Enhancement Ideas

- Add password reset functionality
- Add email verification
- Add refresh tokens for better security
- Add profile pictures
- Add role-based authorization
- Migrate to PostgreSQL/MSSQL for production
- Add proper logging
- Add API rate limiting
- Add unit and integration tests
- Add E2E tests with Playwright
- Add Docker configuration
- Add Kubernetes manifests
- Migrate ESLint to v9 with flat config

## Questions or Modifications

This template is designed to be modified. Common modifications:
- Swap SQLite for another database (update connection string in `appsettings.json`)
- Add new API endpoints (add to Controllers, update shared types)
- Add new pages/screens (follow existing patterns in Electron/Mobile)
- Add new features (extend User model, add new entities)
- Update styling (currently uses basic CSS/React Native styles)

---

**Last Updated:** November 2025
**Status:** Production Ready for Rapid Prototyping
