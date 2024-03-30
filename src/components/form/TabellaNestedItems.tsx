import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { capitalize } from "@utils/main";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import Input from "./Input";
import RemoveIcon from "./RemoveIcon";
import AddIcon from "./AddIcon";
import Hidden from "./Hidden";
import SearchSelect from "./SearchSelect";
import FileField from "./FileField";

type TabellaNestedItemsProps = {
  name: string;
  colonne: {
    name: string;
    type?: "text" | "password" | "email" | "number" | "select" | "hidden" | "file";
    label?: string;
    value?: any;
    options?: { value: string | number; label: string | number }[];
  }[];
};

function TabellaNestedItems({ name, colonne }: TabellaNestedItemsProps) {
  const form = useFormContext();
  const field = useFieldArray({ control: form.control, name: name });

  const effectRan = React.useRef(false);

  React.useEffect(() => {
    if (effectRan.current) return;
    if (field.fields.length === 0) {
      field.append({
        ...colonne.map((colonna) => ({ [colonna.name]: "" })),
      });
      effectRan.current = true;
    }
  }, [field, colonne]);
  return (
    // <Table containerClassName="overflow-visible" className="border align-middle text-sm text-center mb-3">
    <Table className="border align-middle text-sm text-center mb-3">
      <TableHeader>
        <TableRow className="hover:bg-white">
          {colonne.map((colonna) => {
            const header = colonna.label || capitalize(colonna.name).replace("_", " ");
            return (
              <TableHead className="border text-center h-10 font-semibold text-black" key={header}>
                {header}
              </TableHead>
            );
          })}
          <TableHead className="h-10 w-14"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {field.fields.map((item, index) => (
          <TableRow key={item.id} className="hover:bg-white">
            {colonne.map((colonna) => {
              const inputName = `${name}[${index}].${colonna.name}`;
              return (
                <TableCell
                  key={colonna.name}
                  className="border py-2 px-2"
                  style={{ width: 100 / colonne.length + "%" }}
                >
                  {colonna.type === "hidden" ? (
                    <Hidden name={inputName} value={colonna.value} />
                  ) : colonna.type === "select" ? (
                    <SearchSelect name={inputName} label={false} options={colonna.options || []} />
                  ) : colonna.type === "file" ? (
                    <FileField name={inputName} label={false} />
                  ) : (
                    <Input name={inputName} label={false} type={colonna.type || "text"} />
                  )}
                </TableCell>
              );
            })}
            <TableCell className="border py-2 px-2">
              <RemoveIcon onClick={() => field.remove(index)} disabled={form.formState.disabled} />
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="hover:bg-white">
          <TableCell colSpan={colonne.length + 1} className="border py-2 px-2">
            <AddIcon
              onClick={() => field.append({ ...colonne.map((colonna) => ({ [colonna.name]: "" })) })}
              disabled={form.formState.disabled}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default TabellaNestedItems;
