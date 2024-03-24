const {getappsfunc} = require("./viewTaskFunctions")

describe("view task functionality",  () => {

        it("view task retrieves app list properly", async () => {
            // var a = await getappsfunc()

            // const installedApps = getByTestId("viewTask").textContent;
            // console.log(a)
            // expect(a[0].name).toEqual(5)
            // expect(a).toHaveProperty('name');

            const appsList = await getappsfunc();
        
            // Assert that the result is an array
            expect(Array.isArray(appsList)).toBe(true);
    
            // Assert that each element in the array has a 'name' and 'iconData' property
            appsList.forEach(app => {

                expect(app).toHaveProperty('name');
                expect(app).toHaveProperty('iconData');
                
                // Assert that the values for 'name' and 'iconData' are not empty
                expect(app.name).toBeTruthy();
                expect(app.iconData).toBeTruthy();
            });


        })
    
    });