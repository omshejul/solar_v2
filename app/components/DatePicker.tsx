"use client";

import * as React from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export function DatePicker({ date, onDateChange, className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const goToPreviousDay = () => {
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);
    onDateChange(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    onDateChange(nextDay);
  };

  const isToday = (dateToCheck: Date) => {
    const today = new Date();
    return (
      dateToCheck.getDate() === today.getDate() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getFullYear() === today.getFullYear()
    );
  };

  const isFutureDate = (dateToCheck: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck > today;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Previous Day Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousDay}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous day</span>
      </Button>

      {/* Date Picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            size="sm"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <span className="flex items-center gap-2">
                {format(date, "MMM dd, yyyy")}
                {isToday(date) && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </span>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                onDateChange(selectedDate);
                setOpen(false);
              }
            }}
            disabled={(date) => isFutureDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Next Day Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextDay}
        disabled={isFutureDate(new Date(date.getTime() + 24 * 60 * 60 * 1000))}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next day</span>
      </Button>
    </div>
  );
}
