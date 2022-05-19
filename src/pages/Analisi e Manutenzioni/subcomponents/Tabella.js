import { faTrash, faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Placeholder, Table } from "react-bootstrap";
import ConfirmModal from "../../../components/ConfirmModal.js/ConfirmModal";
import ModifyModal from "../../../components/ModifyModal/ModifyModal";
import MyToast from "../../../components/MyToast/MyToast";
import PasswordModal from "../../../components/PasswordModal/PasswordModal";
import { getOperatoreName } from "../../../utils";
import { deleteRecord } from "../utils";
import FormWrapper from "./FormWrapper";

function Tabella({ headers, data, setData, FormComponent }) {
  const [showPasswordDeleteModal, setShowPasswordDeleteModal] = useState("0");
  const [showPasswordModifyModal, setShowPasswordModifyModal] = useState("0");
  const [showConfirmModal, setShowConfirmModal] = useState("0");
  const [showModifyModal, setShowModifyModal] = useState("0");
  const [deletedtoast, setDeletedtoast] = useState(false)
  const [modifytoast, setModifytoast] = useState(false)
  const nCols = headers.length + 2;
  const handleRemove = (authed, show, setShow) => {
    if (authed) {
      deleteRecord(show, data, setData);
      setDeletedtoast(true)
      setTimeout(() => setDeletedtoast(false), 4000)
    }
    setShow("0");
  };
  const isRecent = (date) => {
    const recordDate = new Date(date)
    const now = new Date()
    return Math.abs(now - recordDate) / 36e5 < 2;
  }
  const initialData = showModifyModal !== "0" ? data.records.filter(el => el.id === showModifyModal)[0] : {}
  return (
    <>
    {deletedtoast && <MyToast>Record eliminato con successo !</MyToast>}
    {modifytoast && <MyToast>Record modificato con successo !</MyToast>}
    <PasswordModal 
      show={showPasswordDeleteModal !== "0"}
      onSuccess={() => {
        setShowConfirmModal(showPasswordDeleteModal)
        setShowPasswordDeleteModal("0")
      }}
      onFail={() => setShowPasswordDeleteModal("0")}
    />
    <PasswordModal 
      show={showPasswordModifyModal !== "0"}
      onSuccess={() => {
        setShowModifyModal(showPasswordModifyModal);
        setShowPasswordModifyModal("0")
      }}
      onFail={() =>  setShowPasswordModifyModal("0")}
    />
    <ConfirmModal 
      show={showConfirmModal !== "0"} 
      handleClose={(confirm) => handleRemove(confirm, showConfirmModal, setShowConfirmModal)}
    />
    <ModifyModal 
      show={showModifyModal !== "0"}
      handleClose={() => setShowModifyModal("0")}>
        {FormComponent && (
          <FormWrapper data={data} setData={setData} initialData={initialData} 
            onSuccess={() => {
              setShowModifyModal("0");
              setModifytoast(true)
              setTimeout(() => setModifytoast(false), 4000)
              }}>
            <FormComponent data={data} initialData={initialData} />
          </FormWrapper>
        )}
    </ModifyModal>
      <Table striped bordered>
        <thead>
          <tr>
            {headers.map((el) => (
              <th key={el}>{el.replace('_', ' ').replace('N', 'N°')}</th>
            ))}
            <th>Modifica</th>
            <th>Elimina</th>
          </tr>
        </thead>
        <tbody>
          {data.records && data.records.length > 0 && data.records.map((record, i) => (
                <tr key={record.id}>
                  {headers.map((el, idx) => {
                    const header = el.toLowerCase()
                    let value;
                    if (header === "data") value = new Date(record.data).toLocaleDateString();
                    else if (header === "ora") value = new Date(record.data).toLocaleTimeString().slice(0, 5);
                    else if (header === "operatore") value = getOperatoreName(record.operatore, data.operatori);
                    else if (header === "analisi") value = data.operazioni.filter(el => el.id === record.operazione)[0]?.nome
                    else if (header === "manutenzione") value = data.operazioni.filter(el => el.id === record.operazione)[0]?.nome
                    else if (header === "n_pezzi") value = record['n_pezzi_dichiarati']
                    else if (header === "ph") value = record.record_parametri[0].valore
                    else value = record[header];
                    return <td key={value || idx}>{value || "-"}</td>
                  })}
                  {i === 0 && isRecent(record.data) ? (
                    <td className="cursor-pointer" onClick={() => setShowModifyModal(record.id)}>
                      <FontAwesomeIcon icon={faWrench} />
                    </td>
                  ) : (
                    <td className="cursor-pointer"onClick={() => setShowPasswordModifyModal(record.id)}>
                      <FontAwesomeIcon icon={faWrench} />
                    </td>
                  )}
                  {i === 0 && isRecent(record.data) ? (
                    <td className="cursor-pointer" onClick={() => setShowConfirmModal(record.id)}>
                      <FontAwesomeIcon icon={faTrash} className="text-red-800" />
                    </td>
                  ) : (
                    <td className="cursor-pointer"onClick={() => setShowPasswordDeleteModal(record.id)}>
                      <FontAwesomeIcon icon={faTrash} className="text-red-800" />
                    </td>
                  )}
                </tr>
              ))}
            {data.records && data.records.length === 0 && (
              <tr>
                <td colSpan={nCols}>Nessun record presente</td>
              </tr>
            )}
            {!data.records && Array.from(Array(nCols)).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={nCols}>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} className="rounded-md" />
                    </Placeholder>
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
    </>
  );
}

export default Tabella;
