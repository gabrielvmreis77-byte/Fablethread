const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs/promises')

const isDev = !app.isPackaged
const dataFile = () => path.join(app.getPath('userData'), 'library.json')
const legacyDataFile = () => path.join(app.getPath('appData'), 'no-de-tinta', 'biblioteca.json')

async function readLibrary() {
  try { return JSON.parse(await fs.readFile(dataFile(), 'utf8')) }
  catch (error) {
    if (error.code === 'ENOENT') {
      try { return JSON.parse(await fs.readFile(legacyDataFile(), 'utf8')) }
      catch (legacyError) {
        if (legacyError.code === 'ENOENT') return null
        throw legacyError
      }
    }
    throw error
  }
}

async function writeLibrary(data) {
  const target = dataFile()
  const temp = `${target}.tmp`
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(temp, JSON.stringify(data, null, 2), 'utf8')
  await fs.rename(temp, target)
  return true
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 1060, minHeight: 680,
    backgroundColor: '#f6f0e7', title: 'Fablethread',
    icon: path.join(__dirname, '..', 'public', 'brand.png'),
    titleBarStyle: 'hidden', titleBarOverlay: { color: '#17253d', symbolColor: '#f6f0e7', height: 38 },
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  })
  if (isDev) win.loadURL('http://localhost:5173')
  else win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
}

ipcMain.handle('library:load', readLibrary)
ipcMain.handle('library:save', (_, data) => writeLibrary(data))
ipcMain.handle('book:export', async (_, { title, markdown }) => {
  const result = await dialog.showSaveDialog({ title: 'Export manuscript', defaultPath: `${title.replace(/[<>:"/\\|?*]/g, '-')}.md`, filters: [{ name: 'Markdown', extensions: ['md'] }, { name: 'Text', extensions: ['txt'] }] })
  if (result.canceled || !result.filePath) return null
  await fs.writeFile(result.filePath, markdown, 'utf8')
  shell.showItemInFolder(result.filePath)
  return result.filePath
})

app.whenReady().then(() => { createWindow(); app.on('activate', () => BrowserWindow.getAllWindows().length || createWindow()) })
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
