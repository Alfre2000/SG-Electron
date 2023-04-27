import { faFilePdf, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Alert, Button, Card, Container, Table } from "react-bootstrap";
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
  const searchBolla = () => {
    getDatiBollaMago(nBolla)
      .then((rows) => {
        console.log(rows);
        setBolla(rows);
      })
      .catch((err) => {
        console.error(err);
      });
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
    apiPost(URLS["CERTIFICATI_BOLLA"], requestData).then((res) => {
      const data = Buffer.from(res.zip_file, "base64");
      electron.ipcRenderer.invoke(
        "save-zip",
        data,
        `Certificati bolla n°${nBolla}`
      );
    });
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
        {bolla &&
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
                    <tr key={idx}>
                      <td>{lotto.trattamento1}</td>
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
