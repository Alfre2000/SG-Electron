import React from "react";
import { Table } from "react-bootstrap";
import Checkbox from "../../../../components/form-components/Checkbox";
import Hidden from "../../../../components/form-components/Hidden/Hidden";
import { useFormContext } from "../../../../contexts/FormContext";
import PopoverMisurazioni from "../PopoverMisurazioni";
import Sezione from "./Sezione";

function SezioneControlli({ data, articolo }) {
  const { initialData, view } = useFormContext();
  let indexControllo = -1
  if (!articolo?.scheda_controllo?.sezioni?.length > 0) {
    return null;
  }
  const sezioni = articolo.scheda_controllo.sezioni.sort((a, b) => a.nome.localeCompare(b.nome))
  return (
    <Sezione title="Controlli da effettuare">
      <Table className="align-middle text-center" bordered>
        <thead>
          <tr>
            <th>Cosa</th>
            <th>Quanti</th>
            <th>Chi</th>
            <th>Eseguito</th>
          </tr>
        </thead>
        <tbody>
          {sezioni.map((sezione) => (
              <React.Fragment key={sezione.id}>
                <tr>
                  <td
                    colSpan="4"
                    className="text-left uppercase font-medium text-nav-blue"
                  >
                    {sezione.nome}
                  </td>
                </tr>
                {sezione.controlli.map((controllo) => {
                  indexControllo += 1;
                  const record = initialData?.record_controlli?.find(rec => rec.controllo === controllo.id)
                  if (controllo.frequenza || controllo.responsabilità) {
                    return (
                      <tr className="text-sm" key={controllo.id}>
                        <td
                          className="text-left py-1.5"
                          style={{ paddingLeft: "1.5em" }}
                        >
                          {controllo.nome}
                        </td>
                        <td className="py-1.5">
                          {controllo.frequenza}
                          {controllo.misurazioni.length > 0 && (
                            <>
                              <br />
                              <PopoverMisurazioni
                                data={data}
                                idxControllo={indexControllo}
                                controllo={controllo}
                                initialData={record}
                                view={view}
                                articolo={articolo}
                              />
                            </>
                          )}
                        </td>
                        <td className="py-1.5">{controllo.responsabilità}</td>
                        <td className="py-1.5">
                          {initialData?.record_controlli && (
                            <Hidden
                              name={`record_controlli__${indexControllo}__id`}
                              value={record?.id || undefined}
                            />
                          )}
                          <Hidden
                            value={controllo.id}
                            name={`record_controlli__${indexControllo}__controllo`}
                          />
                          <Checkbox
                            label={false}
                            name={`record_controlli__${indexControllo}__eseguito`}
                            inputProps={{
                              className: "bigger-checkbox",
                              defaultChecked: record ? record?.eseguito : false
                            }}
                            vertical={true}
                          />
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr className="text-sm" key={controllo.id}>
                        <td
                          colSpan="4"
                          className="text-left py-1.5"
                          style={{ paddingLeft: "1.5em" }}
                        >
                          • {controllo.nome}
                        </td>
                      </tr>
                    );
                  }
                })}
              </React.Fragment>
            )
          )}
        </tbody>
      </Table>
    </Sezione>
  );
}

export default SezioneControlli;
