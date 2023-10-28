import React from "react";
import { Row } from "react-bootstrap";
import Fieldset from "../../../components/form-components/Fieldset";
import SearchSelect from "../../../components/form-components/SearchSelect";
import TabellaNestedItems from "../../../components/form-components/TabellaNestedItems/TabellaNestedItems";
import { useFormContext } from "../../../contexts/FormContext";
import { searchOptions } from "../../../utils";
import useCustomQuery from "../../../hooks/useCustomQuery/useCustomQuery";
import { URLS } from "../../../urls";

function SchedaImpiantoForm() {
  const { data: impianti } = useCustomQuery({ queryKey: URLS.IMPIANTI });
  const { data: materiali } = useCustomQuery({ queryKey: URLS.MATERIALI });
  const { data: schedeImpianto } = useCustomQuery({ queryKey: [URLS.SCHEDE_IMPIANTO, { page: 1 }] });

  const { initialData } = useFormContext();
  const impiantiSchede = schedeImpianto
    ? schedeImpianto.results.map((el) => el.impianto)
    : [];
  const freeImpianti = impianti
    ? impianti.filter(
        (impianto) =>
          !impiantiSchede.includes(impianto.id) ||
          (!!initialData && impianto.id === initialData.impianto)
      )
    : [];
  const aggiunteIniziali = initialData?.aggiunte
    ? {
        ...initialData,
        aggiunte: initialData.aggiunte.filter((a) => a.iniziale),
      }
    : initialData;
  const aggiunteSuccessive = initialData?.aggiunte
    ? {
        ...initialData,
        aggiunte: initialData.aggiunte.filter((a) => !a.iniziale),
      }
    : initialData;
  return (
    <>
      <Row className="mb-4 mx-auto w-3/5">
        <SearchSelect
          name="impianto"
          options={searchOptions(freeImpianti, "nome")}
        />
      </Row>
      <Fieldset title="verifiche iniziali">
        <TabellaNestedItems
          name="verifiche_iniziali"
          colonne={[{ name: "nome" }]}
        />
      </Fieldset>
      <Fieldset title="aggiunte iniziali">
        <TabellaNestedItems
          name="aggiunte"
          initialData={aggiunteIniziali}
          colonne={[
            {
              name: "materiale",
              type: "select",
              createTable: true,
              options: searchOptions(materiali, "nome", true),
            },
            { name: "iniziale", type: "hidden", value: true },
          ]}
        />
      </Fieldset>
      <Fieldset title="possibili aggiunte successive">
        <TabellaNestedItems
          name="aggiunte"
          initialData={aggiunteSuccessive}
          startIndex={20}
          colonne={[
            {
              name: "materiale",
              type: "select",
              createTable: true,
              options: searchOptions(materiali, "nome", true),
            },
            { name: "iniziale", type: "hidden", value: "off" },
          ]}
        />
      </Fieldset>
      <Fieldset title="documenti di supporto">
        <TabellaNestedItems
          name="documenti_supporto"
          colonne={[{ name: "titolo" }, { name: "documento", type: "file" }]}
        />
      </Fieldset>
    </>
  );
}

export default SchedaImpiantoForm;
