import React from "react";
import ViewModal from "../../Modals/ViewModal/ViewModal";
import Form from "../../../pages/Form";

function View({ record, isOpen, setIsOpen }) {
  return (
    <ViewModal show={isOpen} handleClose={() => setIsOpen(false)}>
      <Form initialData={record} view={true} />
    </ViewModal>
  );
}

export default View;
