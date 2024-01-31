const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 600,
    title: "SYNK",
    minHeight: 400,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
    },
  });

  win.loadURL("http://localhost:3000");
  win.setBackgroundColor('#1e1e1e');
  win.setMenu(null);
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
