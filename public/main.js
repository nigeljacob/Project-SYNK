const { app, BrowserWindow } = require("electron");
const { useEffect } = require("react");
const windowStateKeeper = require('electron-window-state');


function createWindow() {

  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });

  const win = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    title: "SYNK",
    minHeight: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    frame: false,
    show: false,
    icon: '/loader.gif',
    webPreferences: {
      enableRemoteModule: true,
      contextIsolation: true, 
      nodeIntegration: false,
    },
  });

  const splashScreen = new BrowserWindow({
    width: 500, 
    height: 300, 
    frame: false, 
    alwaysOnTop: true,
    resizable: false,

    webPreferences: {
      webSecurity: false
    }
});

  splashScreen.loadFile("./public/preload.html");
  splashScreen.setIcon("./public/logo.png");
  splashScreen.center();
  splashScreen.show();

  win.setBackgroundColor('#1e1e1e');
  win.setMenu(null);
  win.setIcon("./public/logo.png");

  setTimeout(function () {
    splashScreen.close();
    win.loadURL("http://localhost:3000");
    win.show();
  }, 7000);

}

function getSize(name) {
  if(name == "width") {
    try{
      return localStorage.getItem("width");
    } catch(e) {
      return 1000;
    }
  } else {
    try{
      return localStorage.getItem("height");
    } catch(e) {
      return 800;
    }
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length == 0) createWindow();
});
