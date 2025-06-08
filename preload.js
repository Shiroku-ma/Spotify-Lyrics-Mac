const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getLyrics: () => ipcRenderer.invoke('get-lyrics'),
  getStatus: () => ipcRenderer.invoke('get-status')
});