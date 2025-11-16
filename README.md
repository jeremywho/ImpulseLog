# Starter Template

A comprehensive full-stack starter template featuring Electron (desktop), React Native (mobile), and .NET (backend) with user authentication.

> **🚀 New Project?** See [USING-THIS-TEMPLATE.md](USING-THIS-TEMPLATE.md) for a complete guide on using this template for your own project.

## Features

- **Monorepo Structure**: All projects in a single repository with npm workspaces
- **Cross-Platform Desktop**: Electron app with React, TypeScript, and Vite
- **System Tray Integration**: Desktop app runs in system tray with configurable close behavior
- **Persistent Settings**: User preferences saved with electron-store
- **Mobile Apps**: React Native for iOS and Android
- **Backend API**: .NET 9 with SQLite, Entity Framework Core, and JWT authentication
- **Shared Code**: TypeScript types and API client shared between frontend apps
- **Auto-Updates**: Electron auto-update support via GitHub Releases
- **CI/CD**: GitHub Actions workflows for automated builds, tests, and releases
- **Dependency Management**: Automated updates via GitHub Dependabot
- **Latest Packages**: All dependencies use their latest stable versions

## Tech Stack

### Desktop (Electron)
- Electron 39
- React 19
- TypeScript 5.7
- Vite 7
- React Router 7
- electron-updater for auto-updates
- electron-store for persistent settings

### Mobile (React Native)
- React Native 0.82
- TypeScript 5.8
- React Navigation 7
- AsyncStorage for local storage

### Backend (.NET)
- .NET 9
- ASP.NET Core Web API
- Entity Framework Core 9
- SQLite (easily swappable to SQL Server/PostgreSQL)
- JWT Authentication
- BCrypt for password hashing

### Shared
- TypeScript 5.7
- Shared types and API client

## Project Structure

```
StarterTemplates/
├── packages/
│   ├── backend/          # .NET Web API
│   ├── electron/         # Electron desktop app
│   ├── mobile/           # React Native mobile app
│   └── shared/           # Shared TypeScript code
├── .github/
│   ├── workflows/        # CI/CD (optional)
│   └── dependabot.yml    # Automated dependency updates
├── package.json          # Root workspace config
└── README.md
```

## Prerequisites

### All Platforms
- Node.js 20+
- npm or pnpm
- .NET 9 SDK
- Git

### For Electron Development
- All prerequisites above

### For React Native Development (Additional)
- **iOS Development:**
  - macOS
  - Xcode 15+
  - CocoaPods
- **Android Development:**
  - Android Studio
  - Android SDK (API 34+)
  - Java Development Kit (JDK 17+)

## Getting Started

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/starter-templates.git
cd StarterTemplates

# Install all dependencies
npm install

# Build shared package
cd packages/shared
npm run build
cd ../..
```

### 2. Running the Backend

```bash
# Navigate to backend directory
cd packages/backend

# Run the backend (listens on http://localhost:5000)
dotnet run

# Or use the root script
npm run backend
```

The backend will automatically:
- Create the SQLite database (`app.db`) if it doesn't exist
- Run on `http://localhost:5000`
- Enable CORS for development

### 3. Running the Electron App

```bash
# In a new terminal
cd packages/electron

# Install dependencies if you haven't already
npm install

# Run in development mode
npm run dev

# Or use the root script
npm run electron
```

The Electron app will connect to the backend at `http://localhost:5000`.

### 4. Running the React Native App

#### Android

```bash
# In a new terminal
cd packages/mobile

# Install dependencies
npm install

# Start Metro bundler
npm start

# In another terminal, run Android app
npm run android

# Or use the root script
npm run mobile:android
```

**Note:** Update the API URL in `packages/mobile/src/contexts/AuthContext.tsx`:
- For Android Emulator: `http://10.0.2.2:5000`
- For iOS Simulator: `http://localhost:5000`
- For Physical Device: `http://YOUR_COMPUTER_IP:5000`

#### iOS (macOS only)

```bash
# Install CocoaPods dependencies
cd packages/mobile/ios
pod install
cd ..

# Run iOS app
npm run ios

# Or use the root script
npm run mobile:ios
```

## Building for Production

### Electron

```bash
cd packages/electron
npm run build
```

This will create distributables in `packages/electron/release/`:
- **macOS**: `.dmg` and `.zip`
- **Windows**: `.exe` (NSIS installer) and portable `.exe`
- **Linux**: `.AppImage` and `.deb`

### React Native

#### Android

```bash
cd packages/mobile

# Create release APK
npm run build:android

# Or create AAB for Play Store
cd android
./gradlew bundleRelease
```

#### iOS

```bash
cd packages/mobile

# Open in Xcode
open ios/mobile.xcworkspace

# Create archive via Xcode:
# Product > Archive > Distribute App
```

## Auto-Updates (Electron)

The Electron app is configured to use `electron-updater` with GitHub Releases:

1. **Configure GitHub Repository**: Update `packages/electron/package.json`:
   ```json
   "build": {
     "publish": {
       "provider": "github",
       "owner": "your-github-username",
       "repo": "starter-templates"
     }
   }
   ```

2. **Create GitHub Release**: After building, create a GitHub release and upload the build artifacts

3. **Auto-Update**: The app will automatically check for updates on launch and notify users

## Dependency Updates

This project uses GitHub Dependabot for automated dependency updates:

- Runs weekly every Monday
- Creates PRs for dependency updates
- Groups dependencies by type (development/production)
- Covers all packages: npm (frontend) and NuGet (backend)

### Manual Updates

You can also manually update dependencies:

```bash
# Update all npm packages
npm update --workspaces

# Update .NET packages
cd packages/backend
dotnet list package --outdated
dotnet add package <PackageName>
```

## CI/CD (GitHub Actions)

This project includes comprehensive GitHub Actions workflows for continuous integration and deployment. All workflows run automatically on push/PR and are **free** for public repos (2,000 free minutes/month for private repos).

### Automated Workflows

**Backend CI** - Builds and tests .NET backend
- ✅ Builds on every push to backend files
- ✅ Runs unit tests
- ✅ Checks for security vulnerabilities

**Electron CI** - Builds desktop app for all platforms
- ✅ Builds on Ubuntu, macOS, and Windows
- ✅ Validates TypeScript compilation
- ✅ Creates build artifacts

**Mobile CI** - Builds React Native apps
- ✅ Lints and tests JavaScript/TypeScript
- ✅ Builds Android APK
- ✅ Builds iOS app for simulator

**Code Quality** - Security and quality checks
- ✅ Runs npm audit on all packages
- ✅ Checks for dependency vulnerabilities
- ✅ Validates TypeScript across all packages
- ✅ Runs weekly on schedule

**Release** - Automated releases on git tags
- ✅ Creates GitHub releases
- ✅ Builds Electron for all platforms
- ✅ Uploads installers to release
- ✅ Enables auto-updates

### Creating a Release

To trigger an automated release with installers:

```bash
# Tag your commit
git tag v1.0.0
git push origin v1.0.0
```

This automatically builds and publishes Electron installers for Linux, macOS, and Windows.

### Viewing Build Status

Check the **Actions** tab in your GitHub repository to see workflow runs, download artifacts, and view logs.

For detailed CI/CD documentation, see [.github/workflows/README.md](.github/workflows/README.md)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Management (Authenticated)
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user

## Configuration

### Backend Configuration

Edit `packages/backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=app.db"
  },
  "JwtSettings": {
    "SecretKey": "YourSecretKey_ChangeInProduction",
    "Issuer": "StarterTemplateAPI",
    "Audience": "StarterTemplateClients"
  }
}
```

**Important**: Change the JWT secret key in production and keep it secure.

### Switching Database

To switch from SQLite to SQL Server or PostgreSQL:

1. Install the appropriate EF Core package:
   ```bash
   cd packages/backend
   # For SQL Server
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer

   # For PostgreSQL
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
   ```

2. Update `Program.cs`:
   ```csharp
   // For SQL Server
   builder.Services.AddDbContext<AppDbContext>(options =>
       options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

   // For PostgreSQL
   builder.Services.AddDbContext<AppDbContext>(options =>
       options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
   ```

3. Update connection string in `appsettings.json`

## User System

The starter template includes a complete user system:

- User registration with email validation
- Secure password hashing (BCrypt)
- JWT-based authentication
- User profile management (email, full name, password)
- Protected routes/screens
- Token persistence (localStorage for Electron, AsyncStorage for mobile)

## System Tray & Settings

The Electron desktop app includes system tray functionality:

### System Tray Features
- **Always accessible**: Icon in taskbar (Windows), menu bar (macOS), or system tray (Linux)
- **Click interactions**:
  - Windows: Single click to show/hide window
  - macOS/Linux: Double-click to show window
- **Context menu**: Right-click for "Show App" and "Quit" options
- **Background operation**: App can continue running when window is closed

### User Settings
Users can configure app behavior in the Settings page:
- **Close to tray**: When enabled, closing the window minimizes to tray instead of quitting
- **Minimize to tray**: Controls minimize button behavior
- **Start minimized**: App starts in tray without showing main window

### Developer Configuration
Default behaviors can be set in `packages/electron/electron/settings.ts`:
```typescript
export const defaultSettings: AppSettings = {
  minimizeToTray: true,
  startMinimized: false,
  closeToTray: true, // Default: close to tray instead of quit
};
```

### Customizing the Tray Icon
1. Add a 16x16 or 32x32 PNG to `packages/electron/public/tray-icon.png`
2. For macOS, create a template image (black and transparent) named `tray-iconTemplate.png`
3. Update `createTray()` in `packages/electron/electron/main.ts` to use your icon

## Development Tips

### Hot Reload
- **Electron**: Vite provides instant HMR for the renderer process
- **React Native**: Metro bundler provides fast refresh
- **.NET**: Use `dotnet watch run` for hot reload

### Debugging
- **Electron**: DevTools open automatically in a separate window during development (can also open with F12)
- **React Native**: Use React Native Debugger or Flipper
- **.NET**: Use Visual Studio or VS Code with C# extension

### Common Issues

1. **React Native Metro bundler cache**: Clear with `npm start -- --reset-cache`
2. **Electron build failing**: Delete `node_modules` and `package-lock.json`, then reinstall
3. **.NET database issues**: Delete `app.db` and restart the backend

## Contributing

Feel free to customize this template for your needs:

1. Update branding (app name, icons, etc.)
2. Add new features
3. Customize UI/UX
4. Add additional API endpoints
5. Integrate third-party services

## License

MIT License - feel free to use this template for any project.

## Using This Template for Your Project

Ready to build your own app with this template? Follow the complete setup guide:

**📖 [USING-THIS-TEMPLATE.md](USING-THIS-TEMPLATE.md)** - Complete guide covering:
- Removing template git history
- Updating all app names and bundle IDs
- Changing security settings (JWT secret)
- Customizing icons and branding
- Configuring GitHub for auto-updates
- Step-by-step checklist

## Next Steps

After setting up the template:

1. **Customize Configuration**: Update app names, IDs, and branding (see guide above)
2. **Add Features**: Build on top of the user system
3. **Deploy Backend**: Deploy to Azure, AWS, or your preferred hosting
4. **Publish Apps**: Submit to App Store, Play Store, or distribute Electron builds

## Support

For issues or questions:
- Check the documentation for each technology
- Review the code comments
- Search for similar issues online

---

**Happy coding!** This template is designed to help you rapidly build and test new project ideas.
