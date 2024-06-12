import { FormField } from "@components/shadcn/Form";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox as ShadcnCheckbox } from "@components/shadcn/Checkbox";

type CheckboxProps = {
  name: string;
  className?: string;
};

function Checkbox({ name, className }: CheckboxProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => <ShadcnCheckbox {...field} className={className} />}
    />
  );
}

export default Checkbox;
