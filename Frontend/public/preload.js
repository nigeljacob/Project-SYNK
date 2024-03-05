// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  // Example: Sending a message to the main process
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
  
  // Add more functions as needed...
  viewTask: (message) => {
    ipcRenderer.send('viewTask', message);
    console.log("WHOOO MESSAGE WHOOOO")
  },

  sendNotificationToMain: (Notification) => {
    ipcRenderer.send("notification", Notification);
  }

});

console.log("preload script loaded")
