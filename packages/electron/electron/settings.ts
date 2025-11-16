import Store from 'electron-store';

export interface AppSettings {
  minimizeToTray: boolean;
  startMinimized: boolean;
  closeToTray: boolean;
}

export const defaultSettings: AppSettings = {
  minimizeToTray: true,
  startMinimized: false,
  closeToTray: true, // Default: closing window minimizes to tray instead of quitting
};

export const settingsStore = new Store<AppSettings>({
  defaults: defaultSettings,
  name: 'app-settings',
});
