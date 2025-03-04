"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"

interface DateTimePickerProps {
  date?: Date | null
  onSelect?: (date: Date | undefined) => void
  className?: string
  showTimeSelect?: boolean
}

export function DateTimePicker({ 
  date, 
  onSelect, 
  className,
  showTimeSelect = true
}: DateTimePickerProps) {
  // Refs for popover control
  const [open, setOpen] = React.useState(false)
  const popoverRef = React.useRef<HTMLDivElement>(null)

  // Internal state for date/time
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? new Date(date) : undefined
  )
  
  // Active tab state and animations
  const [activeTab, setActiveTab] = React.useState<"date" | "time">("date")
  const dateTabRef = React.useRef<HTMLDivElement>(null)
  const timeTabRef = React.useRef<HTMLDivElement>(null)

  // Create a fully formatted display date that copies all properties
  React.useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date))
    }
  }, [date])

  // Helper to create and format a date-time
  const createDateTime = (
    date: Date | undefined,
    hour: number,
    minute: number
  ): Date | undefined => {
    if (!date) return undefined
    
    const newDate = new Date(date)
    newDate.setHours(hour)
    newDate.setMinutes(minute)
    return newDate
  }

  // Handle date change from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined)
      return
    }

    let newDate: Date

    if (selectedDate) {
      // Keep the existing time when changing date
      const hours = selectedDate.getHours()
      const minutes = selectedDate.getMinutes()
      
      newDate = new Date(date)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
    } else {
      // Default to noon for new selections
      newDate = new Date(date)
      newDate.setHours(12)
      newDate.setMinutes(0)
    }

    setSelectedDate(newDate)
    
    // Auto-switch to time tab if time selection is enabled
    if (showTimeSelect) {
      setTimeout(() => setActiveTab("time"), 100)
    }
  }

  // Handle time changes
  const handleHourChange = (hour: string) => {
    const hourNum = parseInt(hour, 10)
    
    // If no date is selected, create one
    if (!selectedDate) {
      const newDate = new Date()
      
      // Handle 12-hour format properly
      let adjustedHour = hourNum
      if (hourNum === 12) {
        // 12 AM should be 0, 12 PM should be 12
        adjustedHour = isPM ? 12 : 0
      } else if (isPM) {
        // Add 12 for PM hours (except 12 PM)
        adjustedHour += 12
      }
      
      newDate.setHours(adjustedHour)
      newDate.setMinutes(0)
      setSelectedDate(newDate)
      return
    }
    
    // Update existing date's hour
    const newDate = new Date(selectedDate)
    
    // Handle 12-hour format properly
    let adjustedHour = hourNum
    if (hourNum === 12) {
      // 12 AM should be 0, 12 PM should be 12
      adjustedHour = isPM ? 12 : 0
    } else if (isPM) {
      // Add 12 for PM hours (except 12 PM)
      adjustedHour += 12
    }
    
    newDate.setHours(adjustedHour)
    setSelectedDate(newDate)
  }

  const handleMinuteChange = (minute: string) => {
    const minuteNum = parseInt(minute, 10)
    
    // If no date is selected, create one
    if (!selectedDate) {
      const newDate = new Date()
      newDate.setHours(12)
      newDate.setMinutes(minuteNum)
      setSelectedDate(newDate)
      return
    }
    
    // Update existing date's minute
    const newDate = new Date(selectedDate)
    newDate.setMinutes(minuteNum)
    setSelectedDate(newDate)
  }

  const handlePeriodChange = (period: string) => {
    if (!selectedDate) {
      const newDate = new Date()
      
      // Set to noon or midnight based on period
      if (period === "pm") {
        newDate.setHours(12)
      } else {
        newDate.setHours(0)
      }
      
      newDate.setMinutes(0)
      setSelectedDate(newDate)
      return
    }
    
    const newDate = new Date(selectedDate)
    const currentHour = newDate.getHours()
    
    if (period === "am" && currentHour >= 12) {
      // Convert from PM to AM
      newDate.setHours(currentHour - 12)
    } else if (period === "pm" && currentHour < 12) {
      // Convert from AM to PM
      newDate.setHours(currentHour + 12)
    }
    
    setSelectedDate(newDate)
  }

  // Handle Apply button
  const handleApply = () => {
    if (selectedDate) {
      onSelect?.(selectedDate)
    }
    setOpen(false)
  }
  
  // Handle Clear button
  const handleClear = () => {
    setSelectedDate(undefined)
    onSelect?.(undefined)
    setOpen(false)
  }

  // Generate time options for selects
  const hourOptions: SelectOption[] = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1 // 1-12
      return { 
        value: hour.toString(), 
        label: hour.toString().padStart(2, "0") 
      }
    })
  }, [])

  const minuteOptions: SelectOption[] = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const minute = i * 5 // 0, 5, 10, ..., 55
      return { 
        value: minute.toString(), 
        label: minute.toString().padStart(2, "0") 
      }
    })
  }, [])

  const periodOptions: SelectOption[] = React.useMemo(() => {
    return [
      { value: "am", label: "AM" },
      { value: "pm", label: "PM" }
    ]
  }, [])

  // Extract display values from the current date
  let displayHour = "12"
  let displayMinute = "00"
  let isPM = false

  if (selectedDate) {
    const hours = selectedDate.getHours()
    isPM = hours >= 12
    
    // Convert to 12-hour format
    displayHour = (hours % 12 || 12).toString()
    displayMinute = selectedDate.getMinutes().toString()
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
              <span>
                {format(selectedDate, showTimeSelect ? "PPP p" : "PPP")}
              </span>
            ) : (
              <span>Select date{showTimeSelect ? " & time" : ""}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        ref={popoverRef}
        className="w-[300px] bg-secondary border-white/10 p-0" 
        align="start"
      >
        {/* Modern Tabs Navigation */}
        <div className="relative">
          <div className="flex items-center justify-center border-b border-white/10">
            <div 
              className={cn(
                "flex-1 py-3 text-center cursor-pointer transition-colors duration-200", 
                activeTab === "date" ? "text-white" : "text-white/50 hover:text-white/70"
              )}
              onClick={() => setActiveTab("date")}
            >
              <span className="font-medium">Date</span>
            </div>
            
            {showTimeSelect && (
              <div 
                className={cn(
                  "flex-1 py-3 text-center cursor-pointer transition-colors duration-200", 
                  activeTab === "time" ? "text-white" : "text-white/50 hover:text-white/70"
                )}
                onClick={() => setActiveTab("time")}
              >
                <span className="font-medium">Time</span>
              </div>
            )}
            
            {/* Animated indicator */}
            <motion.div 
              className="absolute bottom-0 h-0.5 bg-primary"
              initial={false}
              animate={{
                left: activeTab === "date" ? "0%" : "50%",
                width: showTimeSelect ? "50%" : "100%"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
        
        {/* Tab Contents with Animations */}
        <div className="relative min-h-[350px]">
          <AnimatePresence mode="wait">
            {activeTab === "date" && (
              <motion.div
                key="date-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex justify-center items-center"
              >
                <div className="w-full flex justify-center p-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="bg-secondary border-0"
                  />
                </div>
              </motion.div>
            )}
            
            {activeTab === "time" && showTimeSelect && (
              <motion.div
                key="time-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center p-6"
              >
                <div className="w-full space-y-6 px-2 sm:px-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-white/60 block">Hour</label>
                      <CustomSelect
                        options={hourOptions}
                        value={displayHour}
                        onChange={handleHourChange}
                        placeholder="Hour"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-white/60 block">Minute</label>
                      <CustomSelect
                        options={minuteOptions}
                        value={displayMinute}
                        onChange={handleMinuteChange}
                        placeholder="Minute"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-white/60 block">AM/PM</label>
                      <CustomSelect
                        options={periodOptions}
                        value={isPM ? "pm" : "am"}
                        onChange={handlePeriodChange}
                        placeholder="AM/PM"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mt-4 p-3 bg-secondary-dark/40 rounded-lg">
                    <Clock className="text-primary mr-3" size={20} />
                    <span className="text-white text-lg font-medium">
                      {displayHour.padStart(2, "0")}:{displayMinute.padStart(2, "0")} {isPM ? 'PM' : 'AM'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
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
