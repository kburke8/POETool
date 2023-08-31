// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

console.log("Setting up context bridge");

contextBridge.exposeInMainWorld('electronAPI', {
    retrievePrices: (league: string) => ipcRenderer.invoke('retrieve-prices', league),
    retrieveDivinePrices: (league: string) => ipcRenderer.invoke('retrieve-divine-prices', league)
  })