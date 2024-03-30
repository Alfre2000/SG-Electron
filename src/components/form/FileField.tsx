import React from "react";
import { Input as ShadcnInput } from "@components/shadcn/Input";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@components/shadcn/Form";
import { useFormContext } from "react-hook-form";
import { capitalize } from "@utils/main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import ImageModal from "@components/Modals/ImageModal/ImageModal";
const electron = window?.require ? window.require("electron") : null;

type FileFieldProps = {
  name: string;
  label?: string | boolean;
  inputColumns?: number;
};

const FileField = React.forwardRef(({ name, label, inputColumns = 8 }: FileFieldProps, ref) => {
  const [showModal, setShowModal] = React.useState(false);

  const handleClick = (isImage: boolean, defaultValue: any) => {
    if (isImage) {
      setShowModal(true);
    } else {
      electron.ipcRenderer.invoke("open-file", defaultValue);
    }
  };
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
        const defaultValue = field.value;
        const isImage = ["png", "jpg", "jpeg"].includes(defaultValue?.split(".")?.at(-1).toLowerCase());
        const Input = () => (
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
              <FormControl style={{ gridColumn: `span ${colInput} / span ${colInput}` }}>
                <div>
                  <div className="relative">
                    <ShadcnInput
                      {...field}
                      value={field.value?.fileName}
                      // variant={variant}
                      disabled={formState.disabled}
                      type="file"
                      className="h-8 pt-1 w-full rounded-sm disabled:bg-[#eaecef] disabled:opacity-1 disabled:border-gray-300 disabled:cursor-auto"
                    />
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
            </div>
          </FormItem>
        );

        if (defaultValue) {
          return (
            <>
              <div className={`text-left px-2 ${formState.disabled ? "text-center" : "mb-1"}`}>
                <span className="font-medium">Attualmente:</span>
                <span
                  className="pl-6 hover:underline-offset-1 hover:underline hover:cursor-pointer"
                  onClick={() => handleClick(isImage, defaultValue)}
                >
                  {defaultValue?.split("/")?.at(-1)?.split("?")?.[0]}
                </span>
                {showModal && <ImageModal setShow={setShowModal} url={defaultValue} />}
              </div>
              {!formState.disabled && (
                <div className="flex items-center gap-12 px-2">
                  <span className="font-medium">Modifica:</span>
                  <Input />
                </div>
              )}
            </>
          );
        }
        return <Input />;
      }}
    />
  );
});

export default FileField;
