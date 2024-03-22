import * as React from "react";
import { cn } from "../../lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { VariantProps, cva } from "class-variance-authority";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const inputVariants = cva(
  "flex h-10 w-full rounded-md border-[1px] border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-offset-0 focus-visible:ring-1",
  {
    variants: {
      variant: {
        default: "",
        destructive: "border-destructive/70 [&>svg]:text-destructive focus-visible:ring-offset focus-visible:ring-destructive/20 focus-visible:ring-4",
        success: "border-green-700/70 [&>svg]:text-green-700 focus-visible:ring-offset focus-visible:ring-green-700/20 focus-visible:ring-4",
        form: "focus-visible:border-blue-500/70 focus-visible:[&>svg]:text-blue-500 focus-visible:ring-offset focus-visible:ring-blue-500/20 focus-visible:ring-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Input = React.forwardRef<HTMLInputElement, InputProps & VariantProps<typeof inputVariants>>(
  ({ className, variant, type, ...props }, ref) => {
    return <input type={type} className={cn(inputVariants({ variant }), className)} ref={ref} {...props} />;
  }
);
Input.displayName = "Input";

export interface UmInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  um: string;
}

const UmInput = React.forwardRef<HTMLInputElement, UmInputProps>(({ className, type, um, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-offset-0 focus-visible:ring-1",
          className
        )}
        ref={ref}
        {...props}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-sm font-medium text-muted-foreground">{um}</span>
      </div>
    </div>
  );
});
UmInput.displayName = "Input";

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <div className="flex items-center border-b px-2">
      <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
});
SearchInput.displayName = "Input";

export { Input, UmInput, SearchInput };
