import React from "react";
import { Row } from "react-bootstrap";
import Fieldset from "../../../components/form-components/Fieldset";
import SearchSelect from "../../../components/form-components/SearchSelect";
import TabellaNestedItems from "../../../components/form-components/TabellaNestedItems/TabellaNestedItems";
import { searchOptions } from "../../../utils";

function SchedaImpiantoForm({ data, initialData, errors, view }) {
  const impiantiSchede = data?.records
    ? data.records.results.map((el) => el.impianto)
    : [];
  const freeImpianti = data?.impianti
    ? data.impianti.filter(
        (impianto) =>
          !impiantiSchede.includes(impianto.id) ||
          (!!initialData && impianto.id === initialData.impianto)
      )
    : [];
  return (
    <>
      <Row className="mb-4 mx-auto w-3/5">
        <SearchSelect
          name="impianto"
          initialData={initialData}
          inputProps={{ required: true, isDisabled: view }}
          options={searchOptions(freeImpianti, "nome")}
        />
      </Row>
      <Fieldset title="verifiche iniziali">
        <TabellaNestedItems
          name="verifiche_iniziali"
          view={view}
          initialData={initialData}
          colonne={[{ name: "nome" }]}
        />
      </Fieldset>
      <Fieldset title="aggiunte iniziali">
        <TabellaNestedItems
          name="aggiunte"
          view={view}
          initialData={initialData?.aggiunte ? {...initialData, aggiunte: initialData.aggiunte.filter(a => a.iniziale)} : initialData}
          colonne={[
            {
              name: "materiale",
              type: "select",
              createTable: true,
              options: searchOptions(data?.materiali, "nome", true),
            },
            { name: "iniziale", type: "hidden", value: true },
          ]}
        />
      </Fieldset>
      <Fieldset title="possibili aggiunte successive">
        <TabellaNestedItems
          name="aggiunte"
          view={view}
          initialData={initialData?.aggiunte ? {...initialData, aggiunte: initialData.aggiunte.filter(a => !a.iniziale)} : initialData}
          startIndex={20}
          colonne={[
            {
              name: "materiale",
              type: "select",
              createTable: true,
              options: searchOptions(data?.materiali, "nome", true),
            },
            { name: "iniziale", type: "hidden", value: false },
          ]}
        />
      </Fieldset>
    </>
  );
}

export default SchedaImpiantoForm;
