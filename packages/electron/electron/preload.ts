import { contextBridge, ipcRenderer } from 'electron';

export interface AppSettings {
  minimizeToTray: boolean;
  startMinimized: boolean;
  closeToTray: boolean;
}

contextBridge.exposeInMainWorld('electron', {
  onUpdateDownloaded: (callback: () => void) => {
    ipcRenderer.on('update-downloaded', callback);
  },
  removeUpdateListener: () => {
    ipcRenderer.removeAllListeners('update-downloaded');
  },
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke('get-settings'),
    set: (settings: Partial<AppSettings>): Promise<AppSettings> =>
      ipcRenderer.invoke('set-settings', settings),
    reset: (): Promise<AppSettings> => ipcRenderer.invoke('reset-settings'),
  },
});
