const { Tray, app, BrowserWindow, Menu, ipcMain, contextBridge } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");
const {getappsfunc} = require('../../Backend/src/electronFunctions/viewTaskFunctions')

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1500,
    defaultHeight: 800,
  });

  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1300,
    title: "SYNK",
    minHeight: 600,
    // titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(0,0,0,0)",
      symbolColor: "#ffffff",
    },
    // frame: false,
    show: false,
    icon: "/logo.png",
    webPreferences: {
      webSecurity: false,
      enableRemoteModule: true,
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    },
  });

  const splashScreen = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    resizable: false,

    webPreferences: {
      webSecurity: false,
    },
  });

  splashScreen.loadFile("./public/preload.html");
  splashScreen.setIcon(path.join(__dirname, "logo.png"));
  splashScreen.center();
  splashScreen.show();

  win.setBackgroundColor("#1e1e1e");
  // win.setMenu(null);

  setTimeout(function () {
    splashScreen.close();
    win.loadURL("http://localhost:3000");
    win.setIcon(path.join(__dirname, "logo.png"));
    win.show();
  }, 7000);

  ipcMain.on('viewTask', (event, message) => {
    // console.log('Received message from renderer process:', );
    getappsfunc()
    .then(appsList =>{
      console.log(appsList)
      win.webContents.send("texsssst", appsList)
    })
    .catch(error => console.error("Error:", error));



  });

}

app.on("ready", createWindow);


app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length == 0) createWindow();
});
