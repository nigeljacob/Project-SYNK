const { Tray, app, BrowserWindow, Menu, ipcMain, Notification, dialog } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");
const {getappsfunc} = require('../../Backend/src/electronFunctions/viewTaskFunctions')
const {checkActiveApplication, getCurrentlyActiveApplication, openFileDialog} = require('../../Backend/src/electronFunctions/ProgressTrackerFunctions')

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
    icon: path.join(__dirname, "icon.png"),
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
  splashScreen.setIcon(path.join(__dirname, "icon.png"));
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

  win.on('close', e => { // Line 49
    e.preventDefault()
    dialog.showMessageBox({
      type: 'info',
      buttons: ['No', 'Yes'],
      cancelId: 1,
      defaultId: 0,
      icon: path.join(__dirname, "icon.png"),
      title: 'Are you sure ?',
      detail: 'Are you sure you want to quit SYNK'
    }).then(({ response, checkboxChecked }) => {
      console.log(`response: ${response}`)
      if (response === 1) {
        win.hide()
        win.webContents.send("statusUpdate", "Offline")
        ipcMain.on("statusUpdated", (event, data) => {
          win.destroy()
          app.quit()
        })
      }
    })
  })

  ipcMain.on('showAlertBox', (event, message) => {
    dialog.showErrorBox(message[0], message[1])
  })

  ipcMain.on('showConfirmBox', (event, message) => {
    dialog.showMessageBox({
      type: 'info',
      buttons: ['No', 'Yes'],
      cancelId: 1,
      defaultId: 0,
      icon: path.join(__dirname, "icon.png"),
      title: message[0],
      detail: message[1]
    }).then(({ response, checkboxChecked }) => {
      console.log(`response: ${response}`)
      if (response === 1) {
        win.webContents.send("YesClicked", true)
      }
    })
    })

  ipcMain.on('viewTask', (event, message) => {
    console.log('Received message from renderer process:', );
    getappsfunc()
    .then(appsList =>{
      console.log(appsList)
      win.webContents.send("texsssst", appsList)
    })
    .catch(error => console.error("Error:", error));


  //   zipFolder('../ViewTaskComponent', "../")
  //   .then(() => {
  //       console.log('Folder zipped successfully.');
  //   })
  //   .catch((error) => {
  //       console.error('Error zipping folder:', error);
  //   });
  });

  ipcMain.on("openFileDialog", (event, message) => {
    openFileDialog()
  .then((filePath) => {
    if (filePath) {
      console.log('Selected file:', filePath);
      win.webContents.send("filePath", filePath)
    } else {
      console.log('No file selected.');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  })

  ipcMain.on("notification", (event, notification) => {
    const NOTIFICATION_TITLE = notification[0]
    const NOTIFICATION_BODY = notification[1]    

    new Notification({
      title: NOTIFICATION_TITLE,
      body: NOTIFICATION_BODY,
      icon: path.join(__dirname, "icon.png")
    }).show()

  })

}


app.on("ready", createWindow);

app.dock.setIcon(path.join(__dirname, "icon.png"))


app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length == 0) createWindow();
});
