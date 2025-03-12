const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
    sendMessage: (channel, data) => ipcRenderer.send(channel, data),
    onMessage: (channel, callback) => ipcRenderer.on(channel, callback),
    saveList: (list) => ipcRenderer.invoke("save-list", list),
    loadList: () => ipcRenderer.invoke("load-list")
})
