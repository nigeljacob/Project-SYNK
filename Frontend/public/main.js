const {
  Tray,
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  Notification,
  dialog,
  screen
} = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");
const {
  getappsfunc,
} = require("../../Backend/src/electronFunctions/viewTaskFunctions");
const os = require("node:os");
const {
  checkActiveApplication,
  getCurrentlyActiveApplication,
  openFileDialog,
  sendSignalwithzip,
  createZipFromFolder,
  uploadFileToWordPress,
  createZipAndUpload,
  getFocusedWindow,
  idleDetection,
  trackLastModified,
  getDateTime
} = require("../../Backend/src/electronFunctions/ProgressTrackerFunctions");
const { WindIcon } = require("lucide-react");

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1500,
    defaultHeight: 800,
  });

  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();
  const primaryDisplayBounds = primaryDisplay.bounds;

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
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const splashScreen = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    x: mainWindowState.x,
    y: mainWindowState.y,
    alwaysOnTop: true,
    resizable: false,
    fullscreen: false,

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
    // if(os.platform() != "darwin") {
    //   win.setSimpleFullScreen(true)
    // }
  }, 7000);

  win.on("close", (e) => {
    // Line 49
    e.preventDefault();
    dialog
      .showMessageBox({
        type: "info",
        buttons: ["No", "Yes"],
        cancelId: 1,
        defaultId: 0,
        icon: path.join(__dirname, "icon.png"),
        title: "Are you sure ?",
        detail: "Are you sure you want to quit SYNK",
      })
      .then(({ response, checkboxChecked }) => {
        console.log(`response: ${response}`);
        if (response === 1) {
          win.hide();
          win.webContents.send("statusUpdate", "Offline");
          ipcMain.on("statusUpdated", (event, data) => {
            win.destroy();
            app.quit();
          });
        }
      });
  });

  ipcMain.on("showAlertBox", (event, message) => {
    dialog.showErrorBox(message[0], message[1]);
  });

  ipcMain.on("showConfirmBox", (event, message) => {
    dialog
      .showMessageBox({
        type: "info",
        buttons: ["No", "Yes"],
        cancelId: 1,
        defaultId: 0,
        icon: path.join(__dirname, "icon.png"),
        title: message[0],
        detail: message[1],
      })
      .then(({ response, checkboxChecked }) => {
        console.log(`response: ${response}`);
        if (response === 1) {
          win.webContents.send("YesClicked", true);
        }
      });
  });

  ipcMain.on("viewTask", (event, message) => {
    // console.log("Received message from renderer process:");
    getappsfunc()
      .then((appsList) => {
        // console.log(appsList);
        win.webContents.send("texsssst", appsList);
      })
      .catch((error) => console.error("Error:", error));
  });

  ipcMain.on("openFileDialog", (event, message) => {
    openFileDialog()
      .then((filePath) => {
        if (filePath) {
          console.log("Selected file:", filePath);
          //   createZipAndUpload(filePath, filePath)
          // .then(() => {
          //     console.log('Zip file created and uploaded successfully.');
          // })
          // .catch(error => {
          //     console.error('Error:', error);
          // });
          win.webContents.send("filePath", filePath);
        } else {
          console.log("No file selected.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  ipcMain.on("notification", (event, notification) => {
    const NOTIFICATION_TITLE = notification[0];
    const NOTIFICATION_BODY = notification[1];

    new Notification({
      title: NOTIFICATION_TITLE,
      body: NOTIFICATION_BODY,
      icon: path.join(__dirname, "icon.png"),
    }).show();
  });

  let idlePopupShown = false;

  let lastModifiedPopupShown = false;

  let idlePopup;

  let lastModifiedPopup;

  let appTrackingInterval;

  let idleTrackingInterval;

  let lastModifiedInterval;

  let trackedApplications = [];

  let currentlyTrackingApplication = {};

  let isCurrentApp = false;

  let folderChanged = false;

  let folderPath;

  let savePopupCount = 0

  let LAST_MODIFIED_INTERVAL_TIME = 30000

  ipcMain.on("sendStartTask", (event, Task) => {
    // start tracking the windows
    currentlyTrackingApplication = {};

    console.log(currentlyTrackingApplication);

    trackedApplications = [];

    let taskApplications = Task.task.applicationsList

    let idleDetected = false;

    isCurrentApp = false;

    folderPath = Task.task.filePath

    trackLastModified(folderPath , "start", (data) => {
      if(data === "updated") {
        folderChanged = true
      } else {
        dialog.showErrorBox("Ünable to find Task Folder", "The task folder was not found in the specified path: " + folderPath);
        clearInterval(idleTrackingInterval)
        clearInterval(appTrackingInterval)
        clearInterval(lastModifiedInterval)
        trackLastModified(folderPath, "stop", null)
        win.webContents.send("sendIntervalsPaused", trackedApplications)
        trackedApplications = []
        currentlyTrackingApplication = {}
        return
      }
    })

    lastModifiedInterval = setInterval(() => {
        if(folderChanged) {

          // let dateTime = getDateTime()

          // let folderName = Task.team + "_" + Task.team.teamMemberList[Task.teamMemberIndex].UID + "_" + dateTime[0] + "_" + dateTime[1]

          // createZipAndUpload(folderPath, folderName)
          // .then(() => {
          //     console.log('Zip file created and uploaded successfully.');
          // })
          // .catch(error => {
          //     console.error('Error:', error);
          // });

          console.log("upload")
          savePopupCount = 0
          folderChanged = false
          if(LAST_MODIFIED_INTERVAL_TIME === 10000) {
            LAST_MODIFIED_INTERVAL_TIME === 30000
          }
        } else {
          if(savePopupCount < 0) {
            if(!lastModifiedPopupShown) {
              lastModifiedPopup = new BrowserWindow({
                width: 500,
                height: 300,
                x: mainWindowState.x,
                y: mainWindowState.y,
                frame: false,
                alwaysOnTop: true,
                resizable: false,
                transparent: true,
    
                webPreferences: {
                  webSecurity: false,
                  enableRemoteModule: true,
                  contextIsolation: true,
                  nodeIntegration: false,
                  preload: path.join(__dirname, "preload.js"),
                },
              });
    
              lastModifiedPopup.loadFile("./public/Popups/lastModifiedPopup.html");
              lastModifiedPopup.setIcon(path.join(__dirname, "icon.png"));
              lastModifiedPopup.center();
              lastModifiedPopup.show();
  
              lastModifiedPopupShown = true
  
              LAST_MODIFIED_INTERVAL_TIME = 10000
              savePopupCount++
            }

          } else {
            if(!lastModifiedPopupShown) {
              lastModifiedPopup = new BrowserWindow({
                width: 500,
                height: 300,
                x: mainWindowState.x,
                y: mainWindowState.y,
                frame: false,
                alwaysOnTop: true,
                resizable: false,
                transparent: true,
    
                webPreferences: {
                  webSecurity: false,
                  enableRemoteModule: true,
                  contextIsolation: true,
                  nodeIntegration: false,
                  preload: path.join(__dirname, "preload.js"),
                },
              });
    
              lastModifiedPopup.loadFile("./public/Popups/noWorkPopup.html");
              lastModifiedPopup.setIcon(path.join(__dirname, "icon.png"));
              lastModifiedPopup.center();
              lastModifiedPopup.show();
  
              lastModifiedPopupShown = true
  
              LAST_MODIFIED_INTERVAL_TIME = 10000
            }
          }
      }
    }, LAST_MODIFIED_INTERVAL_TIME)

    appTrackingInterval = setInterval(() => {
      let currentWindow = getFocusedWindow();
        if(!idleDetected) {
          idleDetection("start", (data) => {
            // console.log("detected");
            idleDetected = true
            if(idlePopupShown) {
              idlePopup.destroy()
              idlePopupShown = false
            }
          })
        } else {
          idleDetection("stop", (data) => {
            // console.log("stopped")
          })
        }
        if(trackedApplications.length > 0) {
          if (currentlyTrackingApplication.appName !== currentWindow.info.name && !currentlyTrackingApplication.appName.includes(currentWindow.info.name) && !currentWindow.info.name.includes(currentlyTrackingApplication.appName)) {

            if(isCurrentApp) {
              console.log("dhiujhdk");
              if(taskApplications.some((appItem) => appItem.name.includes(currentlyTrackingApplication.appName) ||  currentlyTrackingApplication.appName.includes(appItem.name))) {
                currentlyTrackingApplication.endTime = new Date();
                let difference = currentlyTrackingApplication.endTime - currentlyTrackingApplication.startTime;
                currentlyTrackingApplication.duration = currentlyTrackingApplication.duration + difference;
                
                let oldIndex = trackedApplications.findIndex((app) => app.appName === currentlyTrackingApplication.appName);
                if(oldIndex != -1) {
                  trackedApplications[oldIndex].endTime = currentlyTrackingApplication.endTime;
                  trackedApplications[oldIndex].duration = currentlyTrackingApplication.duration;
                }
              }
            }
            
            if(taskApplications.some((appItem) => appItem.name.includes(currentWindow.info.name) || currentWindow.info.name.includes(appItem.name)) && currentWindow.info.name.length != 0) {

              // idleDetection("start")
              isCurrentApp = true

              let appItemName = taskApplications[taskApplications.findIndex((appItem) => appItem.name.includes(currentWindow.info.name) || currentWindow.info.name.includes(appItem.name))].name

              if (trackedApplications.find((app) => app.appName === currentWindow.info.name)) {
                let index = trackedApplications.findIndex((app) => app.appName === currentWindow.info.name);
                trackedApplications[index].endTime = null
                trackedApplications[index].startTime = new Date();
                currentlyTrackingApplication = trackedApplications[index]
              } else {
                currentlyTrackingApplication = {appName: appItemName, startTime: new Date(), endTime: null, duration: 0}
                trackedApplications.push(currentlyTrackingApplication);
              }
              // console.log(currentWindow.info.name + "length: " + currentWindow.info.name.length)
            }
            else {
              isCurrentApp = false
              if(!idleDetected) {
                idleDetection("stop", (data) => {
                  console.log("Not App 2")
                })
              }
            }
          }
        } else {

          if(taskApplications.some((appItem) => appItem.name.includes(currentWindow.info.name) || currentWindow.info.name.includes(appItem.name)) && currentWindow.info.name.length != 0) {

            // idleDetection("start")\
          
            isCurrentApp = true

            let appItemName = taskApplications[taskApplications.findIndex((appItem) => appItem.name.includes(currentWindow.info.name) || currentWindow.info.name.includes(appItem.name))].name

            currentlyTrackingApplication = {appName: appItemName, startTime: new Date(), endTime: null, duration: 0}
            trackedApplications.push(currentlyTrackingApplication);
            // console.log(currentWindow.info.name + "length: " + currentWindow.info.name.length)

            console.log("firstTime");

          }
          else{
            isCurrentApp = false
            if(!idleDetected) {
              idleDetection("stop", (data) => {
                console.log("Not App 2")
              })
            }
          }
        }
        win.webContents.send("activeApp", {...Task, currentlyTrackingApplication: currentlyTrackingApplication})


    }, 1000);

    idleTrackingInterval = setInterval(() => {

        if(!idleDetected && !idlePopupShown) {
          idlePopup = new BrowserWindow({
            width: 500,
            height: 300,
            x: mainWindowState.x,
            y: mainWindowState.y,
            frame: false,
            alwaysOnTop: true,
            resizable: false,
            transparent: true,

            webPreferences: {
              webSecurity: false,
              enableRemoteModule: true,
              contextIsolation: true,
              nodeIntegration: false,
              preload: path.join(__dirname, "preload.js"),
            },
          });

          idlePopup.loadFile("./public/Popups/idlePopup.html");
          idlePopup.setIcon(path.join(__dirname, "icon.png"));
          idlePopup.center();
          idlePopup.show();

          idlePopupShown = true;

        }

        idleDetected = false;
    }, 60000)

});

ipcMain.on("sendPauseTaskToMain", (event, message) => {
    clearInterval(idleTrackingInterval)
    clearInterval(appTrackingInterval)
    clearInterval(lastModifiedInterval)

    trackLastModified(folderPath, "stop", (data) => {
      // closed
    })

    if(isCurrentApp) {
      currentlyTrackingApplication.endTime = new Date();
      let difference = currentlyTrackingApplication.endTime - currentlyTrackingApplication.startTime;
      console.log(difference);
      console.log(currentlyTrackingApplication.duration);//this the problem
      currentlyTrackingApplication.duration = currentlyTrackingApplication.duration + difference;
      console.log(currentlyTrackingApplication.duration);
      
      let oldIndex = trackedApplications.findIndex((app) => app.appName === currentlyTrackingApplication.appName);
      if(oldIndex != -1) {
        trackedApplications[oldIndex].endTime = currentlyTrackingApplication.endTime;
        trackedApplications[oldIndex].duration = currentlyTrackingApplication.duration;
      }
    }

    console.log(currentlyTrackingApplication)
    win.webContents.send("sendIntervalsPaused", trackedApplications)
    trackedApplications = []
    currentlyTrackingApplication = {}
})

ipcMain.on("idleCloseClicked", (event, data) => {
  if(data === "close-window") {
    idlePopup.destroy()
    idlePopupShown = false
  } else {
    lastModifiedPopup.destroy()
    lastModifiedPopupShown = false;
  }
});

}

app.on("ready", createWindow);

if (os.platform() == "darwin") {
  app.dock.setIcon(path.join(__dirname, "icon.png"));
}

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length == 0) createWindow();
});
