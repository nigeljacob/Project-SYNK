const { app } = require('electron');
const { exec } = require('child_process');
const activeWin = require('active-win');
const { run } = require('node:test');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { dialog } = require('electron');

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


// Function to get currently running applications
function getRunningApplications() {
    return new Promise((resolve, reject) => {
        exec('tasklist /fo csv /nh', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }

            // Parse the stdout to extract application names
            const applications = stdout
                .split('\r\n')
                .filter(Boolean) // Remove empty lines
                .map(line => {
                    const columns = line.split('","');
                    return columns[0].replace('"', ''); // Extract application name
                });

            resolve(applications);
        });
    });
}

function getActiveWindow() {
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


function zipFolder(sourceFolder, outputZip) {
    return new Promise((resolve, reject) => {
        // Create a write stream to the output zip file
        const output = fs.createWriteStream(outputZip);
        const archive = archiver('zip', {
            zlib: { level: 9 } // set compression level
        });

        // Listen for all archive data to be written
        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');

            resolve();
        });

        // Catch any errors
        archive.on('error', (err) => {
            reject(err);
        });

        // Pipe archive data to the file
        archive.pipe(output);

        // Add entire folder to the archive
        archive.directory(sourceFolder, false);

        // Finalize the archive (create the zip file)
        archive.finalize();
    });
}



async function getCurrentlyActiveApplication() {
    try {
        const runningApplications =  getRunningApplications();

        const activeWindow = await getActiveWindow();

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


module.exports = { checkActiveApplication, getCurrentlyActiveApplication, openFileDialog};