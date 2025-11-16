# Using This Template for Your New Project

This guide walks you through the steps to use this starter template for your own project.

## Quick Start (TL;DR)

```bash
# 1. Clone and setup
git clone https://github.com/your-username/StarterTemplates.git my-new-project
cd my-new-project
rm -rf .git
git init
git add .
git commit -m "Initial commit from starter template"

# 2. Install dependencies
npm install
cd packages/shared && npm run build && cd ../..

# 3. Update configuration (see detailed steps below)
# - Change app names in all package.json files
# - Update mobile bundle IDs
# - Change JWT secret in backend
# - Update README with your project info

# 4. Start developing!
```

## Detailed Setup Process

### Step 1: Get the Template

**Option A: Clone Directly (Recommended)**
```bash
git clone https://github.com/your-username/StarterTemplates.git my-new-project
cd my-new-project
```

**Option B: Use GitHub's "Use This Template" Button**
1. Click "Use this template" on GitHub
2. Create your new repository
3. Clone your new repo

### Step 2: Remove Template Git History

Start with a clean git history for your project:

```bash
# Remove the template's git history
rm -rf .git

# Initialize fresh git repo
git init
git add .
git commit -m "Initial commit from starter template"

# Add your remote and push
git remote add origin https://github.com/your-username/your-new-project.git
git push -u origin master
```

### Step 3: Update Project Names and Branding

#### Root package.json
```bash
# Edit package.json
# Change "name" from "starter-templates" to "your-project-name"
```

#### Backend (packages/backend/)

**1. Update project name:**
- Rename `Backend.csproj` if desired (optional)
- Update `StarterTemplateBackend.sln` if you renamed the project

**2. Change JWT Secret (CRITICAL FOR SECURITY):**

Edit `packages/backend/appsettings.json`:
```json
{
  "JwtSettings": {
    "SecretKey": "YOUR-NEW-SECRET-KEY-AT-LEAST-32-CHARACTERS-LONG",
    "Issuer": "YourProjectAPI",
    "Audience": "YourProjectClients"
  }
}
```

**Generate a secure secret:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**3. Rename database (optional):**

Edit `packages/backend/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=your-app-name.db"
  }
}
```

#### Electron (packages/electron/)

**1. Update package.json:**

Edit `packages/electron/package.json`:
```json
{
  "name": "your-app-name",
  "productName": "Your App Name",
  "description": "Your app description",
  "author": "Your Name <your.email@example.com>",
  "build": {
    "appId": "com.yourcompany.yourapp",
    "productName": "Your App Name",
    "publish": {
      "provider": "github",
      "owner": "your-github-username",
      "repo": "your-repo-name"
    }
  }
}
```

**2. Update window title:**

Edit `packages/electron/index.html`:
```html
<title>Your App Name</title>
```

**3. Update navigation branding:**

Edit `packages/electron/src/pages/Home.tsx`, `Account.tsx`, `Settings.tsx`:
```tsx
<h2>Your App Name</h2>  // Replace "Starter Template"
```

**4. Replace tray icon:**
- Add your icon: `packages/electron/public/tray-icon.png` (16x16 or 32x32)
- Update `packages/electron/electron/main.ts` line 26 to use your icon

#### Mobile (packages/mobile/)

**1. Update package.json:**

Edit `packages/mobile/package.json`:
```json
{
  "name": "your-app-name",
  "displayName": "Your App Name"
}
```

**2. Update app.json:**

Edit `packages/mobile/app.json`:
```json
{
  "name": "YourAppName",
  "displayName": "Your App Name"
}
```

**3. Change Android package name:**

Edit `packages/mobile/android/app/build.gradle`:
```gradle
defaultConfig {
    applicationId "com.yourcompany.yourapp"  // Change from "com.startertemplate"
    ...
}
```

**4. Change iOS bundle identifier:**

Edit `packages/mobile/ios/mobile.xcodeproj/project.pbxproj` or use Xcode:
- Open `packages/mobile/ios/mobile.xcworkspace` in Xcode
- Select the project → Target → General
- Change "Bundle Identifier" to `com.yourcompany.yourapp`

**5. Rename Android package (optional):**

If you want to fully rename the Android package structure:
```bash
cd packages/mobile/android
# Use Android Studio's refactor tool:
# Right-click on com.startertemplate → Refactor → Rename
```

**6. Update app display name:**

Edit `packages/mobile/android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Your App Name</string>
```

Edit `packages/mobile/ios/mobile/Info.plist`:
```xml
<key>CFBundleDisplayName</key>
<string>Your App Name</string>
```

#### Shared Package (packages/shared/)

Edit `packages/shared/package.json`:
```json
{
  "name": "@your-project/shared"
}
```

### Step 4: Update Documentation

**1. Update README.md:**
- Change project title and description
- Update repository URLs in clone commands
- Add your specific features/modifications
- Update license/author information

**2. Update .claude/journal.md:**
- Replace "Original Requirements" section with your project's requirements
- Document your specific goals and features
- Keep the journal updated as you build

**3. Delete or update QUICKSTART.md** with your specific setup steps

### Step 5: Configure GitHub Settings

**1. Setup GitHub Actions Secrets (if using auto-updates):**
- Go to your repo → Settings → Secrets and variables → Actions
- Add `GH_TOKEN` (Personal Access Token with `repo` scope) for Electron auto-updates

**2. Enable GitHub Actions:**
- Go to Actions tab and enable workflows if they're disabled

**3. Configure Dependabot:**
- Already configured in `.github/dependabot.yml`
- Will automatically create PRs for dependency updates

### Step 6: Install Dependencies and Test

```bash
# From project root
npm install

# Build shared package
cd packages/shared
npm run build
cd ../..

# Test backend
cd packages/backend
dotnet run
# Should start on http://localhost:5000

# Test Electron (in new terminal)
cd packages/electron
npm run dev
# Should open app with DevTools

# Test Mobile (in new terminal)
cd packages/mobile
npm run android  # or npm run ios
```

### Step 7: Customize Icons and Assets

**Desktop (Electron):**
- Add icon files to `packages/electron/build/`:
  - `icon.png` (512x512 or larger)
  - `icon.ico` (Windows)
  - `icon.icns` (macOS)
- System tray icon: `packages/electron/public/tray-icon.png`

**Mobile:**
- **Android**: Replace icons in `packages/mobile/android/app/src/main/res/mipmap-*`
- **iOS**: Replace icons in `packages/mobile/ios/mobile/Images.xcassets/AppIcon.appiconset/`
- Consider using a tool like [App Icon Generator](https://www.appicon.co/)

### Step 8: Remove Template-Specific Files (Optional)

You might want to remove or modify:
- `.claude/` folder (keep if using Claude Code, update journal.md for your project)
- `USING-THIS-TEMPLATE.md` (this file)
- Template-specific documentation

### Step 9: First Commit to Your Repo

```bash
git add .
git commit -m "Configure project branding and settings"
git push origin master
```

## What NOT to Change (Unless You Know What You're Doing)

- Monorepo structure (`packages/` directory layout)
- Build configurations (`vite.config.ts`, `tsconfig.json`, etc.)
- CI/CD workflow files (`.github/workflows/`) - these should work out of the box
- ESLint/Prettier configurations

## Checklist

Before you start developing, make sure you've:

- [ ] Removed template git history and created fresh repo
- [ ] Updated all `package.json` files with your app name
- [ ] Changed JWT secret key in backend `appsettings.json`
- [ ] Updated mobile bundle identifiers (iOS and Android)
- [ ] Updated Electron app ID and publisher settings
- [ ] Changed database filename (optional)
- [ ] Updated README.md with your project info
- [ ] Replaced icons and branding assets
- [ ] Tested that backend, Electron, and mobile all run successfully
- [ ] Updated `.claude/journal.md` with your project requirements (if keeping)
- [ ] Pushed initial commit to your new GitHub repo
- [ ] Configured GitHub Actions secrets for auto-updates (if needed)

## Next Steps

Now you're ready to build! Here are some common next steps:

1. **Design your data model**: Add new entities to backend `Models/`
2. **Create API endpoints**: Add controllers in backend `Controllers/`
3. **Build UI**: Add pages/screens to Electron and Mobile
4. **Deploy backend**: Use Azure, AWS, Heroku, or your preferred host
5. **Distribute apps**: Submit mobile apps to stores, create Electron releases

## Getting Help

- Check the main [README.md](README.md) for detailed documentation
- Review the [QUICKSTART.md](QUICKSTART.md) for development workflow
- See `.claude/journal.md` for architecture decisions
- GitHub Actions logs for CI/CD troubleshooting

## Common Issues

**"Module not found" errors:**
- Make sure you built the shared package: `cd packages/shared && npm run build`

**Backend won't start:**
- Verify .NET 9 SDK is installed: `dotnet --version`
- Check that ports 5000/5001 aren't already in use

**Mobile app won't build:**
- Android: Make sure Android Studio and SDK are installed
- iOS: Make sure Xcode and CocoaPods are installed
- Clear cache: `npm start -- --reset-cache`

---

**Happy building!** You're now ready to turn this template into your amazing app.
