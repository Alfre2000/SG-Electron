import { Button } from "@components/shadcn/Button";
import { Calendar } from "@components/shadcn/Calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/shadcn/Form";
import { Popover, PopoverContent, PopoverTrigger } from "@components/shadcn/Popover";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@lib/utils";
import { CalendarIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useFormContext } from "react-hook-form";
import { capitalize, dateToDatePicker } from "utils";

type Props = {
  name: string;
  label?: string | boolean;
  inputColumns?: number;
  disabled?: boolean;
};

function DatePicker({ name, label, inputColumns = 8, disabled = false }: Props) {
  const form = useFormContext();

  const labelText = label || `${capitalize(name).replaceAll("_", " ")}:`;
  const colInput = label === false ? 12 : inputColumns;
  const colLabel = label === false ? 0 : 12 - colInput;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const success = Object.keys(formState.errors).length > 0 && !fieldState.invalid;
        const variant = fieldState.invalid ? "destructive" : success ? "success" : "form";
        return (
          <FormItem>
            <div className="grid grid-cols-12 items-center">
              {label !== false && (
                <FormLabel
                  style={{ gridColumn: `span ${colLabel} / span ${colLabel}` }}
                  className="text-left text-base font-normal"
                >
                  {labelText}
                </FormLabel>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl style={{ gridColumn: `span ${colInput} / span ${colInput}` }}>
                    <div>
                      <div className="relative">
                        <Button
                          variant={"outline"}
                          type="button"
                          className={cn(
                            "w-[220px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", {
                              locale: it,
                            })
                          ) : (
                            <span>Seleziona una data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          {fieldState.invalid ? (
                            <span className="text-sm font-medium text-destructive">
                              <ExclamationTriangleIcon />
                            </span>
                          ) : success ? (
                            <span className="text-sm font-medium text-green-700">
                              <FontAwesomeIcon icon={faCheck} />
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <FormMessage className="mt-1.5 text-xs text-destructive font-normal" />
                    </div>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={typeof field.value === "string" ? new Date(field.value) : field.value}
                    onSelect={(date) => {
                      return field.onChange(!!date ? dateToDatePicker(date) : date)}}
                    disabled={formState.disabled || disabled}
                    locale={it}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormItem>
        );
      }}
    />
  );
}

export default DatePicker;
