// Basic configuration for Electron project
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("path")
const fs = require("fs")
const JSONFilePath = path.join(app.getPath("userData"), "list.json")

try {
    require("electron-reloader")(module, {
        debug: true,
        watchRenderer: true,
    })
} catch (_) {}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
          }
    })

    win.loadFile("./src/templates/index.html")

}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})


// App logic

/**
 * Triggered each time there's a change in the list. It saves the list to JSON.
 * The list is already passed as a "stringified" version of it,
 * by using list.toJSON() method.
 */
ipcMain.handle("save-list", (_, JSONlist) => {
    try {
        console.log(JSONlist)
        fs.writeFile(JSONFilePath, JSON.stringify(JSONlist), (error) => { })
        console.log("List wirtten to JSON file succesfully")
    } catch (error) {
        console.error("Error while writing to JSON file: ", error)
    }
})

/**
 * Triggered when starting the app.
 * @returns the list data from JSON file
 */
ipcMain.handle("load-list", () => {
    try {
        const data = fs.readFileSync(JSONFilePath, "utf8", (error) => {})

        if (!data.trim()) {
            console.warn("JSON file is empty")
            return []
        }

        console.log("List loaded")
        const parsedData = JSON.parse(data)
        console.log(parsedData)
        console.log(JSONFilePath)
        return parsedData
    } catch (error) {
        console.error("Error while trying to load list from JSON:", error)
        return []
    }
})
