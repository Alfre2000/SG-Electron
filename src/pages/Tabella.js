import { faSearch, faTrash, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { Placeholder, Table } from 'react-bootstrap';
import ConfirmModal from '../components/Modals/ConfirmModal/ConfirmModal';
import ModifyModal from '../components/Modals/ModifyModal/ModifyModal';
import MyToast from '../components/MyToast/MyToast';
import Paginator from '../components/Pagination/Paginator';
import PasswordModal from '../components/Modals/PasswordModal/PasswordModal';
import ViewModal from '../components/Modals/ViewModal/ViewModal';
import { findElementFromID, isDateRecent } from '../utils';
import { deleteRecord } from './utils';
import DefaultFormWrapper from './FormWrapper';

function Tabella({ headers, valori, data, setData, FormComponent, FormWrapper, url, date, onSuccess }) {
  const [showPasswordDeleteModal, setShowPasswordDeleteModal] = useState("0");
  const [showPasswordModifyModal, setShowPasswordModifyModal] = useState("0");
  const [showConfirmModal, setShowConfirmModal] = useState("0");
  const [showModifyModal, setShowModifyModal] = useState("0");
  const [showViewModal, setShowViewModal] = useState("0");
  const [deletedtoast, setDeletedtoast] = useState(false)
  const [modifytoast, setModifytoast] = useState(false)
  const handleRemove = (authed, show, setShow) => {
    if (authed) {
      deleteRecord(show, data, setData, url, onSuccess);
      setDeletedtoast(true)
      setTimeout(() => setDeletedtoast(false), 4000)
    }
    setShow("0");
  };
  const initialDataModify = showModifyModal !== "0" ? findElementFromID(showModifyModal, data.records.results) : {}
  const initialDataView = showViewModal !== "0" ? findElementFromID(showViewModal, data.records.results) : {}
  const nCols = date !== false ? headers.length + 5 : headers.length + 3
  FormComponent = FormComponent || (showModifyModal !== "0" && findElementFromID(showModifyModal, data.records.results).form) || (showViewModal !== "0" && findElementFromID(showViewModal, data.records.results).form)

  url = url || (showModifyModal !== "0" && findElementFromID(showModifyModal, data.records.results).url) || (showConfirmModal !== "0" && findElementFromID(showConfirmModal, data.records.results).url) || (showViewModal !== "0" && findElementFromID(showViewModal, data.records.results).url) 

  const FormWrapperComponent = FormWrapper ? FormWrapper : DefaultFormWrapper
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
            <FormWrapperComponent data={data} setData={setData} initialData={initialDataModify} url={url}
              onSuccess={(newData) => {
                setShowModifyModal("0");
                if (!onSuccess && newData) setData(newData);
                else if (onSuccess) onSuccess(newData);
                setModifytoast(true)
                setTimeout(() => setModifytoast(false), 4000)
                }}>
              <FormComponent data={data} initialData={initialDataModify} />
            </FormWrapperComponent>
          )}
      </ModifyModal>
      <ViewModal 
        show={showViewModal !== "0"}
        handleClose={() => setShowViewModal("0")}>
          {FormComponent && (
            <FormWrapperComponent data={data} setData={setData} initialData={initialDataView} url={url} view={true}>
              <FormComponent data={data} initialData={initialDataView}/>
            </FormWrapperComponent>
          )}
      </ViewModal>
      <Table striped bordered className="align-middle">
        <thead>
          <tr>
            {date !== false && (
              <>
                <th>Data</th>
                <th>Ora</th>
              </>
            )}
            {headers.map((el) => (
              <th key={el}>{el}</th>
            ))}
            <th>Vedi</th>
            <th>Modifica</th>
            <th>Elimina</th>
          </tr>
        </thead>
        <tbody>
          {data.records?.results && data.records.results.length > 0 && data.records.results.map((record, i) => (
            <tr key={record.id}>
              {date !== false && (
                <>
                  <td>{new Date(record.data).toLocaleDateString()}</td>
                  <td>{new Date(record.data).toLocaleTimeString().slice(0, 5)}</td>
                </>
              )}
              {valori.map((value, idx) => {
                let campo;
                if (value.includes("__")) {
                  campo = findElementFromID(record[value.split("__")[0]], data[value.split("__")[1]]).nome
                } else if (value.includes(".")) {
                  campo = record[value.split(".")[0]][value.split(".")[1]]
                } else {
                  campo = record[value];
                }
                return (
                  <td key={campo || idx}>{campo || "-"}</td>
                )
              })}
              <td className="cursor-pointer" onClick={() => setShowViewModal(record.id)}>
                <FontAwesomeIcon icon={faSearch} className="rotate-90" />
              </td>
              {i === 0 && isDateRecent(record.data) ? (
                <td className="cursor-pointer" onClick={() => setShowModifyModal(record.id)}>
                  <FontAwesomeIcon icon={faWrench} />
                </td>
              ) : (
                <td className="cursor-pointer"onClick={() => setShowPasswordModifyModal(record.id)}>
                  <FontAwesomeIcon icon={faWrench} />
                </td>
              )}
              {i === 0 && isDateRecent(record.data) ? (
                <td className="cursor-pointer" onClick={() => setShowConfirmModal(record.id)}>
                  <FontAwesomeIcon icon={faTrash} className="text-red-800" />
                </td>
              ) : (
                <td className="cursor-pointer" onClick={() => setShowPasswordDeleteModal(record.id)}>
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
      <Paginator 
        data={data.records}
        setData={(newData) => setData({...data, records: newData})}
      /> 
    </>
  )
}

export default Tabella