import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { settingsStore, AppSettings } from './settings';

let mainWindow: BrowserWindow | null = null;
let quickEntryWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

// Auto-updater configuration
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function createTray() {
  // Create a visible tray icon
  // TODO: Replace with your app's icon by:
  // 1. Adding a 16x16 or 32x32 PNG to packages/electron/public/tray-icon.png
  // 2. For macOS, use a template image (black and transparent) named tray-iconTemplate.png
  // 3. Uncomment the line below to use your custom icon:
  // const icon = nativeImage.createFromPath(path.join(__dirname, '../public/tray-icon.png'));
  //
  // For now, create a simple 16x16 colored square as a placeholder
  const size = 16;
  const bytesPerPixel = 4; // RGBA
  const buffer = Buffer.alloc(size * size * bytesPerPixel);

  // Fill with a blue color (RGBA: 33, 150, 243, 255)
  for (let i = 0; i < buffer.length; i += bytesPerPixel) {
    buffer[i] = 33; // R
    buffer[i + 1] = 150; // G
    buffer[i + 2] = 243; // B
    buffer[i + 3] = 255; // A (fully opaque)
  }

  const icon = nativeImage.createFromBitmap(buffer, {
    width: size,
    height: size,
  });
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('ImpulseLog - Track Your Impulses');
  tray.setContextMenu(contextMenu);

  // Single click to show/hide on Windows, double click on macOS
  tray.on('click', () => {
    if (process.platform === 'win32') {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      } else {
        createWindow();
      }
    }
  });

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
}

function createWindow() {
  const settings = settingsStore.store;

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: !settings.startMinimized, // Don't show window if startMinimized is true
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Open DevTools in a separate window
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window close event based on user settings
  mainWindow.on('close', (event) => {
    const settings = settingsStore.store;

    if (settings.closeToTray && !isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Check for updates after window is created (production only)
  if (!process.env.VITE_DEV_SERVER_URL) {
    checkForUpdates();
  }
}

function createQuickEntryWindow() {
  if (quickEntryWindow) {
    quickEntryWindow.show();
    quickEntryWindow.focus();
    return;
  }

  quickEntryWindow = new BrowserWindow({
    width: 500,
    height: 400,
    frame: false,
    center: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    quickEntryWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/quick-entry`);
  } else {
    quickEntryWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: '/quick-entry'
    });
  }

  quickEntryWindow.on('blur', () => {
    // Hide window when it loses focus
    quickEntryWindow?.hide();
  });

  quickEntryWindow.on('closed', () => {
    quickEntryWindow = null;
  });
}

function registerGlobalShortcut() {
  // Register Ctrl+Shift+I for quick entry
  const ret = globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (quickEntryWindow) {
      if (quickEntryWindow.isVisible()) {
        quickEntryWindow.hide();
      } else {
        quickEntryWindow.show();
        quickEntryWindow.focus();
      }
    } else {
      createQuickEntryWindow();
    }
  });

  if (!ret) {
    console.log('Global shortcut registration failed');
  }
}

function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    console.log('Update available');
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded');
    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded');
    }
  });
}

// IPC handlers for settings management
ipcMain.handle('get-settings', () => {
  return settingsStore.store;
});

ipcMain.handle('set-settings', (_event, settings: Partial<AppSettings>) => {
  Object.assign(settingsStore.store, settings);
  return settingsStore.store;
});

ipcMain.handle('reset-settings', () => {
  settingsStore.clear();
  return settingsStore.store;
});

app.whenReady().then(() => {
  createTray();
  createWindow();
  registerGlobalShortcut();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  const settings = settingsStore.store;

  // If closeToTray is enabled, don't quit when all windows are closed
  if (!settings.closeToTray && process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('will-quit', () => {
  // Unregister all global shortcuts
  globalShortcut.unregisterAll();
});
