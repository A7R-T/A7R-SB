//preload.js
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI' , {
    saveNote: (title, content) => ipcRenderer.invoke('save-note' , {title, content}),
    loadNotes: () => ipcRenderer.invoke('load-notes'),
    updateNote: (id, title, content) => ipcRenderer.invoke('update-note' , {id, title, content}),
    deleteNote: (id) => ipcRenderer.invoke('delete-note' , id)
});

