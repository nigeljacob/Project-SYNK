const { app } = require('electron');
const { exec } = require('child_process');
const activeWin = require('active-win');
const { run } = require('node:test');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const archiver = require('archiver');
const { dialog } = require('electron');
const axios = require('axios');
const FormData = require('form-data');
const { WritableStreamBuffer } = require('stream-buffers');
// import { activeWindow, type } from '@miniben90/x-win';
const { activeWindow } = require('@miniben90/x-win');




// to get currently active app on mac
function getActiveWindowMac() {
    return new Promise((resolve, reject) => {
        exec('osascript -e \'tell application "System Events" to name of application processes whose frontmost is true\'', (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                const activeWindow = stdout.trim();
                resolve(activeWindow);
            }
        });
    });
}

// to get currently active app on mac
function checkActiveApplication() {
    getActiveWindowMac()
        .then(activeWindow => {
            console.log('Active window:', activeWindow);
            // Do further processing here
        })
        .catch(error => {
            console.error('Error getting active window:', error);
        });
}


// // Function to get currently running applications
// function getRunningApplications() {
//     return new Promise((resolve, reject) => {
//         exec('tasklist /fo csv /nh', (error, stdout, stderr) => {
//             if (error) {
//                 reject(error);
//                 return;
//             }
//             if (stderr) {
//                 reject(stderr);
//                 return;
//             }

//             // Parse the stdout to extract application names
//             const applications = stdout
//                 .split('\r\n')
//                 .filter(Boolean) // Remove empty lines
//                 .map(line => {
//                     const columns = line.split('","');
//                     return columns[0].replace('"', ''); // Extract application name
//                 });

//             resolve(applications);
//         });
//     });
// }

// ti get currently running apps as a list on windows
function getRunningApps() {
    return new Promise((resolve, reject) => {
        exec('powershell.exe "Get-Process | Where-Object { $_.MainWindowHandle -ne 0 -and $_.MainWindowTitle -ne \'\' } | Select-Object MainWindowTitle"', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }

            const lines = stdout.trim().split('\n').map(line => line.trim());
            // Skip the first line containing the header "MainWindowTitle"
            const titles = lines.slice(2);
            resolve(titles);
        });
    });
}

// to get currently active apps all as a list on windows
async function getCurrentlyActiveApplication() {
    try {

        const activeWindow = await getRunningApps();

        let activeAppList = []
        
        for(let i = 0; i < activeWindow.length; i++) {
            let tempList = activeWindow[i].split("-");
            activeAppList.push(tempList[tempList.length - 1].trim())
        }

        return activeAppList

    } catch (error) {
        console.error('Error:', error);
    }
}

function getFocusedWindow() {
    const currentWindow = activeWindow();
    return currentWindow
}

// Function to open a file dialog and return the selected file path
async function openFileDialog() {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
      });
    
      // If the user selected a folder, return its path
      if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
      }
    
      // Return null if no folder was selected
      return null;
  }


// Function to create a zip file from a folder and upload it to WordPress REST API endpoint
async function createZipAndUpload(folderPath, folderName) {
    return new Promise((resolve, reject) => {
        // Create a zip buffer
        const archive = archiver('zip', {
            zlib: { level: 9 } // Set compression level to maximum
        });
        const bufferStream = new WritableStreamBuffer();

        // Pipe archive data to buffer stream
        archive.on('error', err => {
            console.error('Error creating zip:', err);
            reject(err);
        });

        archive.on('end', async () => {
            try {
                const buffer = bufferStream.getContents();
                // Create FormData object
                const formData = new FormData();
                formData.append('file', buffer, { filename: `${folderName}.zip` });
                formData.append('folder', folderName); // Include folder parameter

                // Send POST request to WordPress REST API endpoint
                const response = await axios.post('https://nnjtrading.com/wp-json/myapp/v1/upload-file', formData, {
                    headers: formData.getHeaders() // Set headers for FormData
                });

                console.log('File uploaded successfully:', response.data);
                resolve(response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
                reject(error);
            }
        });

        // Pipe archive to buffer stream
        archive.pipe(bufferStream);
        archive.directory(folderPath, false); // Add folder contents to the archive
        archive.finalize(); // Finalize the archive
    });
}



module.exports = { checkActiveApplication, getCurrentlyActiveApplication, openFileDialog, createZipAndUpload};