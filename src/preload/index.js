import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  indexPage: (pageNumber = null, totalPageCount = null) => ipcRenderer.invoke('indexPage', pageNumber, totalPageCount),
  openExternalUrl: (url) => shell.openExternal(url),
  saveRows: (rows) => ipcRenderer.invoke('saveRows', rows),
  loadRows: (rows) => ipcRenderer.invoke('loadRows'),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
