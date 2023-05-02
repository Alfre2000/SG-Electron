import React, { useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import SG from "../../../images/certificati/sg.png";
import ICIM from "../../../images/certificati/icim.png";
import { today } from "../../../utils";
import Input from "../../../components/form-components/Input";
import { useEffect } from "react";
import { apiGet } from "../../../api/api";
import { URLS } from "../../../urls";
import { ddtNumber, punti } from "./utils";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import NoCertificato from "./subComponents/NoCertificato";
import NoSchedaControllo from "./subComponents/NoSchedaControllo";
import NonCompletata from "./subComponents/NonCompletata";
import MyToast from "../../../components/MyToast/MyToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord } from "@fortawesome/free-solid-svg-icons";

function PreviewCertificato({ record, indietro }) {
  const [data, setData] = useState();
  const [successToast, setSuccessToast] = useState(false);
  const [DDT, setDDT] = useState(`${new Date().getFullYear()}.00`);
  const [fileType, setFileType] = useState("");
  useEffect(() => {
    apiGet(`${URLS.RECORD_LAVORAZIONI_CERTIFICATO}${record.id}/`).then((res) =>
      setData(res)
    );
  }, [record.id]);
  if (!data) {
    return (
      <div className="h-[90vh] flex justify-center">
        <Spinner animation="border" role="status" className="mt-[20vh]" />
      </div>
    );
  }
  const certificato = data.articolo.scheda_controllo?.certificati;
  const scheda_controllo = data.articolo.scheda_controllo;
  const controlli = scheda_controllo?.sezioni
    ?.map((sez) => sez.controlli.filter((c) => !!c.frequenza))
    .flat();
  if (!scheda_controllo) {
    return <NoSchedaControllo articolo={data.articolo} indietro={indietro} />;
  }
  if (!certificato) {
    return (
      <NoCertificato scheda_controllo={scheda_controllo} indietro={indietro} />
    );
  }
  if (!data.completata) {
    return (
      <NonCompletata
        record_lavorazione={data}
        indietro={indietro}
        onSuccess={(newData) => {
          setData(newData);
          setSuccessToast("Scheda completata con successo !");
          setTimeout(() => setSuccessToast(false), 1000 * 3);
        }}
      />
    );
  }
  return (
    <div className="mb-10">
      {successToast && <MyToast>{successToast}</MyToast>}
      <Table bordered className="mt-12 align-middle border-gray-300">
        <tbody>
          <tr>
            <td rowSpan={2}>
              <img src={SG} alt="SuperGalvanica" />
            </td>
            <td className="w-2/5">
              <h3 className="font-medium text-xl">Certificato di Controllo</h3>
              <p>secondo EN 10204 Tipo 3.1</p>
            </td>
            <td rowSpan={2}>
              <img src={ICIM} alt="Icim" />
            </td>
          </tr>
          <tr className="text-blue-800">
            <td>
              <h3 className="font-medium text-lg">Control Certificate</h3>
              <p className="text-sm">according to EN 10204 Type 3.1</p>
            </td>
          </tr>
        </tbody>
      </Table>
      <Table bordered className="text-sm align-middle border-gray-300">
        <tbody>
          <tr>
            <td className="text-left w-7/10 flex justify-between">
              <div className="my-auto">
                CERTIFICATO N°{" "}
                <span className="ml-4 text-blue-800">Certificate No.</span>
              </div>
              <div className="text-center font-semibold">
                <Input
                  name="certificato_n"
                  label={false}
                  inputProps={{
                    value: DDT,
                    onChange: (e) => setDDT(e.target.value),
                  }}
                />
              </div>
              <div></div>
            </td>
            <td className="w-1/3" style={{ borderLeft: 0 }}>
              <div className="flex items-center justify-evenly">
                Cormano,
                <Input
                  name="data"
                  label={false}
                  inputProps={{
                    defaultValue: today(),
                  }}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
      <Table
        bordered
        className="text-sm text-left align-middle border-gray-300"
      >
        <tbody>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0 }}>
              Cliente
            </td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0 }}>
              Customer
            </td>
            <td className="w-3/5">
              <p className="font-semibold">{data.articolo.cliente.nome}</p>
              <p>{data.articolo.cliente.indirizzo}</p>
              <p>
                {data.articolo.cliente.cap} {data.articolo.cliente.città}
              </p>
            </td>
          </tr>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0 }}>
              Articolo
            </td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0 }}>
              Part Number
            </td>
            <td className="w-3/5 font-semibold">
              {data.articolo.nome} - {data.articolo.codice}
              {data.articolo.descrizione && ` (${data.articolo.descrizione})`}
            </td>
          </tr>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0 }}>
              Quantità
            </td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0 }}>
              Quantity
            </td>
            <td className="w-3/5 font-semibold">
              <Input
                name="quantità"
                label={false}
                inputProps={{
                  className: "text-left pl-3 w-1/4",
                  type: "number",
                  defaultValue: data.quantità,
                }}
              />
            </td>
          </tr>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0 }}>
              Nostro DDT N°
            </td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0 }}>
              Our Delivery Note No.
            </td>
            <td className="w-3/5">
              <Hidden name="nostro_ddt" value={ddtNumber(DDT)} />
              {ddtNumber(DDT)}
            </td>
          </tr>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0 }}>
              Nostro lotto N°
            </td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0 }}>
              Our Batch No.
            </td>
            <td className="w-3/5">
              {data.n_lotto_super ? (
                data.n_lotto_super
              ) : (
                <Input
                  name="n_lotto_super"
                  label={false}
                  inputProps={{ className: "text-left pl-3" }}
                />
              )}
            </td>
          </tr>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0 }}>
              Commessa Cliente N°
            </td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0 }}>
              Customer Batch No.
            </td>
            <td className="w-3/5">
              {data.n_lotto_cliente ? (
                data.n_lotto_cliente
              ) : (
                <Input
                  name="n_lotto_cliente"
                  label={false}
                  inputProps={{ className: "text-left pl-3" }}
                />
              )}
            </td>
          </tr>
        </tbody>
      </Table>
      <Table bordered className="align-middle border-gray-300">
        <tbody className="font-semibold">
          <tr>
            <td>{certificato.dichiarazione}</td>
          </tr>
          <tr className="text-blue-800">
            <td>{certificato.dichiarazione_en}</td>
          </tr>
        </tbody>
      </Table>
      <div className="text-left flex items-center mb-6 ml-2 font-semibold">
        <h4>ESITO CONTROLLI ESEGUITI</h4>
        <p className="ml-4 text-blue-800">Performed checks results</p>
      </div>
      <div className="mb-6">
        {certificato.tests.map((test, idx) => {
          const controllo = controlli.find((c) => c.id === test.controllo);
          const record_controllo = data.record_controlli.find(
            (r) => r.controllo === controllo.id
          );
          const tabella = punti(data, test);
          return (
            <Table
              bordered
              className="text-sm align-middle border-gray-300 mb-10 shadow-sm relative"
              key={test.id}
            >
              <tbody>
                <tr>
                  <td colSpan={test.lavorazione ? 5 : 4} className="relative">
                    <div className="ml-3 text-left font-semibold">
                      {test.titolo}
                      <span className="text-blue-800 ml-2">
                        {test.titolo_en}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td rowSpan={test.metodo || test.metodo_en ? 1 : 2}>
                    <div className="flex items-center justify-between px-3">
                      <div>
                        <p>
                          Specifica di riferimento:{" "}
                          <span className="font-semibold">
                            {test.specifica}
                          </span>
                        </p>
                        <p className="text-blue-800">
                          Specification reference:{" "}
                          <span className="font-semibold">
                            {test.specifica}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td rowSpan={2} className="w-1/4">
                    <div className="flex justify-evenly items-center">
                      <div>
                        <p>N° pezzi testati:</p>
                        <p className="text-blue-800">No. of inspected parts:</p>
                      </div>
                      <div className="font-semibold w-1/5">
                        <Input
                          name={`tests__${idx}__pezzi_testati`}
                          label={false}
                          inputProps={{
                            className: "text-center",
                            defaultValue: record_controllo.pezzi_da_testare,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td
                    rowSpan={2}
                    colSpan={test.lavorazione ? 3 : 2}
                    className="w-1/4 px-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        <p>Esito:</p>
                        <p className="text-blue-800">Result:</p>
                      </div>
                      <div className="font-semibold">
                        {record_controllo.eseguito ? (
                          <>
                            <p>Conforme</p>
                            <p className="text-blue-800">Conforming</p>
                          </>
                        ) : (
                          <>
                            <p className="text-red-800">Non conforme</p>
                            <p className="text-red-800">Not conforming</p>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="relative">
                  {(test.metodo || test.metodo_en) && (
                    <td>
                      <div className="flex items-stretch justify-between px-3">
                        <div className="flex flex-col py-1 justify-between text-left">
                          {test.metodo && (
                            <p>
                              Metodo:{" "}
                              <span className="font-semibold">
                                {test.metodo}
                              </span>
                            </p>
                          )}
                          {test.metodo_en && (
                            <p className="text-blue-800 text-left">
                              Method:{" "}
                              <span className="font-semibold">
                                {test.metodo_en}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
                {test.lavorazione && (
                  <>
                    {tabella.length === 1 && tabella[0].values.length <= 5 ? (
                      <>
                        {tabella[0].values.map((val, index) => (
                          <tr key={index}>
                            <td className="text-left">
                              <span className="pl-4">
                                Campione
                                <span className="text-blue-800"> Sample </span>
                                <span>n° </span>
                                <span className="font-semibold">
                                  {index + 1}
                                </span>
                              </span>
                            </td>
                            <td colSpan={4} className="font-semibold">
                              {val.toFixed(2).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="text-left">
                            <span className="pl-4">Valore minimo </span>
                            <span className="text-blue-800">Minimum value</span>
                          </td>
                          <td colSpan={4} className="font-semibold">
                            {tabella[0].min.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-left">
                            <span className="pl-4">Valore massimo </span>
                            <span className="text-blue-800">Maximum value</span>
                          </td>
                          <td colSpan={4} className="font-semibold">
                            {tabella[0].max.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-left">
                            <span className="pl-4">Media </span>
                            <span className="text-blue-800">Mean</span>
                          </td>
                          <td colSpan={4} className="font-semibold">
                            {tabella[0].med.toLocaleString()}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr className="font-semibold">
                          <td rowSpan={1 + tabella.length}></td>
                          <td></td>
                          <td>Min</td>
                          <td>Med</td>
                          <td>Max</td>
                        </tr>
                        {tabella.map((values, index) => (
                          <tr key={index}>
                            <td className="text-left">
                              Punto{" "}
                              <span className="text-blue-800">Point</span>{" "}
                              n°{" "}
                              <span className="font-semibold">
                                {index + 1}
                              </span>
                            </td>
                            <td className="font-semibold w-1/12">
                              {values.min}
                            </td>
                            <td className="font-semibold w-1/12">
                              {values.med}
                            </td>
                            <td className="font-semibold w-1/12">
                              {values.max}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </>
                )}
              </tbody>
            </Table>
          );
        })}
      </div>
      <Table
        bordered
        className="text-left align-middle text-sm mt-12 border-gray-300"
      >
        <tbody>
          <tr>
            <td className="font-semibold">
              <span>Il Responsabile Controllo Qualità</span>
              <span className="ml-4 text-blue-800">
                Quality Control Responsible
              </span>
            </td>
            <td className="w-1/3 text-center">Carlo Mauri</td>
          </tr>
        </tbody>
      </Table>
      <Hidden name="file_type" value={fileType} />
      <Button
        type="submit"
        onClick={() => setFileType("word")}
        className="bg-[#0d6efd] w-38 font-medium mt-8"
      >
        Scarica File Word <FontAwesomeIcon icon={faFileWord} className="pl-2" />
      </Button>
      {/* <Button type="submit" onClick={() => setFileType("pdf")} className="bg-[#0d6efd] w-38 font-medium mt-8 ml-16">
        Scarica PDF <FontAwesomeIcon icon={faFilePdf} className="pl-2" />
      </Button> */}
    </div>
  );
}

export default PreviewCertificato;
