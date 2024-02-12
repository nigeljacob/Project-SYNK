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
import { useState } from "react";

export default function AssignTask(props) {
  const [date, setDate] = useState(new Date());

  const handleClose = () => {
    props.setTrigger(false);
    console.log("`props.trigger` is now false");
  };

  return props.trigger ? (
    <div>
     <Card
          className={`tw-relative tw-w-[400px] tw-border-2 tw-border-primary/80 tw-shadow-[0_0_16px_#5bceff] tw-bg-zinc-900 animate__animated ${
            props.trigger ? "animate__fadeIn" : "animate__fadeOut"
          }`}
        >
          <CardHeader>
            <CardTitle className="tw-text-gray-300">
              Assign a task to {props.currentUser}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="tw-grid tw-w-full tw-items-center tw-gap-4">
                <div className="tw-flex tw-flex-col tw-space-y-1.5">
                  <Label htmlFor="name" className="tw-text-left tw-text-gray-300">
                    Task name:
                  </Label>
                  <Input id="name" className="bg-transparent text-gray-300" />
                </div>
                <div className="flex flex-col space-y-1.5 text-left text-gray-300 ">
                  <Label htmlFor="framework">Task description:</Label>
                  <Textarea className="bg-transparent text-gray-300"></Textarea>

                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name" className="text-left text-gray-300">
                    Deadline:
                  </Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"secondary"}
                        className={cn(
                          "tw-w-auto tw-justify-start tw-text-left tw-font-normal tw-bg-background tw-text-gray-300 tw-border tw-border-input tw-hover:bg-secondary/10 tw-ml-[10px]",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="tw-mr-2 tw-h-4 tw-w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
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
            <Button>Confirm</Button>
          </CardFooter>
        </Card>
    </div>
  ) : null;
}
