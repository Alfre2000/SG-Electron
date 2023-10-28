import { faPenRuler } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import ImageModal from "../../../../components/Modals/ImageModal/ImageModal";

function ImmagineSpessore({ articolo }) {
  const [show, setShow] = useState(false);
  const immagineMisurazioni = articolo?.immagini_supporto?.find((img) =>
    img.titolo.includes("spessore")
  );
  return (
    <Card className="text-center min-h-[255px]">
      <Card.Header>
        <FontAwesomeIcon
          icon={faPenRuler}
          className="mr-4 text-lg text-slate-100"
        />
        Punto di misura dello spessore
      </Card.Header>
      <Card.Body className="flex flex-col">
        {immagineMisurazioni ? (
          <img
            src={immagineMisurazioni?.immagine}
            alt="Punto di misura dello spessore"
            className="cursor-zoom-in w-full h-full object-contain my-auto max-h-[208px]"
            onClick={() => setShow(true)}
          />
        ) : (
          <p className="text-gray-400 my-auto italic">
            Nessuna immagine disponibile
          </p>
        )}
        {show && (
          <ImageModal
            setShow={setShow}
            url={immagineMisurazioni?.immagine}
            titolo={immagineMisurazioni?.titolo}
          />
        )}
      </Card.Body>
    </Card>
  );
}

export default ImmagineSpessore;
