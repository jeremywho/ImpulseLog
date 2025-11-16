export interface AppSettings {
  minimizeToTray: boolean;
  startMinimized: boolean;
  closeToTray: boolean;
}

export interface ElectronAPI {
  onUpdateDownloaded: (callback: () => void) => void;
  removeUpdateListener: () => void;
  settings: {
    get: () => Promise<AppSettings>;
    set: (settings: Partial<AppSettings>) => Promise<AppSettings>;
    reset: () => Promise<AppSettings>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
