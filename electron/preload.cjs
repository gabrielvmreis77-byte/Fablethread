const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('noDeTinta', {
  load: () => ipcRenderer.invoke('library:load'),
  save: (data) => ipcRenderer.invoke('library:save', data),
  exportBook: (payload) => ipcRenderer.invoke('book:export', payload)
})
