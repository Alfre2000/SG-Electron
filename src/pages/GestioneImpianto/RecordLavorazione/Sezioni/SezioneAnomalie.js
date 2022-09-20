import React from "react";
import TabellaNestedItems from "../../../../components/form-components/TabellaNestedItems/TabellaNestedItems";
import Sezione from "./Sezione";

const opzioni = [
  { value: "rilavorazione", label: "Rilavorazione pezzi" },
  { value: "elettricità", label: "Interruzione elettricità" },
  { value: "mec_prim", label: "Guasto meccanico primario che provoca un fermo della macchina" },
  { value: "mec_sec", label: "Guasto meccanico secondario che non provoca un fermo della macchina" },
  { value: "bagni_ripri", label: "Guasto dei bagni galvanici che può essere prontamente ripristinato" },
  { value: "bagni_non_ripri", label: "Guasto dei bagni galvanici che non può essere prontamente ripristinato" },
  { value: "pozzo", label: "Mancanza di acuqa per guasto del pozzo" },
  { value: "altro", label: "Altro" },
]

function SezioneAnomalie() {
  return (
    <Sezione title="Anomalie">
      <TabellaNestedItems
        name="anomalie"
        colonne={[
          { name: "tipologia", type: "select", options: opzioni },
          { name: "pezzi", type: "number", label: "N° pezzi" },
          { name: "causa" },
        ]}
      />
    </Sezione>
  );
}

export default SezioneAnomalie;
