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
      console.log(finalFormData);
      const file = Buffer.from(res.doc, "base64");
      const defaultName = `Certificato ${record.articolo} ${
        record.n_lotto_cliente || record.n_lotto_super
      }.${finalFormData.file_type === "pdf" ? "pdf" : "docx"}`;
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
