var getIcon = require('get-app-icon');
var fs = require('fs');
const os = require('node:os')
const { exec } = require('child_process');
// const helloModule = require('./testing.js');

const {getInstalledApps} = require('get-installed-apps')

// function viewTask(){
    // return "hello there from view task"


    async function getappsfunc() {
        var appsList = [];

        try {
            const apps = await getInstalledApps();
            for (const app of apps) {
                if(os.platform() === "darwin") {
                    let appName = app.appName;
 
                    appsList.push({
                        name: appName,
                        iconData: "../../assets/images/defaultIconMac.png"
                    });
                
        
                } else {

                let appName = app.DisplayName;
                let appIcon = app.DisplayIcon;
                if (appIcon != null) {
                    try {
                        let icon1 = await getIcon.extractIcon(appIcon);
                        // let icon = icon1.split(',')[1];
                        // let buffer = Buffer.from(icon, 'base64');
                        // if(icon1 === "data:image/png;base64,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"){
                        //     icon1 = require("../../../Frontend/src/assets/images/defaultAppIcon.png")
                        // }
                        
                        appsList.push({
                            name: appName,
                            iconData: icon1
                        });
                    } catch (error) {
                        console.error("Error extracting icon:", error);
                    }
                } else {
                    appIcon = "defaultAppIcon";
                }
                }

            
            }

            return appsList;


        } catch (error) {
            console.error("Error getting installed apps:", error);
            throw new Error('Platform not supported');
        }
    }
  


// };

function extractIconFromPath(appPath) {
    return new Promise((resolve, reject) => {
        // Use sips command to convert .icns to .png
        const command = `sips -s format png "${appPath}/Contents/Resources/AppIcon.icns" --out /tmp/appIcon.png`;
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error('Error extracting icon:', err);
                reject(err);
            } else {
                // Read the converted .png file
                fs.readFile('/tmp/appIcon.png', (err, data) => {
                    if (err) {
                        console.error('Error reading icon file:', err);
                        reject(err);
                    } else {
                        // Convert the buffer to base64
                        const base64Icon = data.toString('base64');
                        resolve(base64Icon);
                    }
                });
            }
        });
    });
}



module.exports = { getappsfunc };
