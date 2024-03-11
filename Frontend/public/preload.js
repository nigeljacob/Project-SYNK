// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {

  receiveAppListFromMain: (callback) => {
    ipcRenderer.on('texsssst', (event, data) => {
      callback(data)
    }) ;
  },

  receiveFileFromMain: (callback) => {
    ipcRenderer.on("filePath", (event, data) => {
      callback(data)
    })
  },

  sendSignalToGetFilePath: (message) => {
    ipcRenderer.send('openFileDialog', message);
  },
  
  viewTask: (message) => {
    ipcRenderer.send('viewTask', message);
    console.log("WHOOO MESSAGE WHOOOO")
  },

  sendNotificationToMain: (Notification) => {
    ipcRenderer.send("notification", Notification);
  },

  receiveStatusUpdateSignalFromMain: (callback) => {
    ipcRenderer.on("statusUpdate", (event, data) => {
      callback(data)
    })
  },

  sendStatusUpdatedToMain: (updated) => {
    console.log(updated)
    ipcRenderer.send("statusUpdated", updated)
  },

  sendShowAlertSignamToMain: (message) => {
    ipcRenderer.send("showAlertBox", message)
  },

  receiveConfirmBoxResponseFromMain: (callback) => {
    ipcRenderer.on("YesClicked", (event, data) => {
      callback(data)
    })
  },

  sendConfirmBoxSignalToMain: (message) => {
    ipcRenderer.send("showConfirmBox", message)
  },

  sendTaskStarted: (task) => {
    ipcRenderer.send("sendStartTask", task)
  }
  
});

console.log("preload script loaded")
