import { useState } from "react";
import ModifyModal from "../../Modals/ModifyModal/ModifyModal";
import { toast } from "sonner";
import Form from "../../../pages/Form";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Modify<TData>({ record }: { record: TData }) {
  const [isOpen, setIsOpen] = useState(false);

  const onSuccess = () => {
    setIsOpen(false);
    toast.success("Record modificato con successo!");
  };
  return (
    <>
      <p className="hover:bg-gray-100 px-4 py-1.5 cursor-pointer text-sm" onClick={() => setIsOpen(true)}>
        <FontAwesomeIcon icon={faWrench} size="sm" className="mr-3" />
        Modifica
      </p>
      <hr className="w-full text-gray-900" />
      <div onClick={(e) => e.stopPropagation()}>
        <ModifyModal show={isOpen} handleClose={() => setIsOpen(false)}>
          <Form initialData={record} onSuccess={onSuccess as any} />
        </ModifyModal>
      </div>
    </>
  );
}

export default Modify;
