const { app } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const archiver = require('archiver');
const { dialog } = require('electron');
const axios = require('axios');
const FormData = require('form-data');
const { WritableStreamBuffer } = require('stream-buffers');
// import { activeWindow, type } from '@miniben90/x-win';
const { activeWindow, openWindows } = require('@miniben90/x-win');
const { uIOhook, UiohookKey } = require('uiohook-napi')


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

function getRunningWindowsMac() {
    return openWindows()
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

//function to detect idle times when tracking application usage times
function idleDetection(state, callback){


    //if the parameter state is "start", then idle detection will start
    if(state === "start"){
        uIOhook.on('input', (e) => {
            // if (e.keycode === UiohookKey.Q) {
            //   callback(true) 
            // }
          
            // if (e.keycode === UiohookKey.Escape) {
            //     callback(true)
            // }
            callback(true)

          })
    
          uIOhook.start()

    //else if state is set to "stop", then idle detection will stop
    }else if(state === "stop"){
        uIOhook.stop()
        callback(false)

    }
      
}
  

// Function to open a file dialog and return the selected file path
async function openFileDialog() {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
      });
    
      if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
      }
    
      return null;
  }
 const commonIgnorePatterns = [
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

// Function to create a zip file from a folder and upload it to WordPress REST API endpoint
async function createZipAndUpload(folderPath, folderName, ignoreList = commonIgnorePatterns) {
    return new Promise((resolve, reject) => {
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        const bufferStream = new WritableStreamBuffer();

        archive.on('error', err => {
            console.error('Error creating zip:', err);
            reject(err);
        });

        archive.on('end', async () => {
            try {
                const buffer = bufferStream.getContents();
                const formData = new FormData();
                formData.append('file', buffer, { filename: folderName + '.zip' });
                formData.append('folder', folderName);

                const response = await axios.post('https://nnjtrading.com/wp-json/myapp/v1/upload-file', formData, {
                    headers: formData.getHeaders()
                });

                console.log('File uploaded successfully');
                resolve(response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
                reject(error);
            }
        });

        archive.pipe(bufferStream);

        // Function to check if a file or folder should be ignored
        const shouldIgnore = (path) => {
            return ignoreList.some(pattern => {
                const regex = new RegExp(pattern);
                return regex.test(path);
            });
        };

        // Recursive function to add files and folders to the archive
        const addFolderToArchive = (folderPath, archivePath) => {
            fs.readdirSync(folderPath).forEach(file => {
                const filePath = `${folderPath}/${file}`;
                const archiveFilePath = archivePath ? `${archivePath}/${file}` : file;

                if (!shouldIgnore(filePath)) {
                    if (fs.statSync(filePath).isDirectory()) {
                        addFolderToArchive(filePath, archiveFilePath);
                    } else {
                        archive.file(filePath, { name: archiveFilePath });
                    }
                }
            });
        };

        addFolderToArchive(folderPath);

        archive.finalize();
    });
}

function getDateTime() {
    let newDate = new Date();

  let month = newDate.getMonth() + 1;

  let hours = newDate.getHours();
  if (hours < 10) hours = "0" + hours;
  let minutes = newDate.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;

  return [
    newDate.getDate() + "-" + month + "-" + newDate.getFullYear(),
    hours + ":" + minutes,
  ];
}



module.exports = { checkActiveApplication, getCurrentlyActiveApplication, openFileDialog, createZipAndUpload, getFocusedWindow, idleDetection, getDateTime, getRunningWindowsMac};