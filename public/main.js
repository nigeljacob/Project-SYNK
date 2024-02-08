const { Tray, app, BrowserWindow, Menu } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1000,
    title: "SYNK",
    minHeight: 600,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(0,0,0,0)",
      symbolColor: "#ffffff",
    },
    frame: false,
    show: false,
    icon: "/logo.png",
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
      webSecurity: false,
    },
  });

  splashScreen.loadFile("./public/preload.html");
  splashScreen.setIcon(path.join(__dirname, "logo.png"));
  splashScreen.center();
  splashScreen.show();

  win.setBackgroundColor("#1e1e1e");
  win.setMenu(null);

  setTimeout(function () {
    splashScreen.close();
    win.loadURL("http://localhost:3000");
    win.setIcon(path.join(__dirname, "logo.png"));
    win.show();
  }, 7000);

}

app.on("ready", createWindow);

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length == 0) createWindow();
});
