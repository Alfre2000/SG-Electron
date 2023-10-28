import React from "react";
import ModifyModal from "../../Modals/ModifyModal/ModifyModal";
import { toast } from 'sonner';
import Form from "../../../pages/Form";

function Modify({ record, isOpen, setIsOpen, onModify }) {
  const onSuccess = (response, queryClient) => {
    if(onModify) onModify(response, queryClient)
    setIsOpen(false);
    toast.success("Record modificato con successo!");
  }
  return (
    <ModifyModal
      show={!!isOpen}
      handleClose={() => setIsOpen(false)}
    >
      <Form initialData={record} onSuccess={onSuccess} />
    </ModifyModal>
  );
}

export default Modify;
