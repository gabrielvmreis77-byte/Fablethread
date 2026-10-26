const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('fablethread', {
  load: () => ipcRenderer.invoke('library:load'),
  save: (data) => ipcRenderer.invoke('library:save', data),
  exportBook: (payload) => ipcRenderer.invoke('book:export', payload)
})
