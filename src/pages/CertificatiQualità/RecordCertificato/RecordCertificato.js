import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { apiPost } from "../../../api/api";
import MyToast from "../../../components/MyToast/MyToast";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import Wrapper from "../Wrapper";
import PreviewCertificato from "./PreviewCertificato";
import SelezioneLotto from "./SelezioneLotto";
const electron = window?.require ? window.require("electron") : null;

const fileNameCertificato = (formData, record) => {
  const [day, month, year] = formData.data.split('/')
  const data = year + '_' + month + '_' + day
  const codice = record.articolo.split('(').at(-1).split(')')[0].split('/')[0]
  const extension = formData.file_type === "pdf" ? "pdf" : "docx"
  const DDTNumber = formData.nostro_ddt + '_' + (formData.certificato_n.split('.')[2] || "")
  return `${data}_Certificato ${DDTNumber} Art ${codice}.${extension}`
}

function RecordCertificato() {
  const [data, setData] = useGetAPIData([
    { nome: "records", url: URLS.RECORD_LAVORAZIONI_SEARCH },
    { nome: "clienti", url: URLS.CLIENTI },
    { nome: "impianti", url: URLS.IMPIANTI },
  ]);
  const [record, setRecord] = useState(null);
  const [successToast, setSuccessToast] = useState(false);
  const indietro = () => setRecord(null);
  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let formData = Object.fromEntries(new FormData(form).entries());
    const finalFormData = new FormData();
    Object.entries(formData).forEach((obj) =>
      finalFormData.append(obj[0], obj[1])
    );
    apiPost(`${URLS.CREA_CERTIFICATO}${record.id}/`, finalFormData).then((res) => {
      const file = Buffer.from(res.doc, "base64");
      const defaultName = fileNameCertificato(formData, record)
      electron.ipcRenderer.invoke("save-certificato", file, defaultName);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    });
  };
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Certificati</PageTitle>
        {!record ? (
          <SelezioneLotto data={data} setData={setData} setRecord={setRecord} />
        ) : (
          <div className="relative">
            <Button
              variant="secondary"
              className="absolute font-medium left-full bg-gray-400 border-gray-400 -translate-x-full -translate-y-[120%] flex items-center"
              onClick={indietro}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="pr-2 mt-0.5" />
              Indietro
            </Button>
            <form onSubmit={onSubmit}>
              <PreviewCertificato record={record} indietro={indietro} />
            </form>
          </div>
        )}
        {successToast && <MyToast>Certificato creato con successo !</MyToast>}
      </Container>
    </Wrapper>
  );
}

export default RecordCertificato;
