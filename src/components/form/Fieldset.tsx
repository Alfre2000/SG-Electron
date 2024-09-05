import { cn } from "@lib/utils";

type FieldsetProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
    legendClassName?: string;
  };
  
  function Fieldset({ title, children, className, legendClassName }: FieldsetProps) {
    return (
      <fieldset
        className={`${className || ""} border-[groove] border-2 px-8 py-1 m-0 rounded-md border-blue-100 mb-4`}
        style={{ borderStyle: "groove" }}
      >
        <legend className={cn("mb-2 px-3 text-left uppercase font-semibold text-nav-blue text-lg float-none w-fit", legendClassName)}>
          {title}
        </legend>
        {children}
      </fieldset>
    );
  }
  
  export default Fieldset;
  