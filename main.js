//main.js
const {app , BrowserWindow, ipcMain} = require('electron');
const {saveNote, loadNotes, updateNote} = require('./database.js')

function CreateWindow () {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {nodeIntegration: true, preload: __dirname + '/preload.js', contextIsolation: true}
});
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    CreateWindow ();
    app.on('activate', () => {if (BrowserWindow.getAllWindows().length === 0) CreateWindow()})
});

ipcMain.handle('save-note', (event, data) => {
    return saveNote(data.title, data.content);
});

ipcMain.handle('load-notes', () => {return loadNotes();});

ipcMain.handle('update-note', (event, data) => {
    updateNote(data.id, data.title, data.content);
});

app.on('window-all-closed', () => {if (process.platform !== 'darwin') app.quit()})