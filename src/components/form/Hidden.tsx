import { FormField } from "@components/shadcn/Form";
import React from "react";
import { useFormContext } from "react-hook-form";

type HiddenProps = {
  name: string;
  value: any;
};

function Hidden({ name, value }: HiddenProps) {
  const form = useFormContext();

  React.useEffect(() => {
    form.setValue(name, value);
  }, [form, name, value]);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => <input {...field} type="hidden" name={name} />}
    />
  );
}

export default Hidden;
