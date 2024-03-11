// change frameworks to applicationslist
//change caca to icon
//change applicationsList to selectedAppsList

import React, { useEffect } from "react";
import { Button } from "../../shadCN-UI/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../shadCN-UI/ui/card";
import { Input } from "../../shadCN-UI/ui/input";
import { Label } from "../../shadCN-UI/ui/label";
import { cn } from "../../shadCN-UI/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadCN-UI/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "../../shadCN-UI/ui/scroll-area";
import { useState } from "react";
import icon from "../../assets/images/defaultIconMac.png";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../../shadCN-UI/ui/command";
const electronApi = window?.electronApi;
import { updateViewTask } from "../../../../Backend/src/AssignTask/taskFunctions";
import { sendNotification } from "../../../../Backend/src/teamFunctions";
import { auth } from "../../../../Backend/src/firebase";
import { readOnceFromDatabase, read_OneValue_from_Database } from "../../../../Backend/src/firebaseCRUD";

//component to display a task assigned to a team member. Shows a list of applications installed on the user's computer in order to select a few that the user will use for the task.
export default function ViewTask(props) {

  const [installedApps, setInstalledApps] = useState([]); //array of apps installed on pc as a JSON that includes the app name and an icon string
  let taskName = props.task[0].taskName;
  let taskDesc = props.task[0].taskDesc;
  let documentFilePath = "";
  let progress = props.task[0].progress;
  let assignedDate = "Task Assigned: " + props.task[0]["assignedDate"][0] + " at " +  props.task[0]["assignedDate"][1]; 
  let deadline = "Task Due: " +  props.task[0]["deadline"][0] + " at " +  props.task[0]["deadline"][1];
  let taskStatus = props.task[0].taskStatus;
  let completedTask = props.task[0].taskCompletedDate; 
  const [open, setOpen] = React.useState(false); //state variable to set the state of the pop up (opened/closed)
  const [file, setFile] = React.useState("");
  var [selectedApps, setSelectedApps] = React.useState([]); //array of apps selected by user



  //function to handle the onclick event of the Close button
  const handleClose = () => {
    props.setTrigger(false);
    // console.log("`props.trigger` is now false");
  };

  useEffect(() => {
    readOnceFromDatabase("Teams/" + auth.currentUser.uid + "/" + props.task[1].teamCode + "/teamMemberList/", (data) => {
      for(let i = 0; i < data.length; i++) {
        try{
          if(data[i].UID === auth.currentUser.uid) {
            let task = data[i].taskList[props.task[2]]
            setFile(task.filePath)
            if(task.applicationsList[0] != "") {
              setSelectedApps(task.applicationsList)
            }
            break
          }
        } catch(e) {
            
        }
      }
    })
  }, [])

  const handleFileOpenClick = () => {
    electronApi.sendSignalToGetFilePath("getPath")
  }

  const handleSumibit = () => {
    console.log("fdff")
    if(selectedApps.length != 0) {
        if(file != "") {
          updateViewTask(props.task[1], props.task[0], props.task[2], selectedApps, file, (callback) => {
            if(callback) {
              handleClose()
            }
          })
        } else {
          sendNotification("File path is empty", "Fill in the file path to update task details", "danger",auth.currentUser.uid, "error", auth.currentUser.uid)
        }
    } else {
      sendNotification("No Applications Selected", "Select applications to update task details", "danger", auth.currentUser.uid, "error", auth.currentUser.uid)
    }
  }

  console.log(file)


  //useEffect that retrieves the list of installed applications from the viewTaskFunctions.js file by using ipcRenderer. useEffect retrieves the data everytime the component is used
  useEffect(() => {
    electronApi.receiveAppListFromMain((data) => {

      setInstalledApps(data);
    });
  }, []);

  useEffect(() => {
    electronApi.receiveFileFromMain((filePath) => {
      // console.log("data:" + data);
      setFile(filePath);//retrieves the data and sets it to the array of installed apps
    });
  }, []);

  // console.log(installedApps);


  //trigger needs to be true in order for the popup to be open
  return props.trigger ? (
    <div>
      <div className="tw-fixed tw-inset-0  tw-flex tw-justify-center tw-items-center">
        <Card className="tw-relative tw-w-[470px] tw-shadow-[0_0_16px_0_#5bbfff] tw-border-2 tw-border-primary/80 tw-bg-zinc-900  ">
          <CardHeader>
            <CardTitle className="tw-text-gray-300">
              Task Assigned: {taskName}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form>
              <div className="tw-grid tw-w-full tw-items-center tw-gap-4">
                <div className="tw-flex tw-flex-col tw-space-y-1.5">
                  <Label
                    htmlFor="taskDesc"
                    className="tw-text-left tw-text-gray-300"
                  >
                    Task Description: {taskDesc}
                  </Label>
                </div>

                <div className="tw-flex tw-flex-col tw-space-y-4">
                  <div className="tw-flex tw-flex-col tw-space-y-1.5">
                    <Label
                      htmlFor="assignedDate"
                      className="tw-text-left tw-text-gray-400"
                    >
                      {assignedDate}
                    </Label>
                    <Label
                      htmlFor="deadline"
                      className="tw-text-left tw-text-gray-400"
                    >
                      {deadline}
                    </Label>
                  </div>
                  
                  <div className="tw-flex tw-flex-col tw-space-y-5 tw-text-left tw-text-gray-300 ">
                    <Label htmlFor="currentApp">
                      Applications required for this task:
                    </Label>

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="tw-justify-between"
                        >
                          {"Select Applications"}
                          <ChevronsUpDown className="tw-ml-2 tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="tw-p-0 tw-w-[420px]">
                        <Command>
                          <CommandInput
                            placeholder="Search Applications on your computer"
                            className="tw-border-none tw-text-white"
                          />

                          <ScrollArea className="tw-h-[170px]">
                            <CommandEmpty>No application found.</CommandEmpty>

                            <CommandGroup>
                              
                              {/* mapping each app in installedApps array in the form of a list*/}
                              {installedApps.map((currentApp) => (
                                <div>
                                  <CommandItem
                                    className="tw-h-[56px]"
                                    key={currentApp.name}
                                    value={currentApp.name}

                                    // when a specific item is selected from the applications list, the selectedApps array
                                    //is checked to see if the selected app is already in it. 
                                    onSelect={() => {

                                      //foundApp is a variable that stores information on whether the current app was found in the selectedApps array
                                      var foundApp = selectedApps.find(
                                        (item) => item.name == currentApp.name
                                      );

                                      //updatesSelectedApps is an array that is an updated copy of the selectedApps array. If the app was found in the array(the app was selected by the user) and the app was clicked again, the app would be removed from the array. If the app wasn't selected previously and clicked on now, it would be added to the array.
                                      const updatedSelectedApps =
                                        foundApp
                                          ? [...selectedApps].filter(
                                              (item) => item !== foundApp
                                            )
                                          : [
                                              ...selectedApps,
                                              {
                                                name: currentApp.name,
                                                iconData: currentApp.iconData,
                                              },
                                            ];

                                      //selectedApps array is updated with the new updated array
                                      setSelectedApps(
                                        updatedSelectedApps
                                      );
                                      
                                    }}
                                  >
                                  
                                    {currentApp.iconData ===
                                    "../../assets/images/defaultIconMac.png" ? (
                                      <img
                                        src={icon}
                                        className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                      />
                                    ) : (
                                      <img
                                        src={currentApp.iconData}
                                        className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                      />
                                    )}

                                    <p className="tw-p-2">{currentApp.name}</p>
                                    <Check
                                      className={cn(
                                        "tw-mr-3 tw-h-4 tw-w-4 tw-absolute tw-right-0",

                                        // add a checkmark next to the apps that were selected and remove the checkmark from apps that were deselected
                                        selectedApps.find(
                                          (item) => item.name == currentApp.name
                                        )
                                          ? "tw-opacity-100"
                                          : "tw-opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                </div>
                              ))}
                            </CommandGroup>
                          </ScrollArea>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    
                  </div>
                  <Label
                    htmlFor="name"
                    className="tw-text-left tw-text-gray-300"
                  >
                    Applications selected:
                  </Label>
                  <Command>
                    
                    <div className="tw-justify-center tw-items-center tw-flex">
                      <ScrollArea className="tw-h-[120px] tw-w-[300px] tw-rounded-md tw-border">
                        <CommandGroup>
                          
                          {/* if no applications were selected, display a message */}
                          {selectedApps.length === 0 && (
                            <div className="tw-text-[19px] tw-m-[40px] tw-text-foreground/90">
                              No applications selected
                            </div>
                          )}

                          {/* display the list of selected applications */}
                          {selectedApps.map((application) => (
                            <div>
                              <CommandItem
                                className="tw-aria-selected:bg-background tw-aria-selected:text-foreground tw-h-[56px]"
                              
                                onSelect={() => {
                                  
                                }}
                              >
                                {application.iconData ===
                                "../../assets/images/defaultIconMac.png" ? (
                                  <img
                                    src={icon}
                                    className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                  />
                                ) : (
                                  <img
                                    src={application.iconData}
                                    className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                  />
                                )}

                                <p className="tw-p-2 tw-text-[14px]">
                                  {application.name}
                                </p>
                              </CommandItem>
                            </div>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </div>
                  </Command>
                  
                  {/* Reference for file handling: https://youtu.be/O4ybhvtUbCE?si=NwfToeXmE87DXPVl */}
                  <Label
                    htmlFor="name"
                    className="tw-text-left tw-text-gray-300"
                  >
                    Select file to be used:
                  </Label>
                  <div className="tw-w-full tw-h-[100px] tw-flex tw-justify-center tw-items-center" onClick={event => handleFileOpenClick()}>
                        {(file == "" || file == null) ? (
                          <h3>Cick here to open file</h3>
                        ): (
                          <h3>{file}</h3>
                        )}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="tw-flex tw-justify-between">
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick = {event => handleSumibit()}>Confirm</Button>
          </CardFooter>
        </Card>
      </div>{" "}
    </div>
  ) : (
    ""
  );
}
