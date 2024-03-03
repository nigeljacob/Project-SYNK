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
import { Textarea } from "../../shadCN-UI/ui/textarea";
import { Calendar } from "../../shadCN-UI/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../shadCN-UI/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadCN-UI/ui/popover";
import React, { useState } from "react";
import {assignTask } from "../../../../Backend/src/AssignTask/taskFunctions"

export default function AssignTask(props) {
  const [date, setDate] = useState(new Date());
  const [taskName, setTaskName] = useState();
  const [taskDesc, setTaskDesc] = useState();
  const [deadline, setDeadline] = useState();

  const handleClose = () => {
    props.setTrigger(false);
    console.log("`props.trigger` is now false");
  };

  const handleSubmit=()=>{
    let month = date.getMonth() + 1
    let hours = date.getHours();
    if (hours < 10) hours = "0" + hours;
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    const onSuccess = (boolean)=>{
      handleClose()
    }

    console.log(props.currentTeam)

    assignTask(props.currentUser.UID, props.currentTeam, props.index, taskName, taskDesc, [date.getDate() + "/" + month + "/" + date.getFullYear(), hours + ":" + minutes], onSuccess)
  }

  return props.trigger ? (
    <div className="tw-justify-center tw-items-center tw-shadow-[0_0_16px_#5bbfff]">
<Card
          className="tw-w-[400px] tw-border-2 tw-border-primary/80  tw-bg-zinc-900">
          <CardHeader>
            <CardTitle className="tw-text-gray-300 tw-items-center">
              Assign a task to {props.currentUser["name"]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="tw-grid tw-w-full tw-items-center tw-gap-4">
                <div className="tw-flex tw-flex-col tw-space-y-1.5">
                  <Label htmlFor="name" className="tw-text-left tw-text-gray-300">
                    Task name:
                  </Label>
                  <Input id="name" value={taskName} onChange={event=>{setTaskName(event.target.value)}} className="tw-bg-transparent tw-text-gray-300" />
                </div>
                <div className="tw-flex tw-flex-col tw-space-y-1.5 tw-text-left tw-text-gray-300 ">
                  <Label htmlFor="framework">Task description:</Label>
                  <Textarea value={taskDesc} onChange={event=>{setTaskDesc(event.target.value)}} className="tw-bg-transparent tw-text-gray-300"></Textarea>

                  {/* <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <div className="tw-flex tw-flex-col tw-space-y-1.5">
                  <Label htmlFor="name" className="tw-text-left tw-text-gray-300">
                    Deadline:
                  </Label>
                  {/* <br></br> */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"secondary"}
                        className={cn(
                          "tw-w-auto tw-justify-start tw-text-left tw-font-normal tw-text-gray-300 tw-border tw-border-input tw-hover:bg-secondary/10 tw-bg-background tw-important",
                          !date && "tw-text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="tw-mr-2 tw-h-4 tw-w-4" />
                        {date ? format(date, "PPP") : <div>Pick a date</div>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="tw-w-auto tw-p-0 tw-bg-background">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="tw-flex tw-justify-between">
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={event => {handleSubmit()}}>Confirm</Button>
          </CardFooter>
        </Card>
    </div>
  ) : null;
}
