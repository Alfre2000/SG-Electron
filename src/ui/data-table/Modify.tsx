import { toast } from "sonner";
// import Form from "@pages/Form";
import ModifyModal from "@components/Modals/ModifyModal/ModifyModal";
import { usePageContext } from "@contexts/PageContext";

type ModifyProps<TData> = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  record: TData;
  onSuccess?: (data: TData[]) => void;
};

function Modify<TData>({ isOpen, setIsOpen, record, onSuccess }: ModifyProps<TData>) {
  const { FormComponent } = usePageContext();
  const onSuccessModify = (data: TData[]) => {
    setIsOpen(false);
    toast.success("Record modificato con successo!");
    if (onSuccess) onSuccess(data);
  };
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ModifyModal show={isOpen} handleClose={() => setIsOpen(false)}>
        <FormComponent initialData={record} onSuccess={onSuccessModify as any} />
        {/* <Form initialData={record} onSuccess={onSuccessModify as any} /> */}
      </ModifyModal>
    </div>
  );
}

export default Modify;
