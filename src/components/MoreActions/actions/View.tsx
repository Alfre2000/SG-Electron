import { useState } from "react";
import ViewModal from "../../Modals/ViewModal/ViewModal";
import Form from "../../../pages/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Record } from "../../../interfaces/global";

function View({ record }: { record: Record }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <p
        className="hover:bg-gray-100 hover:rounded-t-md px-4 py-1.5 cursor-pointer text-sm relative z-10"
        onClick={() => setIsOpen(true)}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" className="mr-3" />
        Vedi
      </p>
      <hr className="w-full text-gray-900" />
      <div onClick={(e) => e.stopPropagation()}>
        <ViewModal show={isOpen} handleClose={() => setIsOpen(false)}>
          <Form initialData={record} view={true} />
        </ViewModal>
      </div>
    </>
  );
}

export default View;
