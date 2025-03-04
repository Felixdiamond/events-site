"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0 flex justify-center", className)}
      classNames={{
        months: "flex flex-col space-y-3 items-center",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-secondary-dark"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex w-full mt-2",
        head_cell: "text-white/70 w-9 font-normal text-[0.8rem] rounded-md",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-secondary-dark/50 [&:has([aria-selected].day-outside)]:bg-secondary-dark/30 [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-secondary-dark hover:text-white",
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary-dark hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground focus:ring-0",
        day_today: "bg-secondary-dark text-white",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-secondary-dark/80 aria-selected:text-white hover:bg-secondary-dark hover:text-white",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "day-range-middle aria-selected:bg-secondary-dark/50 aria-selected:text-white hover:bg-secondary-dark hover:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
