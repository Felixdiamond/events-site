"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { motion } from "framer-motion"

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
  onSelect?: (date: Date | undefined) => void
  className?: string
}

export function DatePicker({ date, onSelect, className }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? new Date(date) : undefined
  )
  const [open, setOpen] = React.useState(false)

  // Create a fully formatted display date that copies all properties
  React.useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date))
    }
  }, [date])

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleApply = () => {
    onSelect?.(selectedDate)
    setOpen(false)
  }

  const handleClear = () => {
    setSelectedDate(undefined)
    onSelect?.(undefined)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal border-white/10 bg-white/5 text-white hover:bg-secondary-dark hover:text-white",
            !selectedDate && "text-white/60",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 opacity-70" />
            {selectedDate ? (
              <span>{format(selectedDate, "PPP")}</span>
            ) : (
              <span>Select date</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] bg-secondary border-white/10 p-0" 
        align="start"
      >
        <div className="p-3 border-b border-white/10">
          <h2 className="text-sm font-medium text-white/80">Select Date</h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex justify-center items-center"
        >
          <div className="w-full flex justify-center p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              initialFocus
              className="bg-secondary border-0"
            />
          </div>
        </motion.div>
        
        <div className="p-3 border-t border-white/10 flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClear}
            className="text-white/80 border-white/10 hover:bg-secondary-dark"
          >
            Clear
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleApply}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
