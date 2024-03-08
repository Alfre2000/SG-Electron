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
import { getDatiEtichettaMago } from "../../../api/mago";
import Checkbox from "../../../components/form-components/Checkbox";
import Input from "../../../components/form-components/Input";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Wrapper from "@ui/wrapper/Wrapper";

const electron = window?.require ? window.require("electron") : null;

function EtichetteMTA() {
  const year = new Date().getFullYear().toString().slice(-2);

  const [nLotto, setNLotto] = useState(year + "/");
  const [lotto, setLotto] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDati, setLoadingDati] = useState(false);
  const [noMTA, setNoMTA] = useState(false);

  const searchEtichette = () => {
    setLoading(true);
    setError(false);
    getDatiEtichettaMago(nLotto)
      .then((rows) => {
        setError(false);
        console.log(rows);
        if (rows.filter((row) => row.companyname !== "MTA S.P.A.").length > 0) {
          setNoMTA(true);
        } else {
          setLotto(rows);
        }
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
    const requestData = lotto.filter(
      (lotto, idx) => formData[`lotto_${idx}`] === "on"
    );
    console.log(requestData);
    setLoadingDati(true);

    apiPost(URLS["ETICHETTE_MTA"], requestData)
      .then((res) => {
        setError(false);
        const data = Buffer.from(res.zip_file, "base64");
        electron.ipcRenderer.invoke(
          "save-zip",
          data,
          `Etichette lotto ${nLotto.replace("/", "-")}`
        );
      })
      .catch((err) => console.log(Object.keys(error)) || setError(err))
      .finally(() => setLoadingDati(false));
  };
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Etichette MTA</PageTitle>
        <Card className="mt-10 max-w-2xl mx-auto">
          <Card.Header as="h6" className="font-semibold text-lg">
            Ricerca Lotto SuperGalvanica
          </Card.Header>
          <Card.Body className="px-5 flex justify-around align-middle mt-3 mb-1">
            <div className="w-3/4">
              <Input
                name="n_lotto"
                label="Numero Lotto"
                labelCols={5}
                inputProps={{
                  value: nLotto,
                  onChange: (e) => setNLotto(e.target.value),
                }}
              />
            </div>
            <Button
              variant="primary"
              className="bg-[#0d6efd] mb-1 relative -top-1"
              onClick={searchEtichette}
            >
              Cerca
            </Button>
          </Card.Body>
        </Card>
        {loadingDati && (
          <div className="h-[100vh] w-[84%] fixed left-[240px] top-[57px] flex justify-center bg-slate-50 z-50 opacity-80">
            <div className="mt-[50vh]">
              <h3 className="text-lg font-semibold">
                Generazione etichette in corso...
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
        {noMTA === true && !loading && !loadingDati && (
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
              Il lotto cercato non è di MTA
            </h3>
          </Alert>
        )}
        {error === true && !loading && !loadingDati && (
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
        {lotto &&
          !loading &&
          (lotto.length > 0 ? (
            <form onSubmit={generaPDF}>
              <div className="flex items-center mt-16 mb-3">
                <h3 className="text-left font-semibold text-lg">PARTITE:</h3>
                <span className="ml-2 text-sm">
                  (indicare le righe di cui si vogliono generare le etichette)
                </span>
              </div>
              <Table
                bordered
                className="text-sm align-middle border-gray-300 mb-10 shadow-sm relative mt-2"
              >
                <thead>
                  <tr>
                    <th>Riga</th>
                    <th>Codice articolo</th>
                    <th>Descrizione</th>
                    <th>UM</th>
                    <th>Quantità</th>
                    <th>Etichetta?</th>
                  </tr>
                </thead>
                <tbody>
                  {lotto.map((lotto, idx) => (
                    <tr key={idx} className="relative">
                      <td>
                        {error &&
                          !loadingDati &&
                          Object.keys(error)?.includes(lotto.line.toString()) && (
                            <FontAwesomeIcon
                              icon={faCircleExclamation}
                              className="absolute -left-8 text-red-800"
                              size="lg"
                            />
                          )}
                        {lotto.line}
                      </td>
                      <td>{lotto.item}</td>
                      <td>{lotto.description}</td>
                      <td>{lotto.uom}</td>
                      <td>{lotto.qty}</td>
                      <td>
                        <Checkbox
                          name={`lotto_${idx}`}
                          label={false}
                          inputProps={{ className: "text-2xl" }}
                          vertical={true}
                          initialData={{
                            [`lotto_${idx}`]: true,
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
                Genera Etichette
                <FontAwesomeIcon icon={faFilePdf} className="ml-3" />
              </Button>
              {error && !loadingDati && (
                <>
                  <Alert
                    className="text-center mt-8 w-4/5 py-2 mx-auto flex flex-col justify-center"
                    variant="danger"
                  >
                    <h3 className="text-sm font-semibold mx-3">
                      Le righe indicate con{" "}
                      <FontAwesomeIcon icon={faCircleExclamation} />, si
                      riferiscono ad articoli di cui non sono state salvate le
                      informazioni nel database.
                      <br />
                      Aggiungere le informazioni e ricaricare la pagina per
                      poter generare le etichette.
                    </h3>
                  {/* <ul className="mx-auto">
                    {Object.entries(error).map(([key, value]) => (
                      <li className="text-left list-disc ml-14" key={key}>Riga {key}: {value}</li>
                    ))}
                  </ul> */}
                  </Alert>
                </>
              )}
            </form>
          ) : (
            <Alert
              className="text-center mt-10 w-1/2 py-3 mx-auto flex justify-center"
              variant="warning"
            >
              <FontAwesomeIcon icon={faWarning} className="relative top-0.5" />
              <h3 className="text-md font-semibold mx-3">
                Il lotto non è stato trovato
              </h3>
              <FontAwesomeIcon icon={faWarning} className="relative top-0.5" />
            </Alert>
          ))}
      </Container>
    </Wrapper>
  );
}

export default EtichetteMTA;
