// change frameworks to applicationslist

import React, { useEffect } from "react";
import { Button } from "../../shadCN-UI/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../shadCN-UI/ui/card";
import { Input } from "../../shadCN-UI/ui/input";
import { Label } from "../../shadCN-UI/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadCN-UI/ui/select";
// import React, { useState } from "react";
// import { Textarea } from "@/components/ui/textarea";
import { Textarea } from "../../shadCN-UI/ui/textarea";
import { Calendar } from "../../shadCN-UI/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../shadCN-UI/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadCN-UI/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "../../shadCN-UI/ui/scroll-area";
import { Separator } from "../../shadCN-UI/ui/separator";
import { useState } from "react";
import icon from "../../assets/images/defaultIconMac.png"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "../../shadCN-UI/ui/command";
const electronApi = window?.electronApi



export default function ViewTask(props) {
  const handleClose = () => {
    props.setTrigger(false);
    console.log("`props.trigger` is now false");
  };

  const [frameworks, setFrameworks] = useState([])

  useEffect(() => {

    electronApi.receiveAppListFromMain((data) => {
      console.log("data:" + data)
      setFrameworks(data)
    })

  }, [])

  console.log(frameworks)

//   let taskName = "Make Assign Task";
//   let taskID = "";
//   let userID = "";
//   let taskDesc =
//     "You have to create the front-end for the Assign Task function.";
//   let documentFilePath = "";
//   let applicationsList = []; // Empty array for applicationsList
//   let progress; // Assuming `Progress` is defined elsewhere
//   let assignedDate = new Date("2024-01-05T10:00"); // Initialize with current date

//   let deadline = new Date("2024-01-08T13:00");
//   let taskStatus = "";
//   let completedTask = null; // Or a specific Date if applicable

//   const frameworks = [
//     {
//       value: "next.js",
//       label: "Next.js",
//     },
//     {
//       value: "sveltdekit",
//       label: "SvelteKit",
//     },
//     {
//       value: "nukxt.js",
//       label: "Nuxt.js",
//     },
//     {
//       value: "rejmix",
//       label: "Remix",
//     },
//     {
//       value: "astharo",
//       label: "Astro",
//     },
//     {
//       value: "nexgt.js",
//       label: "Next.js",
//     },
//     {
//       value: "svelwftsekit",
//       label: "SvelteKit",
//     },
//     {
//       value: "nuxtqsd.js",
//       label: "Nuxt.js",
//     },
//     {
//       value: "redmwfix",
//       label: "Remix",
//     },
//     {
//       value: "asedtgro",
//       label: "Astro",
//     },
//     {
//       value: "nexsdt.js",
//       label: "Next.js",
//     },
//     {
//       value: "svelctaekit",
//       label: "SvelteKit",
//     },
//     {
//       value: "nudxat.js",
//       label: "Nuxt.js",
//     },
//     {
//       value: "resamix",
//       label: "Remix",
//     },
//     {
//       value: "astarao",
//       label: "Astro",
//     },
//   ];

//   const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState("");
//   const [file, setFile] = React.useState();
//   var [newValues, setNewValues] = React.useState([]);
//   let [arrayIsEmpty, setArrayIsEmpty] = React.useState(true);

//   var harro = [
//     "sveltdekit",
//     "nukxt.js",
//     "rejmix",
//     "astharo",
//     "next.js",
//     "sveltdekit",
//     "nukxt.js",
//     "rejmix",
//     "astharo",
//     "next.js",
//   ];

//   //newValues is the list of apps

//   return props.trigger ? (
//     <div>
//     {/* <Card>
//       <CardHeader>
//         <CardTitle>Card Title</CardTitle>
//         <CardDescription>Card Description</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p>Card Content</p>
//       </CardContent>
//       <CardFooter>
//         <p>Card Footer</p>
//       </CardFooter>
//     </Card> */}
//     {/* <h1 className="tw-position">Harro there!!!</h1>
//     <Button onClick={() => props.setTrigger(false)}>Close</Button> */}
//     {/* <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-60 tw-flex tw-justify-center tw-items-center tw-min-h-screen "> */}
//     <div className="tw-fixed tw-inset-0  tw-flex tw-justify-center tw-items-center">
//       {/* <div className="tw-relative"> */}
//       {/* <div
//           className={`tw-absolute tw-inset-0 tw-bg-primary tw-blur-[8px] tw-animate__animated ${
//             props.trigger ? "tw-animate__fadeIn" : "tw-animate__fadeOut"
//           }`}
//         ></div> */}
//       <Card
//         className="tw-relative tw-w-[470px] tw-shadow-[0_0_16px_#5bceff] tw-border-2 tw-border-primary/80  tw-bg-zinc-900">
//         <CardHeader>
//           <CardTitle className="tw-text-gray-300">
//             Task Assigned: {taskName}
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form>
//             <div className="tw-grid tw-w-full tw-items-center tw-gap-4">
//               <div className="tw-flex tw-flex-col tw-space-y-1.5">
//                 <Label htmlFor="taskDesc" className="tw-text-left tw-text-gray-300">
//                   Task Description: {taskDesc}
//                 </Label>
//               </div>

//               <div className="tw-flex tw-flex-col tw-space-y-4">
//                 <div className="tw-flex tw-flex-col tw-space-y-1.5">
//                   <Label
//                     htmlFor="assignedDate"
//                     className="tw-text-left tw-text-gray-400"
//                   >
//                     Assigned:{" "}
//                     {assignedDate.toLocaleDateString("en-US", {
//                       weekday: "short",
//                       year: "numeric",
//                       month: "short",
//                       day: "numeric",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: false, // Remove hours in 12-hour format
//                     })}
//                   </Label>
//                   <Label
//                     htmlFor="deadline"
//                     className="tw-text-left tw-text-gray-400"
//                   >
//                     Due:{" "}
//                     {deadline.toLocaleDateString("en-US", {
//                       weekday: "short",
//                       year: "numeric",
//                       month: "short",
//                       day: "numeric",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: false, // Remove hours in 12-hour format
//                     })}
//                   </Label>
//                 </div>
//                 {/* 



//                     Dropdown menu for selecting apps





//                  */}
//                 <div className="tw-flex tw-flex-col tw-space-y-5 tw-text-left tw-text-gray-300 ">
//                   <Label htmlFor="framework">
//                     Applications required for this task:
//                   </Label>

//                   {/* <Select className="tw-w-[400px]">
//                     <SelectTrigger id="framework">
//                       <SelectValue placeholder="Select Applications" />
//                     </SelectTrigger>
//                     <SelectContent position="popper">
//                       <SelectItem value="neaxt">Nexgt.js</SelectItem>
//                       <SelectItem value="svelstekit">SveltdeKit</SelectItem>
//                       <SelectItem value="asdtro">Astrfo</SelectItem>
//                       <SelectItem value="nucxt">Nuxht.js</SelectItem>
//                       <SelectItem value="necxt">Nextm.js</SelectItem>
//                       <SelectItem value="svveltekit">SveglteKit</SelectItem>

//                       <SelectItem value="nehxt">Nexdt.js</SelectItem>
//                       <SelectItem value="svetltekit">SvselteKit</SelectItem>
//                       <SelectItem value="asytro">Aastro</SelectItem>
//                       <SelectItem value="nuxt">Nuaxt.js</SelectItem>
//                     </SelectContent>
//                   </Select> */}

//                   <Popover open={open} onOpenChange={setOpen}>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={open}
//                         className="tw-justify-between"
//                       >
//                         {
//                           /*
//                           shows the names of the apps chosen 
//                           {value.length > 0
//                           ? value.join(", ") // Or a more appropriate display format
//                           : "Select Applications"} */ "Select Applications"
//                         }
//                         <ChevronsUpDown className="tw-ml-2 tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="tw-p-0 tw-w-[420px]">
//                       <Command>
//                         <CommandInput placeholder="Search Applications on your computer" />

//                         <ScrollArea className="tw-h-[170px]">
//                           <CommandEmpty>No application found.</CommandEmpty>

//                           <CommandGroup>
//                             {/* <div className="tw-text-sm">harro</div>{" "}
//                             <div className="tw-text-sm">harro</div>
//                             <div className="tw-text-sm">harro</div>
//                             <div className="tw-text-sm">harro</div>
//                             <div className="tw-text-sm">harro</div> */}
//                             {frameworks.map((framework) => (
//                               <div>
//                                 <CommandItem
//                                   className="tw-h-[56px]"
//                                   key={framework.key}
//                                   value={framework.value}
//                                   onSelect={(currentValue) => {
//                                     //newValues is a list of names of selected apps
//                                     newValues = value.includes(currentValue)
//                                       ? value.filter(
//                                           (v) => v !== currentValue
//                                         )
//                                       : [...value, currentValue];
//                                     setValue(newValues);
//                                     setNewValues(newValues);
//                                     if (newValues.length == 0) {
//                                       setArrayIsEmpty(true);
//                                     } else {
//                                       setArrayIsEmpty(false);
//                                     }
//                                     console.log(newValues);
//                                     // setOpen(false);
//                                   }}
//                                 >
//                                   <img
//                                     src={require("../../assets/images/vscode.jpg")}
//                                     className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
//                                   />

//                                   <p className="tw-p-2">{framework.label}</p>
//                                   <Check
//                                     className={cn(
//                                       "tw-mr-3 tw-h-4 tw-w-4 tw-absolute tw-right-0",
//                                       value.includes(framework.value)
//                                         ? "tw-opacity-100"
//                                         : "tw-opacity-0"
//                                     )}
//                                   />
//                                 </CommandItem>
//                               </div>
//                             ))}
//                           </CommandGroup>
//                         </ScrollArea>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>



//                     {/* <ScrollArea className="h-72 w-48 rounded-md border">
//                       <div className="p-4">
//                         <h4 className="mb-4 text-sm font-medium leading-none">
//                           Tags
//                         </h4>
//                         {tags.map((tag) => (
//                           <>
//                             <div key={tag} className="text-sm">
//                               {tag}
//                             </div>
                            
//                           </>
//                         ))}
//                       </div>
//                     </ScrollArea> */}

//                     {/* <ScrollArea className="h-20 w-48 rounded-md border">
//                       <div className="text-sm">harro</div>{" "}
//                       <div className="text-sm">harro</div>
//                       <div className="text-sm">harro</div>
//                       <div className="text-sm">harro</div>
//                       <div className="text-sm">harro</div>
//                     </ScrollArea> */}
//                   </div>
//                   <Label htmlFor="name" className="tw-text-left tw-text-gray-300">
//                     Applications selected:
//                   </Label>
//                   <Command>
//                     {/* <CommandInput placeholder="Search Applications on your computer" />
//                     <CommandEmpty>No application found.</CommandEmpty> */}
//                     <div className="tw-justify-center tw-items-center tw-flex">
//                       <ScrollArea className="tw-h-[120px] tw-w-[300px] tw-rounded-md tw-border">
//                         <CommandGroup>
//                           {/* <div className="tw-text-sm">harro</div>{" "}
//                               <div className="tw-text-sm">harro</div>
//                               <div className="tw-text-sm">harro</div>
//                               <div className="tw-text-sm">harro</div>
//                               <div className="tw-text-sm">harro</div> */}
//                           {arrayIsEmpty && (
//                             <div className="tw-text-[19px] tw-m-[40px] tw-text-foreground/90">
//                               No applications selected
//                             </div>
//                           )}
//                           {newValues.map((application) => (
//                             <div>
//                               <CommandItem
//                                 className="tw-aria-selected:bg-background tw-aria-selected:text-foreground tw-h-[56px]"
//                                 // key={framework.value}
//                                 // value={framework.value}
//                                 onSelect={() => {
//                                   //newValues is a list of names of selected apps
//                                   // newValues = value.includes(currentValue)
//                                   //   ? value.filter((v) => v !== currentValue)
//                                   //   : [...value, currentValue];
//                                   // setValue(newValues);
//                                   console.log("harro");
//                                   // setOpen(false);
//                                 }}
//                               >
//                                 <img
//                                     src={require("../../assets/images/vscode.jpg")}
//                                       className="tw-w-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
//                                 />

//                                 <p className="tw-p-2">{application}</p>
//                               </CommandItem>
//                             </div>
//                           ))}
//                         </CommandGroup>
//                       </ScrollArea>
//                     </div>
//                   </Command>
//                   {/* <div className="tw-flex tw-flex-col tw-space-y-1.5"></div> */}
//                   {/* Reference for file handling: https://youtu.be/O4ybhvtUbCE?si=NwfToeXmE87DXPVl */}
//                   <Label htmlFor="name" className="tw-text-left tw-text-gray-300">
//                     Select file to be used:
//                   </Label>
//                   <Input
//                     className="tw-file:text-foreground tw-text-foreground/90"
//                     id="picture"
//                     type="file"
//                   />
//                 </div>
//               </div>
//             </form>
//           </CardContent>
//           <CardFooter className="tw-flex tw-justify-between">
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button onClick={handleConfirm}>Confirm</Button>
//           </CardFooter>
//         </Card>
//       </div>
//       {" "}
//     </div>
//   ) : (
//     ""
//   );
// }



let taskName = props.task[0].taskName;
let userID = "";
let taskDesc =
props.task[0].taskDesc
let documentFilePath = "";
let progress = props.task[0].progress;
let assignedDate = "Task Assigned: " + props.task[0]["assignedDate"][0] + " at " + props.task[0]["assignedDate"][1]; // Initialize with current date

let deadline = "Task Due: " + props.task[0]["deadline"][0] + " at " + props.task[0]["deadline"][1];
let taskStatus = props.task[0].taskStatus;
let completedTask = props.task[0].taskCompletedDate; // Or a specific Date if applicable

const [open, setOpen] = React.useState(false);
const [value, setValue] = React.useState(false);
var [checkmark, setcheckmark] = React.useState();

const [file, setFile] = React.useState();
var [newValues, setNewValues] = React.useState([]);
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
  {/* <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card Content</p>
    </CardContent>
    <CardFooter>
      <p>Card Footer</p>
    </CardFooter>
  </Card> */}
  {/* <h1 className="tw-position">Harro there!!!</h1>
  <Button onClick={() => props.setTrigger(false)}>Close</Button> */}
  {/* <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-60 tw-flex tw-justify-center tw-items-center tw-min-h-screen "> */}
  <div className="tw-fixed tw-inset-0  tw-flex tw-justify-center tw-items-center">
    {/* <div className="tw-relative"> */}
    {/* <div
        className={`tw-absolute tw-inset-0 tw-bg-primary tw-blur-[8px] tw-animate__animated ${
          props.trigger ? "tw-animate__fadeIn" : "tw-animate__fadeOut"
        }`}
      ></div> */}
    <Card
      className="tw-relative tw-w-[470px] tw-shadow-[0_0_10px_10px_rgba(91,206,255,0.3)] tw-border-2 tw-border-primary/80  tw-bg-zinc-900">
      <CardHeader>
        <CardTitle className="tw-text-gray-300">
          Task Assigned: {taskName}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form>
          <div className="tw-grid tw-w-full tw-items-center tw-gap-4">
            <div className="tw-flex tw-flex-col tw-space-y-1.5">
              <Label htmlFor="taskDesc" className="tw-text-left tw-text-gray-300">
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
              {/* 



                  Dropdown menu for selecting apps





               */}
              <div className="tw-flex tw-flex-col tw-space-y-5 tw-text-left tw-text-gray-300 ">
                <Label htmlFor="framework">
                  Applications required for this task:
                </Label>

                {/* <Select className="tw-w-[400px]">
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select Applications" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="neaxt">Nexgt.js</SelectItem>
                    <SelectItem value="svelstekit">SveltdeKit</SelectItem>
                    <SelectItem value="asdtro">Astrfo</SelectItem>
                    <SelectItem value="nucxt">Nuxht.js</SelectItem>
                    <SelectItem value="necxt">Nextm.js</SelectItem>
                    <SelectItem value="svveltekit">SveglteKit</SelectItem>

                    <SelectItem value="nehxt">Nexdt.js</SelectItem>
                    <SelectItem value="svetltekit">SvselteKit</SelectItem>
                    <SelectItem value="asytro">Aastro</SelectItem>
                    <SelectItem value="nuxt">Nuaxt.js</SelectItem>
                  </SelectContent>
                </Select> */}

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="tw-justify-between"
                    >
                      {
                        /*
                        shows the names of the apps chosen 
                        {value.length > 0
                        ? value.join(", ") // Or a more appropriate display format
                        : "Select Applications"} */ "Select Applications"
                      }
                      <ChevronsUpDown className="tw-ml-2 tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="tw-p-0 tw-w-[420px]">
                    <Command>
                      <CommandInput placeholder="Search Applications on your computer" className="tw-border-none tw-text-white" />

                      <ScrollArea className="tw-h-[170px]">
                        <CommandEmpty>No application found.</CommandEmpty>

                        <CommandGroup>
                          {/* <div className="tw-text-sm">harro</div>{" "}
                          <div className="tw-text-sm">harro</div>
                          <div className="tw-text-sm">harro</div>
                          <div className="tw-text-sm">harro</div>
                          <div className="tw-text-sm">harro</div>
                              backendData.apps.map(app=>{
                                console.log(app)
                              }
                          
                          */}

                        {/* {backendData.apps.map(app => (
                            <div>
                              <CommandItem
                                className="tw-h-[56px]"
                                // key={framework.key}
                                value={app}
                                onSelect={(currentValue) => {
                                  //newValues is a list of names of selected apps
                                  newValues = value.includes(currentValue)
                                    ? value.filter(
                                        (v) => v !== currentValue
                                      )
                                    : [...value, currentValue];
                                  setValue(newValues);
                                  setNewValues(newValues);
                                  if (newValues.length == 0) {
                                    setArrayIsEmpty(true);
                                  } else {
                                    setArrayIsEmpty(false);
                                  }
                                  // console.log(newValues);
                                  // console.log("value: " + value)
                                  // setOpen(false);
                                }}
                              >
                                <img
                                  src={require("../../assets/images/vscode.jpg")}
                                  className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                />

                                <p className="tw-p-2">{app}</p>
                                <Check
                                  className={cn(
                                    "tw-mr-3 tw-h-4 tw-w-4 tw-absolute tw-right-0",
                                    value.includes(app)
                                      ? "tw-opacity-100"
                                      : "tw-opacity-0"
                                  )}
                                />
                              </CommandItem>
                            </div>
                          ))}
*/}

















{/* 
                          {frameworks.map((framework) => (
                            <div>
                              <CommandItem
                                className="tw-h-[56px]"
                                key={framework.key}
                                value={framework.value}
                                onSelect={(currentValue) => {
                                  //newValues is a list of names of selected apps
                                  newValues = value.includes(currentValue)
                                    ? value.filter(
                                        (v) => v !== currentValue
                                      )
                                    : [...value, currentValue];
                                  // console.log(framework.key)
                                  // console.log(framework.value)

                                  setValue(newValues);
                                  setNewValues(newValues);
                                  if (newValues.length == 0) {
                                    setArrayIsEmpty(true);
                                  } else {
                                    setArrayIsEmpty(false);
                                  }
                                  // console.log(newValues);  
                                  // console.log(value);
                                  console.log(framework);
                                  console.log(newValues)
                                  // setOpen(false);
                                  
                                }}
                              >
                                <img
                                  src={require("../../assets/images/vscode.jpg")}
                                  className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                />

                                <p className="tw-p-2">{framework.key}</p>
                                <Check
                                  className={cn(
                                    "tw-mr-3 tw-h-4 tw-w-4 tw-absolute tw-right-0",
                                    newValues.includes(framework.name)
                                      ? "tw-opacity-100"
                                      : "tw-opacity-0"
                                  )}
                                />
                              </CommandItem>
                            </div>
                          ))} */}









                          {frameworks.map((framework) => (
                              <div>
                                {/* <CommandItem
                                  className="tw-h-[56px]"
                                  key={framework.name}
                                  value={framework.name}
                                  onSelect={() => {
                                    //newValues is a list of names of selected apps
                                    var currentValue = framework.name
                                    newValues = value.includes(currentValue)
                                      ? value.filter(
                                          (v) => v !== currentValue
                                        )
                                      : [...value, currentValue];
                                      // matchedCategories = applicationsList.filter(i => currentValue.indexOf() >= 0);
                                    setValue(value);
                                    setNewValues(newValues);
                                    setValue(newValues);
                                    setNewValues(newValues);
                                    applicationsList.push({
                  
                                      name: framework.name,
                                      caca: framework.caca,
                                      // "name": "7-Zip 23.01 (x64)",
                                      // "icon": "Git"
          
                                      //                                    <img src={require("../../assets/installedApps/" + framework.name + ".png")}
          
                                  })
                                                                        
                                  if (newValues.length == 0) {
                                      setArrayIsEmpty(true);
                                    } else {
                                      setArrayIsEmpty(false);
                                    }
                                    // if (applicationsList.length == 1) {
                                    //   setArrayIsEmpty(true);
                                    //   console.log(true)
                                    // } else {
                                    //   setArrayIsEmpty(false);
                                    //   console.log(false)
                                    // }
                                    // console.log("new values: ")

                                    // console.log(newValues);
                                    // console.log("framework.name: " + framework.name)
                                    // console.log("framework.icon: " + framework.icon)
                                    //                                       console.log("values: ")

                                    // console.log(value);
                                    
                                    // setOpen(false);
                                    // console.log(daa)
                                      // console.log("framework.name: " + framework.name)
                                      // console.log("new values: " + newValues)
                                      // console.log("framework.icon: " + framework.icon)
                                      // var string = ""
                                      // string = `"` + framework.icon + `"`;
                                      // console.log("string: " + string);
                                      console.log(applicationsList)
                                      console.log("matchedcategories: " + matchedCategories)
                                  }}
                                >
                                  <img src={framework.caca}
                                  className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                />

                                  <p className="tw-p-2">{framework.name}</p>
                               <Check
                                  className={cn(
                                    "tw-mr-3 tw-h-4 tw-w-4 tw-absolute tw-right-0",
                                    newValues.includes(framework.name)
                                      ? "tw-opacity-100"
                                      : "tw-opacity-0"
                                  )}
                                />
                                </CommandItem> */}

                              <CommandItem
                                  className="tw-h-[56px]"
                                  key={framework.name}
                                  value={framework.name}
                                  onSelect={() => {
                                    // console.log(isfound(framework.name))
                                    var check = false;

                                    
                                    //newValues is a list of names of selected apps
                                    var currentValue = framework.name
                                    
                                    var foundObject = applicationsList.find(item => item.name == currentValue);
                                    // console.log("found object: " + foundObject);
                                    setValue();

                                    // newValues = value.includes(currentValue)
                                    //   ? value.filter(
                                    //       (v) => v !== currentValue
                                    //     )
                                    //   : [...value, currentValue];

                                      // if(foundObject){
                                      //   check = true;
                                      //   applicationsList.splice(applicationsList.indexOf(foundObject), 1);
                                      //   setcheckmark(true)
                                      //   // setValue(false);

                                      // }else{
                                      //   check = false;
                                      //   applicationsList.push({
                                      //     "name": framework.name,
                                      //     "caca": framework.caca,
                                      // })

                                      // setApplicationsList(applicationsList);
                                      // setValue(true);
                                      // setcheckmark(false)
                                      // }
                                      // setApplicationsList(applicationsList);

                                      const updatedApplicationsList = foundObject
                                      ? [...applicationsList].filter(item => item !== foundObject)
                                      : [...applicationsList, { name: framework.name, caca: framework.caca }];
                                
                                    setApplicationsList(updatedApplicationsList);
                                    // console.log("upd: "+ updatedApplicationsList);
                                    // console.log("appslist: " + applicationsList);

                                      // matchedCategories = applicationsList.filter(i => currentValue.indexOf() >= 0);
                                    // setValue(value);
                                    // setNewValues(newValues);
                                    // setValue(newValues);
                                    // setNewValues(newValues);
                                  //   applicationsList.push({
                  
                                  //     name: framework.name,
                                  //     caca: framework.caca,
                                  //     // "name": "7-Zip 23.01 (x64)",
                                  //     // "icon": "Git"
          
                                  //     //                                    <img src={require("../../assets/installedApps/" + framework.name + ".png")}
          
                                  // })
    
      
                                    // if (applicationsList.length == 1) {
                                    //   setArrayIsEmpty(true);
                                    //   console.log(true)
                                    // } else {
                                    //   setArrayIsEmpty(false);
                                    //   console.log(false)
                                    // }
                                    // console.log("new values: ")

                                    // console.log(newValues);
                                    // console.log("framework.name: " + framework.name)
                                    // console.log("framework.icon: " + framework.icon)
                                    //                                       console.log("values: ")

                                    // console.log(value);
                                    
                                    // setOpen(false);
                                    // console.log(daa)
                                      // console.log("framework.name: " + framework.name)
                                      // console.log("new values: " + newValues)
                                      // console.log("framework.icon: " + framework.icon)
                                      // var string = ""
                                      // string = `"` + framework.icon + `"`;
                                      // console.log("string: " + string);
                                      // console.log("value: " + value    )
                                      // console.log("matchedcategories: " + matchedCategories)
                                      // console.log("apps find: " +                                     applicationsList.find(item => item.name === framework.name)
                                      // )
                                      // console.log("applicationsbyeahahah: " + applicationsList)
                                      // console.log("updatedapplicationsbyeahahah: " + applicationsList)

                                      // console.log(value)
                                     

                                  }}
                                >

                                  {framework.caca === "../../assets/images/defaultIconMac.png" ? (
                                    <img src={icon}
                                  className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                />
                                  ) : (
                                  <img src={framework.caca}
                                  className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                />
                                  )}
                                  

                                  <p className="tw-p-2">{framework.name}</p>
                               <Check
                                  className={cn(
                                    "tw-mr-3 tw-h-4 tw-w-4 tw-absolute tw-right-0",
                                    applicationsList.find(item => item.name == framework.name)
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



                  {/* <ScrollArea className="h-72 w-48 rounded-md border">
                    <div className="p-4">
                      <h4 className="mb-4 text-sm font-medium leading-none">
                        Tags
                      </h4>
                      {tags.map((tag) => (
                        <>
                          <div key={tag} className="text-sm">
                            {tag}
                          </div>
                          
                        </>
                      ))}
                    </div>
                  </ScrollArea> */}

                  {/* <ScrollArea className="h-20 w-48 rounded-md border">
                    <div className="text-sm">harro</div>{" "}
                    <div className="text-sm">harro</div>
                    <div className="text-sm">harro</div>
                    <div className="text-sm">harro</div>
                    <div className="text-sm">harro</div>
                  </ScrollArea> */}
                </div>
                <Label htmlFor="name" className="tw-text-left tw-text-gray-300">
                  Applications selected:
                </Label>
                <Command>
                  {/* <CommandInput placeholder="Search Applications on your computer" />
                  <CommandEmpty>No application found.</CommandEmpty> */}
                  <div className="tw-justify-center tw-items-center tw-flex">
                    <ScrollArea className="tw-h-[120px] tw-w-[300px] tw-rounded-md tw-border">
                      <CommandGroup>
                        {/* <div className="tw-text-sm">harro</div>{" "}
                            <div className="tw-text-sm">harro</div>
                            <div className="tw-text-sm">harro</div>
                            <div className="tw-text-sm">harro</div>
                            <div className="tw-text-sm">harro</div> */}
                        {(applicationsList.length === 0) && (
                          <div className="tw-text-[19px] tw-m-[40px] tw-text-foreground/90">
                            No applications selected
                          </div>
                        )}
                        {/* {newValues.map(application => ( */}
                        {applicationsList.map(application => (

                          <div>
                            <CommandItem
                              className="tw-aria-selected:bg-background tw-aria-selected:text-foreground tw-h-[56px]"
                              // key={framework.value}
                              // value={framework.value}
                              onSelect={() => {
                                //newValues is a list of names of selected apps
                                // newValues = value.includes(currentValue)
                                //   ? value.filter((v) => v !== currentValue)
                                //   : [...value, currentValue];
                                // setValue(newValues);
                                // console.log("harro");
                                // setOpen(false);

                                
                              }}
                            >
                              {application.caca === "../../assets/images/defaultIconMac.png" ? (
                                    <img src={icon}
                                  className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                />
                                  ) : (
                                  <img src={application.caca}
                                  className="tw-w-[38px] tw-h-[38px] tw-m-1 tw-p-0 tw-rounded-md tw-border-2 tw-border-gray-300"
                                />
                                  )}

                              <p className="tw-p-2 tw-text-[14px]">{application.name}</p>
                            </CommandItem>
                          </div>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </div>
                </Command>
                {/* <div className="tw-flex tw-flex-col tw-space-y-1.5"></div> */}
                {/* Reference for file handling: https://youtu.be/O4ybhvtUbCE?si=NwfToeXmE87DXPVl */}
                <Label htmlFor="name" className="tw-text-left tw-text-gray-300">
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
    </div>
    {" "}
  </div>
) : (
  ""
);
}
