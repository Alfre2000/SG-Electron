import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NoSchedaControllo({ articolo, indietro }) {
  return (
    <div className="h-[90vh] flex justify-center">
      <div className="border-gray-500 mt-[10vh] shadow-lg h-fit p-4 rounded-md text-left">
        <h2 className="font-semibold text-lg">Scheda Controllo Assente</h2>
        <hr className="mb-3 mt-2" />
        <p>La scheda controllo dell'articolo selezionato non è ancora presente</p>
        <p>Vuoi crearla ora ?</p>
        <div className="flex justify-end mt-3">
          <Link
            to={`/area-admin/scheda-controllo?articoli=${articolo.id}`}
            className="hover:text-white"
          >
            <Button variant="primary" className="bg-[#0d6efd] py-1 mr-4">
              Crea
            </Button>
          </Link>
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

export default NoSchedaControllo;
