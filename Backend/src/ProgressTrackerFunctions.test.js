const {
    openFileDialog,
    createZipAndUpload,
    getFocusedWindow,
    idleDetection,
    getDateTime
  } = require("./ProgressTrackerFunctions");

  

describe("progress tracker functions",  () => {

        it("current app window", async () => {
            // var a = await getappsfunc()

            // const installedApps = getByTestId("viewTask").textContent;
            // console.log(a)
            // expect(a[0].name).toEqual(5)
            // expect(a).toHaveProperty('name');

            const appsList = await getFocusedWindow();
        
            // expect(appsList.info.name).toBe(0);

            // Assert that the result is an array
            expect(appsList.info.name.length).toBeGreaterThan(100);
    
            // // Assert that each element in the array has a 'name' and 'iconData' property
            // appsList.forEach(app => {

            //     expect(app).toHaveProperty('name');
            //     expect(app).toHaveProperty('iconData');
                
            //     // Assert that the values for 'name' and 'iconData' are not empty
            //     expect(app.name).toBeTruthy();
            //     expect(app.iconData).toBeTruthy();
            // });


        })
    
    });



