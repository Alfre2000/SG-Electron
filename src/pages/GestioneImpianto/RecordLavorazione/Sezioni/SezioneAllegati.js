import React from "react";
import { useState } from "react";
import { Alert, Row } from "react-bootstrap";
import FileField from "../../../../components/form-components/FileField/FileField";
import Hidden from "../../../../components/form-components/Hidden/Hidden";
import { useFormContext } from "../../../../contexts/FormContext";
import { findNestedElement } from "../../../utils";

function SezioneAllegati({ articolo }) {
  const { errors } = useFormContext();
  if (articolo?.scheda_controllo?.allegati?.length > 0) {
    const error = errors
    ? findNestedElement(errors, "record_allegati")?.join(" - ")
    : undefined;
    return (
      <Row className="mb-4 text-left mt-4">
        <p className="uppercase font-semibold text-nav-blue text-lg">
          Allegati
        </p>
        <hr className="h-0 w-28 ml-3 pt-px pb-0.5 bg-nav-blue opacity-90" />
        {articolo.scheda_controllo.allegati.map((allegato, idx) => (
          <Allegato info={allegato} idx={idx} key={idx} />
        ))}
        {error && (
          <Alert
            variant="danger"
            className="text-sm text-center mt-4 p-1.5 w-auto px-5 mx-auto text-red-800"
          >
            Per completare la scheda è necessario caricare tutti gli allegati obbligatori !
          </Alert>
        )}
      </Row>
    );
  }
}

function Allegato({ info, idx }) {
  const { initialData } = useFormContext();
  const [isFilled, setIsFilled] = useState(!!initialData?.record_allegati?.at(idx)?.documento)
  const changeFile = (e) => {
    setIsFilled(e.target.files.length > 0)
  }
  return (
    <div key={info.id} className="flex justify-between items-center mt-2">
      <p className="italic">{info.nome_file}</p>
      <div className="w-2/5">
        <FileField name={`record_allegati__${idx}__documento`} onChange={changeFile} />
      </div>
      {isFilled && (
        <Hidden name={`record_allegati__${idx}__allegato`} value={info.id} />
      )}
    </div>
  );
}

export default SezioneAllegati;
