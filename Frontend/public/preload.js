// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  // Example: Sending a message to the main process
  receiveAppListFromMain: (callback) => {
    ipcRenderer.on('texsssst', (event, data) => {
      callback(data)
    }) ;
  },
  
  // Add more functions as needed...
  viewTask: (message) => {
    ipcRenderer.send('viewTask', message);
    console.log("WHOOO MESSAGE WHOOOO")
  },
});

console.log("preload script loaded")
