import * as React from "react";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { FormControl } from "./Form";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { cn } from "../../lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Matcher, SelectRangeEventHandler, SelectSingleEventHandler } from "react-day-picker";
import { DateRange } from "react-day-picker";
import { it } from "date-fns/locale";

type Props = {
  value?: Date | string;
  onChange: SelectSingleEventHandler;
  props?: any;
};

export function DatePicker({ value, onChange, ...props }: Props) {
  if (typeof value === "string") value = new Date(value);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal inline-flex items-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-start",
              !value && "text-muted-foreground"
            )}
          >
            {value ? format(value, "PPP", { locale: it }) : <span>Scegli una data</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => date < new Date()}
          initialFocus
          locale={it}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}


type DatePickerWithRangeProps = {
  value?: DateRange;
  onChange: SelectRangeEventHandler;
  disabled?: Matcher | Matcher[] | undefined;
};

export function DatePickerWithRange({ value, onChange, disabled }: DatePickerWithRangeProps) {
  const prevMonth = value?.from ? new Date(value.from) : undefined;
  if (prevMonth) prevMonth.setMonth(prevMonth.getMonth());
  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y", { locale: it })} - {format(value.to, "LLL dd, y", { locale: it })}
                </>
              ) : (
                format(value.from, "LLL dd, y", { locale: it })
              )
            ) : (
              <span>Seleziona un periodo</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={prevMonth}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            disabled={disabled}
            locale={it}
          />
        </PopoverContent>
      </Popover>
  );
}
