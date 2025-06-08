const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getLyrics, getStatus } = require('./lyrics');

ipcMain.handle('get-lyrics', async () => {
  const result = await getLyrics();
  return result;
});

ipcMain.handle('get-status', async () => {
  const result = await getStatus();
  return result;
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 300,
    height: 200,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('renderer.html');
}

app.whenReady().then(createWindow);