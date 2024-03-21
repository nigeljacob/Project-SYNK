const {
  Tray,
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  Notification,
  dialog,
  screen,
  nativeImage
} = require("electron");
const isDev = false
const windowStateKeeper = require("electron-window-state");
const path = require("path");
const {
  getappsfunc,
} = require("../../Backend/src/electronFunctions/viewTaskFunctions");
const os = require("node:os");
const {
  openFileDialog,
  createZipAndUpload,
  getFocusedWindow,
  idleDetection,
  getDateTime
} = require("../../Backend/src/electronFunctions/ProgressTrackerFunctions");
const chokidar = require('chokidar');
const trayWindow = require("electron-tray-window");

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
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(0,0,0,0)",
      symbolColor: "#ffffff",
    },
    frame: false,
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
    fullscreenable: false,

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
    win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
    )
    win.setIcon(path.join(__dirname, "logo.png"));
    win.show();
    // if(os.platform() != "darwin") {
    //   win.setSimpleFullScreen(true)
    // }
  }, 7000);

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
    getappsfunc()
      .then((appsList) => {
        // console.log(appsList);
        console.log("Received message from renderer process:");

        win.webContents.send("texsssst", appsList);
      })
      .catch((error) => console.error("Error:", error));
  });

  ipcMain.on("openFileDialog", (event, message) => {
    openFileDialog()
      .then((filePath) => {
        if (filePath) {
          console.log("Selected file:", filePath);
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

  let trayMenu = null;

  function showTrayMenu() {
    if(trayMenu === null) {
      trayMenu = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false,
        margin_x : 10,
        margin_y : 10,
        alwaysOnTop: true,
        resizable: false,
        fullscreen: false,
    
        webPreferences: {
          webSecurity: false,
          enableRemoteModule: true,
          contextIsolation: true,
          nodeIntegration: false,
          preload: path.join(__dirname, "preload.js"),
        }
      })

      trayMenu.loadFile("./public/Popups/tray.html");
      trayMenu.setSkipTaskbar(true);

      const image = nativeImage.createFromPath(path.join(__dirname, "icon.png"));

      let tray = new Tray(image.resize({width: 16, height: 16}));

      trayWindow.setOptions({
        tray: tray,
        window: trayMenu
      });
    } else {
      trayMenu.loadFile("./public/Popups/tray.html");
    }

  }

  function hideTrayMenu() {
    trayMenu.loadFile("./public/Popups/trayNoTask.html");
    
  }

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

  let TaskDetails;

  let uploadTimes = 0

  var directoryWatcher;

  const commonIgnorePatterns = [
    '.git',
    'node_modules',
    'dist',
    '.vscode',
    '.idea',
    '.log',
    'logs',
    'temp',
    '.DS_Store',
    'Thumbs.db',
    '.env', // Environment variables file
    '.cache', // Cache directories
    '.npmrc', // NPM configuration file
    '.yarnrc', // Yarn configuration file
    '.npm', // NPM cache directory
    '.yarn', // Yarn cache directory
    '.cache-loader', // Cache directory for webpack-loader
    'coverage', // Test coverage reports
    'build', // Build directories
    'out', // Output directories
    'bin', // Binary directories
    'target', // Target directories (Maven, Gradle)
    'venv', // Virtual environment directories (Python)
    '.tox', // Tox directories (Python)
    '__pycache__', // Python bytecode cache directories
    '.pyc', // Python bytecode files
    '.class', // Java class files
    '.gradle', // Gradle directories
    '.sass-cache', // Sass cache directories
    '.pytest_cache', // Pytest cache directories
    '.vs/', // Visual Studio directories
    '.elasticbeanstalk', // Elastic Beanstalk directories
    '.serverless', // Serverless directories
    '.firebase', // Firebase directories
    '.serverless', // Serverless directories
    '.next', // Next.js build directories
    '.storybook', // Storybook directories
    '.idea', // JetBrains IDE directories
    '.settings', // Eclipse IDE settings
    'package-lock.json', // NPM package lock file
    'yarn.lock', // Yarn lock file
    'bower_components', // Bower components directory
    'Gemfile.lock', // Ruby Gemfile lock file
    'vendor', // Vendor directories (Ruby, PHP)
    'composer.lock', // Composer lock file (PHP)
    'log', // Log directories
    'logs', // Logs directories
    'tmp', // Temporary directories
    'temp', // Temp directories
    'cache', // Cache directories
    '.history', // History directories
    '.vscode', // Visual Studio Code directories
    '.DS_Store', // macOS metadata files
    'Thumbs.db', // Windows thumbnail cache files
    '.gitignore', // Gitignore file itself
    '.swp', // Vim swap files
    '.editorconfig', // EditorConfig files
    '.eslintrc', // ESLint configuration files
    '.prettierrc', // Prettier configuration files
    '.babelrc', // Babel configuration files
    '.gitattributes', // Git attributes file
    '.npmignore', // NPM ignore file
    '.stylelintignore', // Stylelint ignore file
    '.stylelintcache', // Stylelint cache directory
    '.gitkeep' // Placeholder files in empty directories
    // Add more patterns as needed
];

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

  if(folderChanged && uploadTimes > 2) {
    let dateTime = getDateTime()

    let folderName = TaskDetails.team.teamName + "_" + TaskDetails.team.teamMemberList[TaskDetails.teamMemberIndex].UID + "_" + dateTime[0] + "_" + dateTime[1]
    
    // upload function
    createZipAndUpload(TaskDetails.task.filePath, folderName)
    .then((URL) => {
        console.log(URL);
        win.webContents.send("sendFileUrlFromMain", {...TaskDetails, URL: URL})
        win.webContents.send("lastUpdated", getDateTime());
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }
        win.webContents.send("sendIntervalsPaused", {...TaskDetails, trackedApplications: trackedApplications})
        ipcMain.on("statusUpdated", (event, data) => {
          win.destroy();
          app.quit();
        });
      }
    });
});

  ipcMain.on("sendStartTask", (event, Task) => {
    // start tracking the windows
    currentlyTrackingApplication = {};

    console.log(currentlyTrackingApplication);

    trackedApplications = [];

    let taskApplications = Task.task.applicationsList

    let idleDetected = false;

    isCurrentApp = false;

    TaskDetails = Task

    folderPath = Task.task.filePath

    showTrayMenu()

    win.webContents.send("sendTaskDetails", "heloooo")

    directoryWatcher = chokidar.watch(folderPath, {
      ignored: (folderPath) => {
        return commonIgnorePatterns.some(pattern => folderPath.includes(pattern));
      }, 
      persistent: true
    })
    
    directoryWatcher.on('all', (event, path) => {
      console.log(event, path);
      if(event === "error") {
        dialog.showErrorBox("Ünable to find Task Folder", "The task folder was not found in the specified path: " + folderPath);
        try{
          clearInterval(idleTrackingInterval)
          clearInterval(appTrackingInterval)
          clearInterval(lastModifiedInterval)
        } catch(e) {
        
        }

        win.webContents.send("sendIntervalsPaused", trackedApplications)
        trackedApplications = []
        currentlyTrackingApplication = {}
        directoryWatcher.close().then(console.log("watcher closed"))
        return
      } else {
        folderChanged = true
        uploadTimes++
      }
    });

    for(let i = 0; i < commonIgnorePatterns.length; i++) {
      directoryWatcher.unwatch(commonIgnorePatterns[i])
      // console.log("")
    }

    lastModifiedInterval = setInterval(() => {
        if(folderChanged && uploadTimes > 2) {

          let dateTime = getDateTime()

          let folderName = Task.team.teamName + "_" + Task.team.teamMemberList[Task.teamMemberIndex].UID + "_" + dateTime[0] + "_" + dateTime[1]
          
          // upload function
          createZipAndUpload(folderPath, folderName)
          .then((URL) => {
              console.log(URL);
              win.webContents.send("sendFileUrlFromMain", {...Task, URL: URL})
              win.webContents.send("lastUpdated", getDateTime());
          })
          .catch(error => {
              console.error('Error:', error);
          });

          console.log("upload")
          savePopupCount = 0
          folderChanged = false

        } else {

          if(savePopupCount < 3) {
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
  
            }

            savePopupCount++

          } else {

            lastModifiedPopupShown = false;
            lastModifiedPopup.destroy()

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

            }
          }
      }
    }, 900000)

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
                // console.log("Not App 2")
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
    }, 1200000)

});

ipcMain.on("versionUploaded", (event, data) => {
  // shown in tray menu uploaded data
  let dateNow = getDateTime()
  console.log(dateNow[0] +  " " + dateNow[1])
})

ipcMain.on("sendPauseTaskToMain", (event, message) => {
    clearInterval(idleTrackingInterval)
    clearInterval(appTrackingInterval)
    clearInterval(lastModifiedInterval)

    hideTrayMenu()
    
    directoryWatcher.close().then(console.log("watcher closed"))

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

    if(folderChanged && uploadTimes > 2) {
      let dateTime = getDateTime()

      let folderName = TaskDetails.team.teamName + "_" + TaskDetails.team.teamMemberList[TaskDetails.teamMemberIndex].UID + "_" + dateTime[0] + "_" + dateTime[1]
      
      // upload function
      createZipAndUpload(TaskDetails.task.filePath, folderName)
      .then((URL) => {
          console.log(URL);
          win.webContents.send("sendFileUrlFromMain", {...TaskDetails, URL: URL})
      })
      .catch(error => {
          console.error('Error:', error);
      });
    }

    console.log(currentlyTrackingApplication)
    win.webContents.send("sendIntervalsPaused", {...TaskDetails, trackedApplications: trackedApplications})
    trackedApplications = []
    currentlyTrackingApplication = {}
    lastModifiedPopupShown = false;
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
