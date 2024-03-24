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
import { updateViewTask } from "../../utils/AssignTask/taskFunctions";
import { sendNotification } from "../../utils/teamFunctions";
import { auth } from "../../utils/firebase";
import {
  readOnceFromDatabase,
  read_OneValue_from_Database,
} from "../../utils/firebaseCRUD";
import { IoReload, IoReloadCircleOutline } from "react-icons/io5";
import { RxReload } from "react-icons/rx";

//component to display a task assigned to a team member. Shows a list of applications installed on the user's computer in order to select a few that the user will use for the task.
export default function ViewTask(props) {
  const [installedApps, setInstalledApps] = useState([]); //array of apps installed on pc as a JSON that includes the app name and an icon string
  let taskName = props.task[0].taskName;
  let taskDesc = props.task[0].taskDesc;
  let documentFilePath = "";
  let progress = props.task[0].progress;
  let assignedDate =
    "Task Assigned: " +
    props.task[0]["assignedDate"][0] +
    " at " +
    props.task[0]["assignedDate"][1];
  let deadline =
    "Task Due: " +
    props.task[0]["deadline"][0] +
    " at " +
    props.task[0]["deadline"][1];
  let taskStatus = props.task[0].taskStatus;
  let completedTask = props.task[0].taskCompletedDate;
  const [open, setOpen] = React.useState(false); //state variable to set the state of the pop up (opened/closed)
  const [file, setFile] = React.useState("");
  var [selectedApps, setSelectedApps] = React.useState([]); //array of apps selected by user
  const [reload, setReload] = useState(false);

  //function to handle the onclick event of the Close button
  const handleClose = () => {
    props.setTrigger(false);
    // console.log("`props.trigger` is now false");
  };

  //function to handle reload when user clicks reload button. this is to show an updated list of applications including the currently active windows of the user. this is done to include the applications that are installed outside of the program files folder
  // const handleReload = () => {
  //   console.log("harro")
  //   electronApi.receiveAppListFromMain((data) => {
  //     console.log("data")

  //     // setInstalledApps(data);

  //   })
  // }

  const handleReload = () => {
    console.log("reload pressed");
    electronApi.viewTask("hey there im testing");
  };

  useEffect(() => {
    readOnceFromDatabase(
      "Teams/" +
        auth.currentUser.uid +
        "/" +
        props.task[1].teamCode +
        "/teamMemberList/",
      (data) => {
        for (let i = 0; i < data.length; i++) {
          try {
            if (data[i].UID === auth.currentUser.uid) {
              let task = data[i].taskList[props.task[2]];
              setFile(task.filePath);
              if (task.applicationsList[0] != "") {
                setSelectedApps(task.applicationsList);
              }
              break;
            }
          } catch (e) {}
        }
      }
    );
  }, []);

  const handleFileOpenClick = () => {
    electronApi.sendSignalToGetFilePath("getPath");
  };

  const handleSumibit = () => {
    console.log("fdff");
    if (selectedApps.length != 0) {
      if (file != "") {
        updateViewTask(
          props.task[1],
          props.task[0],
          props.task[2],
          selectedApps,
          file,
          (callback) => {
            if (callback) {
              handleClose();
            }
          }
        );
      } else {
        sendNotification(
          "File path is empty",
          "Fill in the file path to update task details",
          "danger",
          auth.currentUser.uid,
          "error",
          auth.currentUser.uid
        );
      }
    } else {
      sendNotification(
        "No Applications Selected",
        "Select applications to update task details",
        "danger",
        auth.currentUser.uid,
        "error",
        auth.currentUser.uid
      );
    }
  };

  console.log(file);

  //useEffect that retrieves the list of installed applications from the viewTaskFunctions.js file by using ipcRenderer. useEffect retrieves the data everytime the component is used
  useEffect(() => {
    electronApi.receiveAppListFromMain((data) => {
      console.log("use effect ran");
      setInstalledApps(data);
    });
  }, [reload]);

  useEffect(() => {
    electronApi.receiveFileFromMain((filePath) => {
      // console.log("data:" + data);
      setFile(filePath); //retrieves the data and sets it to the array of installed apps
    });
  }, []);

  // console.log(installedApps);

  //default image string
  let winIcon = "data:image/png;base64,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"




  //trigger needs to be true in order for the popup to be open
  return props.trigger ? (
    <div>
      <div className="tw-fixed tw-inset-0  tw-flex tw-justify-center tw-items-center">
        {/* <Card className="tw-relative tw-w-[470px] tw-shadow-[0_0_16px_0_#5bcfff] tw-border-2 tw-border-primary/80 tw-bg-zinc-900  "> */}
        <Card className="tw-relative tw-w-[470px] tw-border-2 tw-border-primary/80 tw-bg-zinc-900"
        style={{ boxShadow: '0 0 16px #5bbfff' }}>

          <CardHeader>
            <CardTitle className="tw-text-gray-300 tw-text-center">
              Task Assigned: {taskName}
            </CardTitle>
          </CardHeader>

          <CardContent>
              <div className="tw-grid tw-w-full tw-items-center tw-justify-center tw-gap-4">
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
                  
                  <div className="tw-flex tw-flex-col tw-space-y-5 tw-text-left tw-text-gray-300">
                    
                    


                  <div className="tw-flex tw-flex-col tw-space-y-1.5">
                  <Label htmlFor="currentApp" className="tw-flex tw-justify-between">
                      <div className="tw-mb-1">
                      Applications required for this task:
                      </div>               
                    {/* <button onclick={handleReload()}> */}
                  <button onClick = {event => handleReload()}>

                    {/* <CIcon icon={cisReload} /> */}
                    <RxReload className="hover:tw-text-cyan-400 tw-size-4 tw-text-white" />

                    </button>
                    </Label>
                    <Label
                      className="tw-text-left tw-text-gray-400"
                    >
                    (If you can't find the application you need, try opening it and then hitting the refresh button.)
                    </Label>
                  </div>





                   
                    {/* <form> */}

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
                                    const updatedSelectedApps = foundApp
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
                                    setSelectedApps(updatedSelectedApps);
                                  }}
                                >
                                  {currentApp.iconData ===
                                  "../../assets/images/defaultIconMac.png" ? (
                                    <img
                                      src={icon}
                                      className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                    />
                                  ) : (
                                    // <img
                                    //   src={currentApp.iconData}
                                    //   className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                    // />
                                      <img
                                      src={winIcon}
                                      className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                    />
                                  )}

                                    <p className="tw-p-2 tw-text-left">{currentApp.name}</p>
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

                <Label htmlFor="name" className="tw-text-left tw-text-gray-300">
                  Applications selected:
                </Label>

                  <Command>
                    
                    <div className="tw-justify-center tw-items-center tw-flex">
                      <ScrollArea className="tw-h-[122px] tw-w-[300px] tw-rounded-md tw-border">
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
                                // className="tw-aria-selected:bg-red-900 tw-aria-selected:text-green-900 tw-h-[56px] tw-bg-red-600 hover:tw-bg-blue-900"
                                className="tw-h-[56px] aria-selected:tw-bg-background aria-selected:tw-text-foreground"       
                                // tw-outline-none aria-selected:tw-bg-accent aria-selected:tw-text-accent-foreground data-[disabled]:tw-pointer-events-none data-[disabled]:tw-opacity-50                       
                                // onSelect={() => {
                                  
                                // }}
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
                <Label htmlFor="name" className="tw-text-left tw-text-gray-300">
                  Folder containing files needed for task:
                </Label>

                {/* <div onClick={event => handleFileOpenClick()}>Cancel</div> */}
              </div>
            </div>
            {/* </form> */}

            <Button
              className="tw-w-full tw-flex tw-justify-center tw-items-center tw-mt-5"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              onClick={(event) => handleFileOpenClick()}
            >
              {file == "" || file == null ? (
                <h3>Select Folder</h3>
              ) : (
                <h3 className="tw-truncate">{file}</h3>
              )}
            </Button>
          </CardContent>

          <CardFooter className="tw-flex tw-justify-between">
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={(event) => handleSumibit()}>Confirm</Button>
          </CardFooter>
        </Card>
      </div>{" "}
    </div>
  ) : (
    ""
  );
}
