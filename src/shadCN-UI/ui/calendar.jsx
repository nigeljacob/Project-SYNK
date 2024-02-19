"use client";
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "src/shadCN-UI/lib/utils"
import { buttonVariants } from "src/shadCN-UI/ui/button"

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("tw-p-3", className)}
      classNames={{
        months: "tw-flex tw-flex-col sm:tw-flex-row tw-space-y-4 sm:tw-space-x-4 sm:tw-space-y-0",
        month: "tw-space-y-4",
        caption: "tw-flex tw-justify-center tw-pt-1 tw-relative tw-items-center",
        caption_label: "tw-text-sm tw-font-medium",
        nav: "tw-space-x-1 tw-flex tw-items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "tw-h-7 tw-w-7 tw-bg-transparent tw-p-0 tw-opacity-50 tw-hover:opacity-100"
        ),
        nav_button_previous: "tw-absolute tw-left-1",
        nav_button_next: "tw-absolute tw-right-1",
        table: "tw-w-full tw-border-collapse tw-space-y-1",
        head_row: "tw-flex",
        head_cell:
          "tw-text-muted-foreground tw-rounded-md tw-w-9 tw-font-normal tw-text-[0.8rem]",
        row: "tw-flex tw-w-full tw-mt-2",
        cell:
          "tw-h-9 tw-w-9 tw-text-center tw-text-sm tw-p-0 tw-relative [&:has([aria-selected].day-range-end)]:tw-rounded-r-md [&:has([aria-selected].day-outside)]:tw-bg-accent/50 [&:has([aria-selected])]:tw-bg-primary first:[&:has([aria-selected])]:tw-rounded-l-md last:[&:has([aria-selected])]:tw-rounded-r-md tw-focus-within:tw-relative tw-focus-within:tw-z-20 tw-rounded-md",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "tw-h-9 tw-w-9 tw-p-0 tw-font-normal tw-aria-selected:tw-opacity-100 tw-hover:tw-bg-white/10 tw-hover:tw-text-white"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "tw-bg-white-100 tw-text-primary-foreground tw-hover:tw-bg-primary tw-hover:tw-text-primary-foreground tw-focus:tw-bg-primary tw-rounded-md tw-focus:tw-text-primary-foreground",
        day_today: "tw-bg-white/10 tw-text-10",
        day_outside:
          "day-outside tw-text-muted-foreground tw-aria-selected:tw-bg-primary tw-aria-selected:tw-text-black",
        day_disabled: "tw-text-muted-foreground tw-opacity-50",
        day_range_middle:
          "tw-aria-selected:tw-bg-accent tw-aria-selected:tw-text-accent-foreground",
        day_hidden: "tw-invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="tw-h-4 tw-w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="tw-h-4 tw-w-4" />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
