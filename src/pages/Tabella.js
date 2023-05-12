import { faSearch, faTrash, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react'
import { Placeholder, Table } from 'react-bootstrap';
import ConfirmModal from '../components/Modals/ConfirmModal/ConfirmModal';
import ModifyModal from '../components/Modals/ModifyModal/ModifyModal';
import MyToast from '../components/MyToast/MyToast';
import Paginator from '../components/Pagination/Paginator';
import PasswordModal from '../components/Modals/PasswordModal/PasswordModal';
import ViewModal from '../components/Modals/ViewModal/ViewModal';
import { findElementFromID, isDateRecent } from '../utils';
import { deleteRecord, findNestedElement } from './utils';
import DefaultFormWrapper from './FormWrapper';
import FilterPopup from '../components/FilterPopup/FilterPopup';
import { apiGet } from '../api/api';
import UserContext from '../UserContext';

function Tabella({ headers, valori, data, setData, FormComponent, FormWrapper, url, date, onSuccess, hoursModify = 2, filtering = true, types }) {
  const { user } = useContext(UserContext);
  const impianto = user?.user?.impianto;
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
  const [filters, setFilters] = useState({ ordering: "", filters: {} })
  types = types || new Array(valori.length).fill("text")
  const submit = (newFilters) => {
    const filterParams = newFilters ? newFilters : filters
    const params = new URLSearchParams(Object.entries(filterParams.filters).filter(([k, v]) => !!v))
    params.set("ordering", filterParams.ordering)
    if (impianto?.id) params.append("impianto", impianto.id);
    params.set("page", 1);
    apiGet(`${url}?${params.toString()}`).then(
      res => setData(prev => ({...prev, records: res}))
    )
  }
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
                <th className='relative'>
                  Data
                  {filtering && (
                    <FilterPopup label="Data" name="data" update={setFilters} filters={filters} submit={submit} type="date" />
                  )}
                </th>
                <th className='relative'>
                  Ora
                  {filtering && (
                    <FilterPopup label="Ora" name="ora" update={setFilters} filters={filters} submit={submit} type="time" />
                  )}
                </th>
              </>
            )}
            {headers.map((el, idx) => (
              <th key={el} className='relative'>
                {el}
                {filtering && (
                  <FilterPopup label={el} name={valori[idx]} update={setFilters} filters={filters} submit={submit} type={types[idx]} />
                )}
              </th>
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
                if (value.split('__').length === 2) {
                  campo = findElementFromID(record[value.split("__")[0]], data[value.split("__")[1]]).nome
                } else {
                  campo = findNestedElement(record, value)
                }
                return (
                  <td key={campo || idx}>{campo || "-"}</td>
                )
              })}
              <td className="cursor-pointer" onClick={() => setShowViewModal(record.id)}>
                <FontAwesomeIcon icon={faSearch} className="rotate-90" />
              </td>
              {i === 0 && isDateRecent(record.data, hoursModify) ? (
                <td className="cursor-pointer" onClick={() => setShowModifyModal(record.id)}>
                  <FontAwesomeIcon icon={faWrench} />
                </td>
              ) : (
                <td className="cursor-pointer"onClick={() => setShowPasswordModifyModal(record.id)}>
                  <FontAwesomeIcon icon={faWrench} />
                </td>
              )}
              {i === 0 && isDateRecent(record.data, hoursModify) ? (
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