import {
  faCircleExclamation,
  faFilePdf,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Spinner,
  Table,
} from "react-bootstrap";
import { apiPost } from "../../../api/api";
import { getDatiBollaMago } from "../../../api/mago";
import Checkbox from "../../../components/form-components/Checkbox";
import Input from "../../../components/form-components/Input";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Wrapper from "../Wrapper";

const electron = window?.require ? window.require("electron") : null;

function CertificatiBolla() {
  const [nBolla, setNBolla] = useState("");
  const [bolla, setBolla] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCertificati, setLoadingCertificati] = useState(false);
  const searchBolla = () => {
    setLoading(true);
    setError(false);
    getDatiBollaMago(nBolla)
      .then((rows) => {
        setError(false);
        console.log(rows);
        setBolla(rows);
      })
      .catch((err) => {
        setError(true);
        setTimeout(() => setError(false), 1000 * 60 * 2);
      })
      .finally(() => setLoading(false));
  };
  const generaPDF = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let formData = Object.fromEntries(new FormData(form).entries());
    const requestData = { ...bolla };
    requestData.lotti = requestData.lotti.filter(
      (lotto, idx) => formData[`lotto_${idx}`] === "on"
    );
    console.log(requestData);
    setLoadingCertificati(true);

    apiPost(URLS["CERTIFICATI_BOLLA"], requestData)
      .then((res) => {
        const data = Buffer.from(res.zip_file, "base64");
        electron.ipcRenderer.invoke(
          "save-zip",
          data,
          `Certificati bolla n°${nBolla}`
        );
      })
      .catch((err) => setError(err.errors))
      .finally(() => setLoadingCertificati(false));
  };
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Certificati Bolla</PageTitle>
        <Card className="mt-10 max-w-2xl mx-auto">
          <Card.Header as="h6" className="font-semibold text-lg">
            Ricerca Bolla
          </Card.Header>
          <Card.Body className="px-5 flex justify-around align-middle mt-3 mb-1">
            <div className="w-3/4">
              <Input
                name="n_bolla"
                label="Numero Bolla"
                labelCols={5}
                inputProps={{
                  value: nBolla,
                  onChange: (e) => setNBolla(e.target.value),
                }}
              />
            </div>
            <Button
              variant="primary"
              className="bg-[#0d6efd] mb-1 relative -top-1"
              onClick={searchBolla}
            >
              Cerca
            </Button>
          </Card.Body>
        </Card>
        {loadingCertificati && (
          <div className="h-[100vh] w-[84%] fixed left-[240px] top-[57px] flex justify-center bg-slate-50 z-50 opacity-80">
            <div className="mt-[50vh]">
              <h3 className="text-lg font-semibold">
                Generazione certificati in corso...
              </h3>
              <Spinner
                animation="border"
                role="status"
                className="mt-3"
                variant="secondary"
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="h-[40vh] flex justify-center">
            <Spinner
              animation="border"
              role="status"
              className="mt-[20vh]"
              variant="secondary"
            />
          </div>
        )}
        {error === true && !loading && !loadingCertificati && (
          <Alert
            className="text-center mt-10 w-1/2 py-3 mx-auto flex justify-center"
            variant="danger"
          >
            <FontAwesomeIcon
              size="lg"
              className="mr-3"
              icon={faCircleExclamation}
            />
            <h3 className="text-md font-semibold mx-3">
              Errore di connessione al database !
            </h3>
          </Alert>
        )}
        {bolla &&
          !loading &&
          (bolla.lotti.length > 0 ? (
            <form onSubmit={generaPDF}>
              <Table
                bordered
                className="text-sm align-middle border-gray-300 mb-10 shadow-sm relative mt-16"
              >
                <tbody>
                  <tr>
                    <td>
                      <span>Numero Bolla:</span>
                      <span className="font-semibold ml-2">{bolla.docno}</span>
                    </td>
                    <td>
                      <span>Data:</span>
                      <span className="font-semibold ml-2">
                        {new Date(bolla.documentdate).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span>Cliente:</span>
                      <span className="font-semibold ml-2">
                        {bolla.companyname}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <div className="flex items-center">
                <h3 className="text-left font-semibold text-lg">LOTTI:</h3>
                <span className="ml-2 text-sm">
                  (indicare i lotti di cui si vogliono generare i certificati)
                </span>
              </div>
              <Table
                bordered
                className="text-sm align-middle border-gray-300 mb-10 shadow-sm relative mt-2"
              >
                <thead>
                  <tr>
                    <th>Trattamento</th>
                    <th>Descrizione</th>
                    <th>Codice articolo</th>
                    <th>UM</th>
                    <th>Quantità</th>
                    <th>Certificato?</th>
                  </tr>
                </thead>
                <tbody>
                  {bolla.lotti.map((lotto, idx) => (
                    <tr key={idx} className="relative">
                      <td>
                        {error &&
                          !loadingCertificati &&
                          error?.includes(lotto.line) && (
                            <FontAwesomeIcon
                              icon={faCircleExclamation}
                              className="absolute -left-8 text-red-800"
                              size="lg"
                            />
                          )}
                        {lotto.trattamento1}
                      </td>
                      <td>{lotto.description}</td>
                      <td>{lotto.item}</td>
                      <td>{lotto.uom}</td>
                      <td>{lotto.qty}</td>
                      <td>
                        <Checkbox
                          name={`lotto_${idx}`}
                          label={false}
                          inputProps={{ className: "text-2xl" }}
                          vertical={true}
                          initialData={{
                            [`lotto_${idx}`]: !!lotto.trattamento1,
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button
                variant="primary"
                type="submit"
                className="bg-[#0d6efd] mb-1 relative -top-1"
              >
                Genera Certificati
                <FontAwesomeIcon icon={faFilePdf} className="ml-3" />
              </Button>
              {error && error.length > 0 && !loadingCertificati && (
                <Alert
                  className="text-center mt-8 w-4/5 py-2 mx-auto flex justify-center"
                  variant="danger"
                >
                  <h3 className="text-sm font-semibold mx-3">
                    I lotti indicati come{" "}
                    <FontAwesomeIcon icon={faCircleExclamation} />, si
                    riferiscono ad articoli di cui non sono state salvate le
                    informazioni nel database Mago.
                    <br />
                    Aggiungere le informazioni e ricaricare la pagina per poter
                    generare i certificati.
                  </h3>
                </Alert>
              )}
            </form>
          ) : (
            <Alert
              className="text-center mt-10 w-1/2 py-3 mx-auto flex justify-center"
              variant="warning"
            >
              <FontAwesomeIcon icon={faWarning} className="relative top-0.5" />
              <h3 className="text-md font-semibold mx-3">
                La bolla non è stata trovata
              </h3>
              <FontAwesomeIcon icon={faWarning} className="relative top-0.5" />
            </Alert>
          ))}
      </Container>
    </Wrapper>
  );
}

export default CertificatiBolla;
