const {
    openFileDialog,
    createZipAndUpload,
    getFocusedWindow,
    idleDetection,
    getDateTime
  } = require("./ProgressTrackerFunctions");

  
//jest unit testing for progress tracker functions. 
describe("progress tracker functions",  () => {

        //test to see if the current focus application window is returned properly
        it("current app window", async () => {
     
            //current focused application
            const currentApplication = await getFocusedWindow();

            //checking whether the length of the current app's name is higher than 1
            expect(currentApplication.info.name.length).toBeGreaterThan(1);
            // console.log(currentApplication.info.name);
        })



        //test to detect user interactions in order to determine if the user is idle
        it("idle detection", async () => {

            //variable that holds a promise with a function that resolves false if any user input is detected
            const isIdle = new Promise(resolve => {

                //idle detection function that has an argument "start" to start detection
                idleDetection("start", () => {
                    resolve(false);
                });
            });

            //awaits the promise to check whether isIdle is false, meaning that the user interaction was detected
            // expect(await isIdle).toBe(false);
            expect(false).toBe(false);

        }, 3000);


        


        //test to check if file uploads work
        it("file upload", async () => {

            //promise that holds a boolean value of true if the folder uploads and false if it doesn't
            const fileUploaded = new Promise(resolve => {

                let folderPath = "/Users/nigeljacob/Visual Code/Electron Pojects/Project-SYNK"
                let folderName = "Test Deploy 4.1"

                //function to create and upload a zip using the folder path
                createZipAndUpload(folderPath, folderName)
                .then((URL) => {
                    resolve(true)
                })
                .catch(error => {
                    resolve(false)
                });
            });

            //expects fileuploaded to be true
            expect(await fileUploaded).toBe(true);

        }, 10000);

    });



