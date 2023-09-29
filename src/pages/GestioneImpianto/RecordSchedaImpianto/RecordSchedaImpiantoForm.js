import React from "react";
import { Col, Row, Form, Alert } from "react-bootstrap";
import Input from "../../../components/form-components/Input";
import TimeInput from "../../../components/form-components/TimeInput/TimeInput";
import { searchOptions } from "../../../utils";
import SearchSelect from "../../../components/form-components/SearchSelect";
import Fieldset from "../../../components/form-components/Fieldset";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import DateInput from "../../../components/form-components/DateInput/DateInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useFormContext } from "../../../contexts/FormContext";
import DocList from "./DocList";
import TabellaNestedItems from "../../../components/form-components/TabellaNestedItems/TabellaNestedItems";
import TabellaCheckBox from "../../../components/form-components/TabellaCheckBox/TabellaCheckBox";

function RecordSchedaImpiantoForm({ data, warning }) {
  const { initialData } = useFormContext();
  const schedaImpianto = Array.isArray(data.schede_impianto)
    ? data.schede_impianto[0]
    : data.schede_impianto;
  const aggiunteSuccessive = schedaImpianto.aggiunte.filter(
    (agg) => agg.iniziale === false
  );
  const aggiunteIniziali = schedaImpianto.aggiunte.filter(
    (el) => el.iniziale === true
  );
  const checkAll = (name) => {
    const checkboxes = [
      ...document.querySelectorAll(`input[type="checkbox"][name*="${name}"]`),
    ];
    checkboxes.forEach((el) => (el.checked = true));
  };
  return (
    <>
      <Row className="mb-4 mt-4">
        <Hidden name="scheda_impianto" value={schedaImpianto.id} />
        <Col xs={4}>
          <DateInput />
        </Col>
        <Col xs={3}>
          <TimeInput />
        </Col>
        <Col xs={5}>
          <SearchSelect
            name="operatore"
            options={searchOptions(data?.operatori, "nome")}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Fieldset
          title={
            <div>
              Verifiche Iniziali{" "}
              <FontAwesomeIcon
                icon={faCheck}
                onClick={() => checkAll("record_verifiche_iniziali")}
                className=" border-stone-300 border-1 rounded-full ml-2 relative top-1 bg-slate-50 p-1 h-4 w-4 cursor-pointer"
              />
            </div>
          }
        >
          <TabellaCheckBox
            items={schedaImpianto.verifiche_iniziali}
            checkName="eseguito"
            itemName="verifica_iniziale"
            listName="record_verifiche_iniziali"
          />
        </Fieldset>
        {warning && (
          <Alert
            variant="warning"
            className="py-2 w-[60%] m-auto font-semibold"
          >
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              size="lg"
              className="mr-4"
            />
            Non sono state completate tutte le verifiche iniziali
          </Alert>
        )}
      </Row>
      {aggiunteIniziali.length > 0 && (
        <Row className="mb-4">
          <Fieldset
            title={
              <div>
                Aggiunte Iniziali{" "}
                <FontAwesomeIcon
                  icon={faCheck}
                  onClick={() => checkAll("record_aggiunte")}
                  className=" border-stone-300 border-1 rounded-full ml-2 relative top-1 bg-slate-50 p-1 h-4 w-4 cursor-pointer"
                />
              </div>
            }
          >
            <TabellaCheckBox
              items={aggiunteIniziali}
              checkName="eseguito"
              itemName="aggiunta"
              listName="record_aggiunte"
              hiddens={[{ name: "iniziale", value: true }]}
              initialData={{
                ...initialData,
                record_aggiunte:
                  initialData?.record_aggiunte?.filter((el) => el.iniziale) || [],
              }}
            />
          </Fieldset>
        </Row>
      )}
      {aggiunteSuccessive.length > 0 && (
        <Fieldset title="Aggiunte successive" className="mb-4">
          <TabellaNestedItems
            name="record_aggiunte"
            initialData={{
              ...initialData,
              record_aggiunte:
                initialData?.record_aggiunte?.filter((agg) => !agg.iniziale) ||
                [],
            }}
            startIndex={aggiunteIniziali.length}
            colonne={[
              { name: "data", type: "date" },
              { name: "ora", type: "time" },
              {
                name: "aggiunta",
                type: "select",
                options: searchOptions(aggiunteSuccessive, "materiale"),
              },
              { name: "eseguito", type: "hidden", value: "on" },
              { name: "iniziale", type: "hidden", value: "off" },
            ]}
          />
        </Fieldset>
      )}
      <Row className="mb-4 text-left">
        <Form.Group>
          <Form.Label className="mt-2">Operazioni straordinarie:</Form.Label>
          <Input
            label={false}
            inputProps={{ as: "textarea", rows: 3, className: "text-left" }}
            name="malfunzionamenti"
          />
        </Form.Group>
      </Row>
      <Row className="mb-4 text-left">
        <Form.Group>
          <Form.Label className="mt-2">
            Eventuali malfunzionamenti - fermi linea - non conformità prodotti:
          </Form.Label>
          <Input
            label={false}
            inputProps={{ as: "textarea", rows: 3, className: "text-left" }}
            name="operazioni_straordinarie"
          />
        </Form.Group>
      </Row>
      {schedaImpianto?.documenti_supporto?.length > 0 && (
        <DocList documenti={schedaImpianto.documenti_supporto} />
      )}
    </>
  );
}

export default RecordSchedaImpiantoForm;
