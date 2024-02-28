// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  // Example: Sending a message to the main process
  sendMessageToMain: (message) => {
    ipcRenderer.send('messageToMain', message);
    console.log(message)
  },
  
  // Add more functions as needed...
});

console.log("preload script loaded")
