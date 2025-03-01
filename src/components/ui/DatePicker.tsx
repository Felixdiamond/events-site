"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { SelectSingleEventHandler } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date | null
  onSelect?: SelectSingleEventHandler
  className?: string
}

export function DatePickerDemo({ date, onSelect, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal border-white/10 bg-white/5 text-white hover:bg-black/20",
            !date && "text-white/60",
            className
          )}
        >
          <CalendarIcon className="opacity-60" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-secondary border-white/10" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={onSelect}
          initialFocus
          className="bg-secondary"
        />
      </PopoverContent>
    </Popover>
  )
}
