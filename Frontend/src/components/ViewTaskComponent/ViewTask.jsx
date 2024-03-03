// change frameworks to applicationslist

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

export default function ViewTask(props) {
  const handleClose = () => {
    props.setTrigger(false);
    console.log("`props.trigger` is now false");
  };

  const [frameworks, setFrameworks] = useState([]);

  useEffect(() => {
    electronApi.receiveAppListFromMain((data) => {
      console.log("data:" + data);
      setFrameworks(data);
    });
  }, []);

  console.log(frameworks);

  let taskName = props.task[0].taskName;
  let taskDesc = props.task[0].taskDesc;
  let documentFilePath = "";
  let progress = props.task[0].progress;
  let assignedDate =
    "Task Assigned: " +
    props.task[0]["assignedDate"][0] +
    " at " +
    props.task[0]["assignedDate"][1]; // Initialize with current date
  let deadline =
    "Task Due: " +
    props.task[0]["deadline"][0] +
    " at " +
    props.task[0]["deadline"][1];
  let taskStatus = props.task[0].taskStatus;
  let completedTask = props.task[0].taskCompletedDate; // Or a specific Date if applicable
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(false);
  var [checkmark, setcheckmark] = React.useState();
  const [file, setFile] = React.useState();
  let [arrayIsEmpty, setArrayIsEmpty] = React.useState(true);
  var [applicationsList, setApplicationsList] = React.useState([]); // Empty array for applicationsList

  var harro = [
    "sveltdekit",
    "nukxt.js",
    "rejmix",
    "astharo",
    "next.js",
    "sveltdekit",
    "nukxt.js",
    "rejmix",
    "astharo",
    "next.js",
  ];
  var matchedCategories;
  //newValues is the list of apps

  return props.trigger ? (
    <div>
      <div className="tw-fixed tw-inset-0  tw-flex tw-justify-center tw-items-center">
        <Card className="tw-relative tw-w-[470px] tw-shadow-[0_0_10px_10px_rgba(91,206,255,0.3)] tw-border-2 tw-border-primary/80  tw-bg-zinc-900">
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
                    <Label htmlFor="framework">
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
                              

                              {frameworks.map((framework) => (
                                <div>
                              

                                  <CommandItem
                                    className="tw-h-[56px]"
                                    key={framework.name}
                                    value={framework.name}
                                    onSelect={() => {
                                      var check = false;

                                      //newValues is a list of names of selected apps
                                      var currentValue = framework.name;

                                      var foundObject = applicationsList.find(
                                        (item) => item.name == currentValue
                                      );
                                      setValue();


                                      const updatedApplicationsList =
                                        foundObject
                                          ? [...applicationsList].filter(
                                              (item) => item !== foundObject
                                            )
                                          : [
                                              ...applicationsList,
                                              {
                                                name: framework.name,
                                                caca: framework.caca,
                                              },
                                            ];

                                      setApplicationsList(
                                        updatedApplicationsList
                                      );
                                      
                                    }}
                                  >
                                    {framework.caca ===
                                    "../../assets/images/defaultIconMac.png" ? (
                                      <img
                                        src={icon}
                                        className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                      />
                                    ) : (
                                      <img
                                        src={framework.caca}
                                        className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                      />
                                    )}

                                    <p className="tw-p-2">{framework.name}</p>
                                    <Check
                                      className={cn(
                                        "tw-mr-3 tw-h-4 tw-w-4 tw-absolute tw-right-0",
                                        applicationsList.find(
                                          (item) => item.name == framework.name
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
                          
                          {applicationsList.length === 0 && (
                            <div className="tw-text-[19px] tw-m-[40px] tw-text-foreground/90">
                              No applications selected
                            </div>
                          )}
                          {applicationsList.map((application) => (
                            <div>
                              <CommandItem
                                className="tw-aria-selected:bg-background tw-aria-selected:text-foreground tw-h-[56px]"
                              
                                onSelect={() => {
                                  
                                }}
                              >
                                {application.caca ===
                                "../../assets/images/defaultIconMac.png" ? (
                                  <img
                                    src={icon}
                                    className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                  />
                                ) : (
                                  <img
                                    src={application.caca}
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
                  <Input
                    className="tw-file:text-foreground tw-text-foreground/90"
                    id="picture"
                    type="file"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="tw-flex tw-justify-between">
            <Button onClick={handleClose}>Cancel</Button>
            <Button>Confirm</Button>
          </CardFooter>
        </Card>
      </div>{" "}
    </div>
  ) : (
    ""
  );
}
