import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Placeholder, Table } from 'react-bootstrap';
import Paginator from '../components/Pagination/Paginator';
import { findElementFromID } from '../utils';
import { findNestedElement } from './utils';
import FilterPopup from '../components/FilterPopup/FilterPopup';
import useCustomQuery from '../hooks/useCustomQuery/useCustomQuery';
import useCustomQueries from '../hooks/useCustomQueries/useCustomQueries';
import { usePageContext } from '../contexts/PageContext';
import MoreActions from '../components/MoreActions/MoreActions';

function Tabella({ headers, valori, queries = {}, date, hoursModify = 2, filtering = true, types, defaultFilters = {}, parser, onModify, onDelete, colSizes, canCopy, canDelete }) {
  const { impiantoFilter, queryKey, filters, setFilters, setPage } = usePageContext();

  headers = headers || valori.map(v => v.split("__").at(0).replace(/_/g, " ").replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))))

  const query = useCustomQuery({ queryKey: queryKey, keepPreviousData: true }, {
    select: parser ? parser : (data) => data
  });

  const auxQueries = useCustomQueries(queries, impiantoFilter)
  
  const ready = query.isSuccess && Object.values(auxQueries).every(query => query.isSuccess)

  const submit = (newFilters) => {
    Object.keys(newFilters.filters).forEach((k) => {
      if (newFilters.filters[k] === undefined) delete newFilters.filters[k];
    });
    newFilters = {ordering: newFilters.ordering || filters.ordering, filters: {...filters.filters, ...newFilters.filters}}
    setFilters(newFilters)
    setPage(1)
  }

  const nCols = date !== false ? headers.length + 3 : headers.length + 1

  const totWidth = 100 - 8 - (date !== false ? 30 : 0) 
  // rescale colSizes to fit the table
  if (colSizes) {
    const sum = colSizes.reduce((a, b) => a + b, 0)
    colSizes = colSizes.map((el) => Math.round(el / sum * totWidth))
  }

  canCopy = canCopy !== undefined ? canCopy : true
  canDelete = canDelete !== undefined ? canDelete : true


  types = types || new Array(valori.length).fill("text")
  return (
    <>
      <Table striped bordered className="align-middle table-fixed">
        <thead>
          <tr>
            {date !== false && (
              <>
                <th className='relative w-[15%]'>
                  Data
                  {filtering && (
                    <FilterPopup label="Data" name="data" defaultFilters={defaultFilters} submit={submit} type="date" />
                  )}
                </th>
                <th className='relative w-[15%]'>
                  Ora
                  {filtering && (
                    <FilterPopup label="Ora" name="ora" defaultFilters={defaultFilters} submit={submit} type="time" />
                  )}
                </th>
              </>
            )}
            {headers.map((el, idx) => (
              <th key={el} className={`relative ${colSizes ? "w-[" + colSizes[idx] + "%]" : ""}`} style={{ width: colSizes ? colSizes[idx] + "%" : "auto"}}>
                {el}
                {filtering && (
                  <FilterPopup label={el} name={valori[idx]} defaultFilters={defaultFilters} submit={submit} type={types[idx]} />
                )}
              </th>
            ))}
            <th className='w-[8%]'>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {ready && query.data.results.length > 0 && query.data.results.map((record, i) => (
            <tr key={record.id}>
              {date !== false && (
                <>
                  <td className='w-[15%]'>{new Date(record.data).toLocaleDateString()}</td>
                  <td className='w-[15%]'>{new Date(record.data).toLocaleTimeString().slice(0, 5)}</td>
                </>
              )}
              {valori.map((value, idx) => {
                let campo;
                if (value.split('__').length === 2) {
                  campo = findElementFromID(record[value.split("__")[0]], auxQueries[value.split("__")[1]].data).nome
                } else {
                  campo = findNestedElement(record, value)
                }
                if (typeof campo === "number") {
                  campo = campo.toLocaleString()
                }
                if (types[idx] === "boolean") {
                  return (
                    <td key={campo || idx} className={`text-center ${colSizes ? "w-[" + colSizes[idx] + "%]" : ""}`}>
                      <FontAwesomeIcon className="border-0 bg-transparent" icon={campo === true ? faCheck : faXmark} />
                    </td>
                  )
                }
                return (
                  <td className={`whitespace-nowrap overflow-hidden text-ellipsis ${colSizes ? "w-[" + colSizes[idx] + "%]" : ""}`} key={campo || idx}>
                    {campo || "-"}
                  </td>
                )
              })}
              <td className='w-[8%]'><MoreActions record={record} view={true} modify={true} copy={canCopy} del={canDelete} onModify={onModify} onDelete={onDelete} /></td>
            </tr>
          ))}
          {ready && query.data.results.length === 0 && (
            <tr>
              <td colSpan={nCols}>Nessun record presente</td>
            </tr>
          )}
          {query.isLoading && Array.from(Array(25)).map((_, idx) => (
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
      <Paginator data={query.data} setPage={setPage} /> 
    </>
  )
}

export default Tabella