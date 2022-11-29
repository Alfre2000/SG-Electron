import React from "react";
import { Button } from "react-bootstrap";
import { apiUpdate } from "../../../../api/api";
import { URLS } from "../../../../urls";

function NonCompletata({ record_lavorazione, indietro, onSuccess }) {
  const completa = () => {
    const url = `${URLS.RECORD_LAVORAZIONI_CERTIFICATO}${record_lavorazione.id}/`;
    const body = { completata: "on" };
    apiUpdate(url, body).then(onSuccess);
  }
  return (
    <div className="h-[90vh] flex justify-center">
      <div className="border-gray-500 mt-[10vh] shadow-lg h-fit p-4 rounded-md text-left">
        <h2 className="font-semibold text-lg">Scheda Controllo Incompleta</h2>
        <hr className="mb-3 mt-2" />
        <p>La scheda di controllo non è ancora stata completata.</p>
        <p>Vuoi completarla automaticamente ora ?</p>
        <div className="flex justify-end mt-3">
          <Button
            variant="primary"
            className="bg-[#0d6efd] py-1 mr-4"
            onClick={completa}
          >
            Completa
          </Button>
          <Button
            variant="secondary"
            className="bg-gray-400 border-gray-400 py-1"
            onClick={indietro}
          >
            Indietro
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NonCompletata;
