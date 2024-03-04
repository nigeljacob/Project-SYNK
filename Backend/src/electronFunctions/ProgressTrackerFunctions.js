const { app } = require('electron');
const { exec } = require('child_process');
const activeWin = require('active-win');
const { run } = require('node:test');

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


module.exports = { checkActiveApplication, getCurrentlyActiveApplication };